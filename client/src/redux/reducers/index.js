import routeListReducer from './routeList'
import originReducer from './origin'
import destinationReducer from './destination'
import { combineReducers, createSelector } from '@reduxjs/toolkit'
import { findPaths, checkForValidRoutes } from '../utils'

export default combineReducers({ routeList: routeListReducer, origin: originReducer, destination: destinationReducer })


const selectCurrentRouteID = state => state.routeList.currentRouteID
const selectLoading = state => state.routeList.loading
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
        const currentRouteList = routeList.find(route=> route.id === currentRouteID)
        let validRoutes = []
        possiblePaths.forEach( 
            path => 
            validRoutes = [...validRoutes, ...checkForValidRoutes(path, currentRouteList)]
        )
        
        return validRoutes.map( route => {
            const startingLeg = currentRouteList.legs.find(leg => leg.id === route.routes[0].legID)
            const endingLeg = route.routes.length === 1 ? startingLeg : currentRouteList.legs.find(leg => leg.id === route.routes[route.routes.length-1].legID)
            let totalPrice = 0
            route.routes.forEach( planetRoute => totalPrice += currentRouteList.legs.find( leg => leg.id === planetRoute.legID).providers.find( provider => provider.id === planetRoute.providerID).price)
            return {
                routeStart: startingLeg.flightStart,
                routeEnd: endingLeg.flightEnd,
                path: [startingLeg.routeInfo.from.name, ...route.routes.map( planetRoute => currentRouteList.legs.find(leg => leg.id === planetRoute.legID).routeInfo.to.name)],
                companies: route.routes.map( planetRoute =>  currentRouteList.legs.find(leg => leg.id === planetRoute.legID).providers.find( provider => provider.id === planetRoute.providerID).company.name),
                totalTravelTime: 0,
                totalPrice,
                totalDistance: 0,
            }
        })
    }
)

const selectValidUntil = createSelector(
    selectCurrentRouteID,
    selectRouteList,
    (currentRouteID, routeList) => {
        if (!currentRouteID) return false
        const route = routeList.find(route=> route.id === currentRouteID)
        if (!route) return false
        return route.validUntil
    }
)
export { selectValidUntil, selectRoutes, selectOrigin, selectDestination, selectLoading }