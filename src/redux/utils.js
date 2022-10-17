import testingData from "../assets/travels.json"

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

function checkForValidRoutes(path, routeList) {
    const cleanedRoutes = []
    const foundRoutes = recursiveValidRoutes(path, routeList)
    recursiveCleanRouteArray(foundRoutes, cleanedRoutes)
    return cleanedRoutes
}

function recursiveValidRoutes(pathRef, routeList, currentPlanetIDX = 0, currentRoutes = [], previousFlightEnd = 0) { // TODO: Change previousFlightEnd to Date now
    // If arrived on planet, got a valid route
    if (currentPlanetIDX === pathRef.length-1) return { routes:currentRoutes }

    // Check for valid routes out of current planet
    const from = pathRef[currentPlanetIDX]
    const to = pathRef[currentPlanetIDX+1]
    const leg = routeList.legs.find( leg => leg.routeInfo.from.name === from && leg.routeInfo.to.name === to)
    const nextRoutes = []
    for (let i = 0; i < leg.providers.length; i++) {
        // TODO: Add filter for companies here
        const provider = leg.providers[i]
        const flightStart = new Date(provider.flightStart).getTime()
        if (previousFlightEnd > flightStart) continue
        nextRoutes.push({legID: leg.id, providerID: provider.id, flightEnd: new Date(provider.flightEnd).getTime()})
    }
    const foundRoutes = nextRoutes.map( route => recursiveValidRoutes(pathRef, routeList, currentPlanetIDX+1, [...currentRoutes, {legID: route.legID, providerID: route.providerID}], route.flightEnd))
    return foundRoutes
} 

function recursiveCleanRouteArray(currentNode, cleanedRoutes) {
    if (Array.isArray(currentNode)) {
        currentNode.forEach( node => recursiveCleanRouteArray(node, cleanedRoutes))
    } else {
        cleanedRoutes.push(currentNode)
    }
}
/**
 * Checks if input date-time is less than current date-time
 */
const isDateValid = (validUntil) => {
    return validUntil && new Date(validUntil).getTime() < Date.now()
} 

// TODO: Create API Call for actual resource
const fetchNewRouteList = () => {
    return new Promise((resolve) => {
        resolve(testingData);
    })
}
export { findPaths, isDateValid, fetchNewRouteList, checkForValidRoutes }





// function recursivePathFinding(origin, currentPath) {
//     let target = currentPath[currentPath.length - 1]
//     if (origin === target) return currentPath
//     let potentials = routes.filter( route => route[1] === target && !currentPath.includes(route[0]))
//     let sources = []
//     potentials.forEach(potential => sources.push(potential[0]))
//     if (sources.length === 0) return []
//     if (sources.length === 1) return recursivePathFinding(origin, [...currentPath, sources[0]])
//     let paths = []
//     sources.forEach( source => paths.push(recursivePathFinding(origin, [...currentPath, source])))
//     paths = paths.filter( path => path.length > 0)
//     return findShortest(paths)
// }

// const findShortest = (arr = []) => {
//     const res = arr.reduce((acc, val, ind) => {
//        if (!ind || val.length < acc[0].length) {
//           return [val];
//        };
//        if (val.length === acc[0].length) {
//           acc.push(val);
//        };
//        return acc;
//     }, []);
//     return res;
// };