const express = require('express')
const bodyParser = require("body-parser");
const cors = require("cors")
var db = require("./database.js")
const unirest = require("unirest")
const { v4: uuidv4 } = require('uuid')
const port = 3001;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  credentials: true,
}))

/**
 * Checks if routelist time is valid
 * If routelist is dated, loads new routelist from API
 * If there are over 15 routelists, removes the oldest ones to limit it to 15
 * Database removes reservations and information related to the removed routelist
 * @return Promise with return value with routelist id and validuntil
 */
function isRoutelistValid() {
  return new Promise( async function(resolve, reject) {
    try {
      const routelist_rows = await db_all("SELECT * FROM routelist ORDER BY valid_until")
      if (routelist_rows && routelist_rows.length > 0 && new Date(routelist_rows[0]['valid_until']).getTime() > Date.now()) {
        resolve({valid: true, id: routelist_rows[0].id, validUntil: routelist_rows[0]['valid_until']})
        return 
      }

      const response = await unirest("GET", "https://cosmos-odyssey.azurewebsites.net/api/v1.0/TravelPrices")
      const routeList = response.body
  
      // Insert all new data into db
      const legs = routeList.legs.map((leg) => [leg.id, routeList.id, leg.routeInfo.distance, leg.routeInfo.from.name, leg.routeInfo.to.name])
      const providers = routeList.legs.map((leg) => leg.providers.map((provider) => [provider.id, leg.id, provider.price, provider.flightStart, provider.flightEnd, provider.company.name])).flat()
      
      const legsPlaceholders = legs.map(() => "(?, ?, ?, ?, ?)").join(', ')
      const providersPlaceholders = providers.map(() => "(?, ?, ?, ?, ?, ?)").join(', ')
      const baseRouteListRows = await db_all("SELECT id FROM routelist")
      if (baseRouteListRows && baseRouteListRows.some((row)=>row.id === routeList.id)) 
        resolve({"message": "success", valid: true, id: routeList.id, validUntil: routeList.validUntil})
      
      await db_run("INSERT OR IGNORE INTO routelist(id, valid_until) VALUES (?, ?)", [routeList.id, routeList.validUntil])
      const legRows = await db_all("SELECT id FROM leg")
      if (legRows && legRows.some((leg)=>legs.flat().some((legList)=>legList.id === leg.id))) 
        resolve({"message": "success", valid: true, id: routeList.id, validUntil: routeList.validUntil})
      
      await db_run(`INSERT OR IGNORE INTO leg(id, routelist_id, distance, from_planet, to_planet) VALUES ${legsPlaceholders}`, legs.flat())
      const providerRows = await db_all(("SELECT id FROM provider"))
      if (providerRows && providerRows.some((provider)=>providers.flat().some((providerList)=>providerList.id === provider.id))) 
        resolve({"message": "success", valid: true, id: routeList.id, validUntil: routeList.validUntil})
      
      await db_run(`INSERT OR IGNORE INTO provider(id, leg_id, price, flight_start, flight_end, company) VALUES ${providersPlaceholders}`, providers.flat())
      
      const finalRouteListCheckRows = await db_all("SELECT id FROM routelist ORDER BY valid_until DESC")
      if(finalRouteListCheckRows?.length > 15) {
        const IDStoDelete = finalRouteListCheckRows.filter((row,idx)=>idx>=15).map(row=>`id = '${row.id}'`).join(' OR ')
        await db_run(`DELETE FROM routelist WHERE ${IDStoDelete}`)
      }
      resolve({"message": "success", valid: true, id: routeList.id, validUntil: new Date(routeList.validUntil).getTime()})
    } catch(e) {
      reject({valid:false, error: e})
    }
  })
}

/**
 * Returns all routelists for debugging purposes
 */
app.get("/api/routelist", async (req, res) => {
  try {
    const routelist_rows = await db_all("SELECT * FROM routelist")
    res.json({"message": "success", data: routelist_rows})
  } catch (e) {
    res.status(400).json({"error": e?.message})
  }
})

/**
 * Returns all legs for debugging purposes
 */
app.get("/api/legs", async (req, res) => {
  try {
    const leg_rows = await db_all("SELECT * FROM leg")
    res.json({"message":"success", data:leg_rows})
  } catch (e) {
    res.status(400).json({"error":e?.message})
  }
})

/**
 * @param {string} fromPlanet query param, origin planet
 * @param {string} toPlanet query param, destination planet
 * @return {Promise} Returns promise that resolves with all routes for display that are of current routelist and from origin to destination planet
 */
app.get("/api/provided-routes/", async (req, res) => {
  
  const fromPlanet = req?.query?.fromplanet?.length > 1 ? `${req?.query?.fromplanet?.charAt(0)?.toUpperCase()}${req?.query?.fromplanet?.slice(1)}` : req?.query?.fromplanet
  const toPlanet = req?.query?.toplanet?.length > 1 ? `${req?.query?.toplanet?.charAt(0)?.toUpperCase()}${req?.query?.toplanet?.slice(1)}` : req?.query?.toplanet
  
  const planetNames = [ "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune" ]
  if (!fromPlanet || !toPlanet) {
    try {
      const routeList = await isRoutelistValid()
      res.json({"message": `Missing query fromPlanet and toPlanet, updated routelists`, validUntil: routeList.validUntil, data:[]})
    } catch(e) {
      res.status(400).json({"error": e?.message})
    }
    return 
  }

  if (!planetNames.includes(fromPlanet) || !planetNames.includes(toPlanet)) {
    res.status(400).json({"error": "query must be planet names, got " +fromPlanet + " & " + toPlanet})
    return
  }
  if (fromPlanet.toLowerCase() === toPlanet.toLowerCase()) {
    res.status(400).json({"error": "planet names must be different"})
    return
  }
  
  try {
    const routeList = await isRoutelistValid()
    const routeListID = routeList.id
    const legs_rows = await db_all(`SELECT * FROM leg WHERE routelist_id = '${routeListID}'`)

    const providerQuery = legs_rows.map( leg => `leg_id = '${leg.id}'`).join(' OR ')
    const provider_rows = await db_all(`SELECT * FROM provider WHERE ${providerQuery}`)

    const possiblePaths = findPaths(fromPlanet, toPlanet)
    let validRoutes = []
    possiblePaths.forEach( 
      path => 
      validRoutes = [...validRoutes, ...checkForValidRoutes(path, legs_rows, provider_rows)]
    )

    const processedRoutes =  processRoutesFromProviderIDSForDisplay(validRoutes, legs_rows, provider_rows)
    res.json({"message": "success", validUntil: routeList.validUntil, data: processedRoutes })
  } catch(e) {
    res.status(400).json({"error": e?.message})
  }
})

/**
 * Return route providers information for display with the route 
 */
app.get("/api/provider", async (req, res) => {
  const provider_ids = req.query.providerids
  if (!provider_ids) {
    res.status(400).json({"error": "No provider_ids provided"})
    return
  } 
  try {
    const providerCondition = provider_ids.map(provider_id => `id = '${provider_id}'`).join(" OR ")
    const providerRows = await db_all(`SELECT id, leg_id, price, flight_start, flight_end, company FROM provider WHERE ${providerCondition}`)
    
    const legCondition = providerRows.map(provider => `id = '${provider.leg_id}'`).join(" OR ")
    const legRows = await db_all(`SELECT id, from_planet, to_planet FROM leg WHERE ${legCondition}`)
  
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
  } catch (e) {
    res.status(400).json({"error": e?.message})
  }
})

/**
 * Takes in first and last name and array of route providers to make a reservation
 */
app.post("/api/reservation", async (req, res) => {
  const firstName = req.body.firstName
  const lastName = req.body.lastName

  if(!firstName || !typeof firstName === 'string' || !firstName instanceof String || !lastName || !typeof lastName === 'string' || !lastName instanceof String) {
    res.status(400).json({"error": `${!firstName || !typeof firstName === 'string' || !firstName instanceof String ? 'firstName invalid' : ''} ${!lastName || !typeof lastName === 'string' || !lastName instanceof String ? 'lastName invalid' : ''}`})
    return
  }
  if( !req?.body?.reservedRoute?.routeProviders || req?.body?.reservedRoute?.routeProviders?.length <= 0 ) {
    res.status(400).json({"error": "Body invalid"})
  }
  try {
    const leg_id_row = await db_all(`SELECT leg_id FROM provider WHERE id = '${req.body.reservedRoute.routeProviders[0]}'`)
    if (leg_id_row.length === 0) {
      res.status(400).json({"error": "Server error"})
      return
    }
    const leg_id = leg_id_row[0].leg_id
    const routelist_id_row = await db_all(`SELECT routelist_id FROM leg WHERE id = '${leg_id}'`)
    if (routelist_id_row.length === 0) {
      res.status(400).json({"error": "No routes found"})
      return
    }
    const valid_until_row = await db_all(`SELECT valid_until FROM routelist WHERE id = '${routelist_id_row[0].routelist_id}'`)
    if (new Date(valid_until_row[0].valid_until).getTime() <= Date.now()) {
      res.status(400).json({"error": "Route is outdated"})
      return
    }

    const reservation_id = uuidv4()
    const routelist_id = routelist_id_row[0].routelist_id
    const first_name = req.body.firstName
    const last_name = req.body.lastName
    const total_price = req.body.reservedRoute.totalPrice
    const total_travel_time = req.body.reservedRoute.totalTravelTime
    await db_run(`INSERT INTO reservation(id, routelist_id, first_name, last_name, total_price, total_travel_time) VALUES (?, ?, ?, ?, ?, ?)`, [ reservation_id, routelist_id, first_name, last_name, total_price, total_travel_time])
    
    const providers = req.body.reservedRoute.routeProviders
    const providersTemplate = providers.map(()=> '(?, ?, ?, ?)').join(', ')
    const providerValues = providers.map((provider_id, idx) => [ uuidv4(), reservation_id, provider_id, idx]).flat()
    await db_run(`INSERT INTO reservation_provider(id, reservation_id, provider_id, route_order) VALUES ${providersTemplate} `, providerValues)
    
    res.json({message:"success"})
  } catch (e) {
    res.status(400).json({"error": e?.message})
  }
})

/**
 * Takes first and last name and returns all related reservations
 */
app.get('/api/reservation/', async (req,res)=>{
  const firstName = req.query.firstname
  const lastName = req.query.lastname

  if (!firstName || !lastName) {
    res.status(400).json({"error": `${!firstName ? "first name missing" : ""} ${!lastName ? "last name missing" : ""}`})
    return
  }
  try {
    const reservationRows = await db_all(`SELECT id, total_price, total_travel_time FROM reservation WHERE first_name = '${firstName}' AND last_name = '${lastName}'`)
    if (reservationRows.length === 0) {
      res.json({"message": "success", data: []})
      return 
    }

    const reservation_ids_condition = reservationRows.map( reservation => `reservation_id = '${reservation.id}'`).join(' OR ')
    const reservation_provider_rows = await db_all(`SELECT provider_id, reservation_id FROM reservation_provider WHERE ${reservation_ids_condition} ORDER BY route_order`)

    const provider_condition = reservation_provider_rows.map( row => `id = '${row.provider_id}'`).join(' OR ')
    const provider_rows = await db_all(`SELECT id, leg_id, company FROM provider WHERE ${provider_condition}`)

    const legCondition = [...new Set(provider_rows.map((row)=>row.leg_id))].map(row=> `id = '${row}'`).join(' OR ')
    const leg_rows = await db_all(`SELECT id, from_planet, to_planet FROM leg WHERE ${legCondition}`)

    const data = reservationRows.map( reservation => {
      const providerIDS = reservation_provider_rows.filter(reservationProvider=>reservationProvider.reservation_id===reservation.id).map(provider=>provider.provider_id)
      const legs = providerIDS.map(provider_id=>leg_rows.find(leg=>leg.id === provider_rows.find(provider=>provider.id===provider_id).leg_id))
      const companies = providerIDS.map(providerID=>provider_rows.find(provider=>provider.id===providerID).company)
      return {
        id: reservation.id,
        firstName,
        lastName,
        path: [legs[0].from_planet, ...legs.map(leg => leg.to_planet)],
        totalPrice: reservation.total_price,
        totalTravelTime: reservation.total_travel_time,
        companies,
        providerIDS,
      }
    })
    res.json({"message":"success", data})
  } catch (e) {
    res.status(400).json({"error": e})
  }
})

app.use(function(req, res){
  res.status(404);
});
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});





// Utility functions ------------------------------------------------
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

/**
 * 
 * @param {string} origin planet 
 * @param {string} destination planet
 * @returns Array of paths from origin planet to destination planet
 */
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
/** 
 * Helper function for finding paths
 */
function checkForValidRoutes(path, legs, providers) {
  const cleanedRoutes = []
  const foundRoutes = recursiveValidRoutes(path, legs, providers)
  recursiveCleanRouteArray(foundRoutes, cleanedRoutes)
  return cleanedRoutes
}
/** 
 * Helper function for finding paths
 */
function recursiveCleanRouteArray(currentNode, cleanedRoutes) {
  if (Array.isArray(currentNode)) {
      currentNode.forEach( node => recursiveCleanRouteArray(node, cleanedRoutes))
  } else {
      cleanedRoutes.push(currentNode)
  }
}
/** 
 * Helper function for finding paths
 */
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
  return foundRoutes
} 

/**
 * 
 * @param {Array} validRoutes Planet routes that get from origin planet to destination planet
 * @param {Array} allLegs Legs that are related to the current routelist and flights between the planets
 * @param {Array} allProviders Providers that are related to the current legs
 * @returns 
 */
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