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
    let pathsNext = []
    let target = ''
    let sources = []
    while (!paths.every( path => path[path.length-1] === origin )) {
        pathsNext = []
        paths.forEach( path => {
            if (path[path.length-1] === origin) {
                pathsNext.push(path)
            } else {

                target = path[path.length-1]
                sources = routes.filter( route => route[1] === target).map( route => route[0])
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

function checkForValidRoutes(path ) {
    
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