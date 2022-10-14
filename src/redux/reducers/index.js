import routeListReducer from './routeList'
import originReducer from './origin'
import destinationReducer from './destination'
import { combineReducers, createSelector } from '@reduxjs/toolkit'
import { findPaths, checkForValidRoutes } from '../utils'

export default combineReducers({ routeList: routeListReducer, origin: originReducer, destination: destinationReducer })


const selectCurrentRouteID = state => state.routeList.currentRouteID
const selectOrigin = state => state.origin.origin
const selectDestination = state => state.destination.destination
const selectRouteList = state => state.routeList.routeList

const selectRoutes = createSelector(
    selectCurrentRouteID,
    selectOrigin,
    selectDestination,
    selectRouteList,
    (currentRouteID, origin, destination, routeList) => {
        if (origin === '' || destination === '') return []
        // Check if route still valid in timer
        const possiblePaths = findPaths(origin, destination)
        
        let validRoutes = []

        possiblePaths.forEach( path => validRoutes.push(checkForValidRoutes(path, routeList.find(route=> route.id=== currentRouteID))))
        return validRoutes
    }
)
export { selectRoutes, selectOrigin, selectDestination }