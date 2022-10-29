const express = require('express')
const cors = require("cors")
var db = require("./database.js")
const unirest = require("unirest")

const port = 3001;
const app = express();
app.use(cors())
 // TODO: All API should respond with validuntil if it's current
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
      // TODO: Add filter for companies here
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
      db.run("SELECT * FROM routelist ORDER BY valid_until", (rows, selectErr) => {
        if (selectErr) reject({valid: false, error: selectErr})
        if (rows && rows.length > 0 && new Date(rows[0]['valid_until']).getTime() > Date.now()) resolve({valid: true, id: rows[0].id, validUntil: rows[0]['valid_until']})
        unirest("GET", "https://cosmos-odyssey.azurewebsites.net/api/v1.0/TravelPrices")
        .then((response) => {
          const routeList = response.body

          // Insert all new data into db
          const legs = routeList.legs.map((leg) => [leg.id, routeList.id, leg.routeInfo.distance, leg.routeInfo.from.name, leg.routeInfo.to.name])
          const providers = routeList.legs.map((leg) => leg.providers.map((provider) => [provider.id, leg.id, provider.price, provider.flightStart, provider.flightEnd, provider.company.name])).flat()
          
          const legsPlaceholders = legs.map(() => "(?, ?, ?, ?, ?)").join(', ')
          const providersPlaceholders = providers.map(() => "(?, ?, ?, ?, ?, ?)").join(', ')
          db.run("SELECT * FROM routelist", (rows2, selectErr2)=> {
            if (selectErr2) reject({valid:false, error: selectErr2})
            else if (rows2 && rows2.some((row)=>row.id === routeList.id)) resolve({"message": "success", valid: true, id: routeList.id, validUntil: routeList.validUntil})
            else {
              db.run(`INSERT OR IGNORE INTO routelist(id, valid_until) VALUES (?, ?)`, [routeList.id, routeList.validUntil], function(err3) {
                if (err3) reject({valid: false, error3: err3, test})
                else {
                  db.run("SELECT * FROM leg", (rows4, err4)=> { 
                    if (err4) reject({valid: false, error: err4, test})
                    else if (rows4 && rows4.some((leg)=>legs.flat().some((legList)=>legList.id === leg.id))) resolve({"message": "success", valid: true, id: routeList.id, validUntil: routeList.validUntil})
                    else {
                      db.run(`INSERT OR IGNORE INTO leg(id, routelist_id, distance, from_planet, to_planet) VALUES ${legsPlaceholders}`, legs.flat(), function(err5) {
                        if (err5) reject({valid: false, error: err5, "test":"test"})
                        else {
                          db.run("SELECT * FROM leg", (rows6, err6)=> { 
                            if (err6) reject({valid: false, error: err6})
                            else if (rows6 && rows6.some((provider)=>providers.flat().some((providerList)=>providerList.id === provider.id))) resolve({"message": "success", valid: true, id: routeList.id, validUntil: routeList.validUntil})
                            else {
                              db.run(`INSERT OR IGNORE INTO provider(id, leg_id, price, flight_start, flight_end, company) VALUES ${providersPlaceholders}`, providers.flat(), function(err7) {
                                if (err7) reject({valid: false, error: err7})
                                else {
                                  // TODO: Check if there are 15 routes, remove if there are
                                  resolve({"message": "success", valid: true, id: routeList.id, validUntil: routeList.validUntil})
                                }
                              })
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
          
        })
        .catch((e) => {res.status(400).json({valid: false, error: e})})
      })
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
      path: [routeLegs[0].from_planet, ...routeLegs.map(leg => leg.to_planet)], // ,...route.routes.map( planetRoute => currentRouteList.legs.find(leg => leg.id === planetRoute.legID).routeInfo.to.name)],
      companies: routeProviders.map(provider => provider.company), // companies: route.routes.map( planetRoute =>  currentRouteList.legs.find(leg => leg.id === planetRoute.legID).providers.find( provider => provider.id === planetRoute.providerID).company.name),
      // totalTravelTime: 0, TODO: Calculate travel time
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
app.get("/api/routelist", async (req, res) => {
  isRoutelistValid()
  .then((routeList)=> {
    res.json({"message": "success", "data": routeList})
  })
  .catch(err => res.status(400).json({"error": err}))
})

app.get("/api/provided-routes/", (req, res) => {
  const fromPlanet = req.query.fromplanet.length > 1 ? `${req.query.fromplanet.charAt(0).toUpperCase()}${req.query.fromplanet.slice(1)}` : req.query.fromplanet
  const toPlanet = req.query.toplanet.length > 1 ? `${req.query.toplanet.charAt(0).toUpperCase()}${req.query.toplanet.slice(1)}` : req.query.toplanet

  const planetNames = [ "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune" ]
  if (!fromPlanet && !toPlanet) res.status(400).json({"error": `Missing query fromPlanet and toPlanet`})
  else if (!fromPlanet) res.status(400).json({"error": `Missing query fromPlanet`})
  else if (!toPlanet) res.status(400).json({"error": `Missing query toPlanet`})
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
          
          res.json({"message": "success", "data": processedRoutes })
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
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json({
        "message":"success",
        "data":rows
    })
  })
})
app.get("/api/providers", (req, res) => {
  const sql = "SELECT * from provider"
  const params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json({
        "message":"success",
        "data":rows
    })
  })
})


app.use(function(req, res){
  res.status(404);
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});