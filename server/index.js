const express = require('express')
const bodyParser = require("body-parser");
const cors = require("cors")
var db = require("./database.js")
const unirest = require("unirest")
const { v4: uuidv4 } = require('uuid')
const port = 3001;
const app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
const routes = [
  ['Earth','Jupiter'],
  ['Earth','Uranus'],
  ['Mercury','Venus'],
  ['Venus','Mercury'],
  ['Venus','Earth'],
  ['Mars','Venus'],
  ['Jupiter','Mars'],
  ['Jupiter','Venus'],
  ['Saturn','Earth'],
  ['Saturn','Neptune'],
  ['Uranus','Saturn'],
  ['Uranus','Neptune'],
  ['Neptune','Uranus'],
  ['Neptune','Mercury'],
]

// TODO: Look through sql statements to remove *
// Check if 15 limit works and removes reservations etc

function findPaths(origin, destination) {
  let paths = [[destination]]
  while (!paths.every( path => path[path.length-1] === origin )) {
      let pathsNext = []
      paths.forEach( path => {
          if (path[path.length-1] === origin) {
              pathsNext.push(path)
          } else {

              let target = path[path.length-1]
              let sources = routes.filter( route => route[1] === target).map( route => route[0])
              sources.forEach( source => {
                  if (!path.includes(source)) {
                      pathsNext.push([...path, source])
                  }
              })
          }
      })
      paths = [...pathsNext]
  }
  let pathReversed = []
  paths.forEach( path => pathReversed.push(path.reverse()))
  return pathReversed
}
function checkForValidRoutes(path, legs, providers) {
  const cleanedRoutes = []
  const foundRoutes = recursiveValidRoutes(path, legs, providers)
  recursiveCleanRouteArray(foundRoutes, cleanedRoutes)
  return cleanedRoutes
}
function recursiveCleanRouteArray(currentNode, cleanedRoutes) {
  if (Array.isArray(currentNode)) {
      currentNode.forEach( node => recursiveCleanRouteArray(node, cleanedRoutes))
  } else {
      cleanedRoutes.push(currentNode)
  }
}
function recursiveValidRoutes(pathRef, legs, providers, currentPlanetIDX = 0, currentRoutes = [], previousFlightEnd = Date.now()) { 
  // If arrived on planet, got a valid route
  if (currentPlanetIDX === pathRef.length-1) return {providers: currentRoutes}
  // Check for valid routes out of current planet
  const from = pathRef[currentPlanetIDX]
  const to = pathRef[currentPlanetIDX+1]
  const currentLeg = legs.find(leg => leg.from_planet === from && leg.to_planet === to)
  const currentProviders = providers.filter(provider => provider.leg_id === currentLeg.id)
  const nextRoutes = []
  for (let i = 0; i < currentProviders.length; i++) {
      const provider = currentProviders[i]
      const flightStart = new Date(provider.flight_start).getTime()
      if (previousFlightEnd > flightStart) continue
      nextRoutes.push({legID: currentLeg.id, providerID: provider.id, flightEnd: new Date(provider.flight_end).getTime()})
  }
  const foundRoutes = nextRoutes.map( route => recursiveValidRoutes(pathRef, legs, providers, currentPlanetIDX+1, [...currentRoutes, route.providerID], route.flightEnd))
  // const foundRoutes = nextRoutes.map( route => recursiveValidRoutes(pathRef, legs, providers, currentPlanetIDX+1, [...currentRoutes, {legID: route.legID, providerID: route.providerID}], route.flightEnd))
  return foundRoutes
} 
function isRoutelistValid() {
  return new Promise(function(resolve, reject) {
    db_all("SELECT (id, valid_until) FROM routelist ORDER BY valid_until")
    .then(routelist_rows=>{
      if (routelist_rows && routelist_rows.length > 0 && new Date(routelist_rows[0]['valid_until']).getTime() > Date.now()) {
        resolve({valid: true, id: routelist_rows[0].id, validUntil: routelist_rows[0]['valid_until']})
      }
      else {
          unirest("GET", "https://cosmos-odyssey.azurewebsites.net/api/v1.0/TravelPrices")
          .then((response) => {
            const routeList = response.body
  
            // Insert all new data into db
            const legs = routeList.legs.map((leg) => [leg.id, routeList.id, leg.routeInfo.distance, leg.routeInfo.from.name, leg.routeInfo.to.name])
            const providers = routeList.legs.map((leg) => leg.providers.map((provider) => [provider.id, leg.id, provider.price, provider.flightStart, provider.flightEnd, provider.company.name])).flat()
            
            const legsPlaceholders = legs.map(() => "(?, ?, ?, ?, ?)").join(', ')
            const providersPlaceholders = providers.map(() => "(?, ?, ?, ?, ?, ?)").join(', ')
            db_all("SELECT (id) FROM routelist")
            .then((baseRouteListRows)=> {
              if (baseRouteListRows && baseRouteListRows.some((row)=>row.id === routeList.id)) 
                resolve({"message": "success", valid: true, id: routeList.id, validUntil: routeList.validUntil})
              else
                db_run("INSERT OR IGNORE INTO routelist(id, valid_until) VALUES (?, ?)", [routeList.id, routeList.validUntil])
                .then(()=>{
                  db_all("SELECT (id) FROM leg")
                  .then((legRows)=>{
                    if (legRows && legRows.some((leg)=>legs.flat().some((legList)=>legList.id === leg.id))) 
                      resolve({"message": "success", valid: true, id: routeList.id, validUntil: routeList.validUntil})
                    else
                      db_run(`INSERT OR IGNORE INTO leg(id, routelist_id, distance, from_planet, to_planet) VALUES ${legsPlaceholders}`, legs.flat())
                      .then(()=>{
                        db_all(("SELECT (id) FROM provider"))
                        .then((providerRows)=>{
                          if (providerRows && providerRows.some((provider)=>providers.flat().some((providerList)=>providerList.id === provider.id))) 
                            resolve({"message": "success", valid: true, id: routeList.id, validUntil: routeList.validUntil})
                          else
                            db_run(`INSERT OR IGNORE INTO provider(id, leg_id, price, flight_start, flight_end, company) VALUES ${providersPlaceholders}`, providers.flat())
                            .then(()=>{
                              db_all("SELECT (id) FROM routelist ORDER BY valid_until")
                              .then((finalRouteListCheckRows)=>{
                                if(finalRouteListCheckRows?.length > 15) {
                                  const IDStoDelete = finalRouteListCheckRows.filter((row,idx)=>idx>=15).map(row=>`id = '${row.id}'`).join(' OR ')
                                  db_run(`DELETE FROM routelist WHERE ${IDStoDelete}`)
                                  .then(()=>{
                                    resolve({"message": "success", valid: true, id: routeList.id, validUntil: new Date(routeList.validUntil).getTime()})
                                  })
                                  .catch((err)=>reject({valid:false, error: err}))
                                } else {
                                  resolve({"message": "success", valid: true, id: routeList.id, validUntil: new Date(routeList.validUntil).getTime()})
                                }
                              })
                              .catch((err)=>reject({valid:false, error: err}))
                            })
                            .catch((err)=>reject({valid:false, error: err}))
                        })
                        .catch((err)=>reject({valid:false, error: err}))
                      })
                      .catch((err)=>reject({valid:false, error: err}))
                  })                
                  .catch((err)=>reject({valid:false, error: err}))
                })
                .catch((err)=>reject({valid:false, error: err}))
            })
            .catch((err)=>reject({valid:false, error: err}))
          })
          .catch((e) => {reject({valid: false, error: e})})
        }
        
      })
      .catch((err)=>reject({valid:false, error: err}))
  })
}

function processRoutesFromProviderIDSForDisplay(validRoutes, allLegs, allProviders) {
  return validRoutes.map(route => {
    const routeProviders = route.providers.map(providerID => allProviders.find(allProvider => allProvider.id === providerID))
    const routeLegs = routeProviders.map(provider => allLegs.find(leg => leg.id === provider.leg_id))
    return {
      routeProviders: route.providers,
      routeStart: routeProviders[0].flight_start,
      routeEnd: routeProviders[routeProviders.length-1].flight_end,
      path: [routeLegs[0].from_planet, ...routeLegs.map(leg => leg.to_planet)],
      companies: routeProviders.map(provider => provider.company), 
      totalTravelTime: new Date(routeProviders[routeProviders.length-1].flight_end).getTime() - new Date(routeProviders[0].flight_start).getTime(), 
      totalPrice: routeProviders.map(provider => provider.price).reduce((partialSum, a) => partialSum + a, 0),
      totalDistance: routeLegs.map(leg => leg.distance).reduce((partialSum, a) => partialSum + a, 0),
    }
  })
}

async function db_all(query){
  return new Promise(function(resolve,reject){
      db.all(query, function(err,rows){
         if(err){return reject(err);}
         resolve(rows);
       });
  });
}
async function db_run(query, params){
  return new Promise(function(resolve,reject){
      db.run(query, params, function(err,rows){
         if(err){return reject(err);}
         resolve(rows);
       });
  });
}
app.get("/api/routelist", async (req, res) => {
  isRoutelistValid()
  .then((routeList)=> {
    res.json({"message": "success", validUntil: routeList.validUntil, "data": routeList})
  })
  .catch(err => res.status(400).json({"error": err}))
})

app.get("/api/provided-routes/", (req, res) => {
  const fromPlanet = req?.query?.fromplanet?.length > 1 ? `${req?.query?.fromplanet?.charAt(0)?.toUpperCase()}${req?.query?.fromplanet?.slice(1)}` : req?.query?.fromplanet
  const toPlanet = req?.query?.toplanet?.length > 1 ? `${req?.query?.toplanet?.charAt(0)?.toUpperCase()}${req?.query?.toplanet?.slice(1)}` : req?.query?.toplanet
  
  const planetNames = [ "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune" ]
  if (!fromPlanet || !toPlanet) {
    isRoutelistValid()
    .then((routeList)=> {
      res.json({"message": `Missing query fromPlanet and toPlanet, updated routelists`, validUntil: routeList.validUntil, data:[]})
    })
    .catch((err)=> res.status(400).json({"error": err}))
  }
  else if (!planetNames.includes(fromPlanet) || !planetNames.includes(toPlanet)) res.status(400).json({"error": "query must be planet names, got " +fromPlanet + " & " + toPlanet})
  else if (fromPlanet.toLowerCase() === toPlanet.toLowerCase()) res.status(400).json({"error": "planet names must be different"})
  else {

    isRoutelistValid()
    .then((routeList) => {
      const routeListID = routeList.id
      db_all(`SELECT * FROM leg WHERE routelist_id = '${routeListID}'`)
      .then((routeListLegs) => {
        const providerQuery = routeListLegs.map( leg => `leg_id = '${leg.id}'`).join(' OR ')
        db_all(`SELECT * FROM provider WHERE ${providerQuery}`)
        .then((routeListProviders) => {
          const possiblePaths = findPaths(fromPlanet, toPlanet)
          let validRoutes = []
          possiblePaths.forEach( 
            path => 
            validRoutes = [...validRoutes, ...checkForValidRoutes(path, routeListLegs, routeListProviders)]
          )
          const processedRoutes =  processRoutesFromProviderIDSForDisplay(validRoutes, routeListLegs, routeListProviders)
          
          res.json({"message": "success", validUntil: routeList.validUntil, "data": processedRoutes })
        })
        .catch(err => res.status(400).json({"error": err}))
      })
      .catch(err => res.status(400).json({"error": err}))
    })
    .catch(err => res.status(400).json({"error":err}))
  }
})
app.get("/api/legs", (req, res) => {
  const sql = "SELECT * from leg"
  const params = []
  db_all("SELECT * FROM leg")
  .then((rows)=> {
    res.json({"message":"success", "data":rows})
  })
  .catch((err)=>res.status(400).json({"error":err.message}))
})
app.get("/api/provider", (req, res) => {
  const provider_ids = req.query.providerids

  const providerCondition = provider_ids.map(provider_id => `id = '${provider_id}'`).join(" OR ")
  db_all(`SELECT * FROM provider WHERE ${providerCondition}`)
  .then((providerRows)=> {
    const legCondition = providerRows.map(provider => `id = '${provider.leg_id}'`).join(" OR ")
    db_all(`SELECT * FROM leg WHERE ${legCondition}`)
    .then((legRows)=> {
      const data = provider_ids.map(provider_id => {
        const providerInfo = providerRows.find(provider => provider.id === provider_id)
        const legInfo = legRows.find(leg => leg.id === providerInfo.leg_id)
        return {
          from_planet: legInfo.from_planet,
          to_planet: legInfo.to_planet,
          price: providerInfo.price,
          flightStart: new Date(providerInfo.flight_start).toString(),
          flightEnd: new Date(providerInfo.flight_end).toString(),
          company: providerInfo.company
        }
      })
      res.json({"message": "success", data})
    })
    .catch((err) => res.status(400).json({"error": err}))
  })
  .catch((err) => res.status(400).json({"error": err}))
})
app.post("/api/reservation", (req, res) => {
  const firstName = req.body.firstName
  const lastName = req.body.lastName

  if(!firstName || !typeof firstName === 'string' || !firstName instanceof String || !lastName || !typeof lastName === 'string' || !lastName instanceof String) {
    res.status(400).json({"error": `${!firstName || !typeof firstName === 'string' || !firstName instanceof String ? 'firstName invalid' : ''} ${!lastName || !typeof lastName === 'string' || !lastName instanceof String ? 'lastName invalid' : ''}`})
  } else {
    db_all(`SELECT (leg_id) FROM provider WHERE id = '${req.body.reservedRoute.routeProviders[0]}'`)
    .then((leg_id_row) => {
      const leg_id = leg_id_row[0].leg_id
      db_all(`SELECT (routelist_id) FROM leg WHERE id = '${leg_id}'`)
      .then((routelist_id_row)=> {
        if (routelist_id_row.length === 0) res.status(400).json({"error": "No routes found"})
        else {
          db_all(`SELECT (valid_until) FROM routelist WHERE id = '${routelist_id_row[0].routelist_id}'`)
          .then((valid_until_row)=>{
            if (new Date(valid_until_row[0].valid_until).getTime() > Date.now()) {
              const reservation_id = uuidv4()
              const routelist_id = routelist_id_row[0].routelist_id
              const first_name = req.body.firstName
              const last_name = req.body.lastName
              const total_price = req.body.reservedRoute.totalPrice
              const total_travel_time = req.body.reservedRoute.totalTravelTime
              db_run(`INSERT INTO reservation(id, routelist_id, first_name, last_name, total_price, total_travel_time) VALUES (?, ?, ?, ?, ?, ?)`, [ reservation_id, routelist_id, first_name, last_name, total_price, total_travel_time])
              .then(() => {
                const providers = req.body.reservedRoute.routeProviders
                const providersTemplate = providers.map(()=> '(?, ?, ?, ?)').join(', ')
                const providerValues = providers.map((provider_id, idx) => [ uuidv4(), reservation_id, provider_id, idx]).flat()
                db_run(`INSERT INTO reservation_provider(id, reservation_id, provider_id, route_order) VALUES ${providersTemplate} `, providerValues)
                .then(() => {
                  res.json({message:"success"})
                })
                .catch((err)=>res.status(400).json({"error": err}))
              })
              .catch((err)=>res.status(400).json({"error": err}))
            } else {
              res.status(400).json({"error": "Expired routelist_id"})
            }
          })
          .catch((err)=>res.status(400).json({"error": err}))
        }
      })
      .catch((err)=>res.status(400).json({"error": err}))
    })
    .catch((err)=>res.status(400).json({"error": err}))
  }
})
app.get('/api/reservation/', (req,res)=>{
  const firstName = req.query.firstname
  const lastName = req.query.lastname

  if (!firstName || !lastName) {
    res.status(400).json({"error": `${!firstName ? "first name missing" : ""} ${!lastName ? "last name missing" : ""}`})
  } else {
    db_all(`SELECT * FROM reservation WHERE first_name = '${firstName}' AND last_name = '${lastName}'`)
    .then((reservationRows)=> {
      const reservation_ids_condition = reservationRows.map( reservation => `reservation_id = '${reservation.id}'`).join(' OR ')
      db_all(`SELECT * FROM reservation_provider WHERE ${reservation_ids_condition} ORDER BY route_order`)
      .then((reservation_provider_rows) => {
        const provider_condition = reservation_provider_rows.map( row => `id = '${row.provider_id}'`).join(' OR ')
        db_all(`SELECT * FROM provider WHERE ${provider_condition}`)
        .then((provider_rows) => {
          const legCondition = [...new Set(provider_rows.map((row)=>row.leg_id))].map(row=> `id = '${row}'`).join(' OR ')
          db_all(`SELECT * FROM leg WHERE ${legCondition}`)
          .then((leg_rows)=>{
            const data = reservationRows.map( reservation => {
              const providerIDS = reservation_provider_rows.filter(r_p=>r_p.reservation_id===reservation.id).map(provider=>provider.provider_id)
              const legs = providerIDS.map(provider_id=>leg_rows.find(leg=>leg.id === provider_rows.find(provider=>provider.id===provider_id).leg_id))
              const companies = providerIDS.map(providerID=>provider_rows.find(provider=>provider.id===providerID).company)
              return {
                firstName,
                lastName,
                path: [legs[0].from_planet, ...legs.map(leg => leg.to_planet)],
                totalPrice: reservation.total_price,
                totalTravelTime: reservation.total_travel_time,
                companies,
                providerIDS,
              }
            })
            res.json({"message":"success", data:data})
          })
          .catch(()=>res.status(400).json({"error":"Server error"}))
        })
        .catch(()=>res.status(400).json({"error":"Server error"}))
      })
      .catch(()=>res.status(400).json({"error":"Server error"}))
    })
    .catch(()=> res.status(400).json({"error":"Server error"}))
  }
})
app.use(function(req, res){
  res.status(404);
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});