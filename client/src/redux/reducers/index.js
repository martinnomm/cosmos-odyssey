// Export combined reducers

import providedRoutesReducer from './providedRoutes'
import originReducer from './origin'
import destinationReducer from './destination'
import selectedRouteReducer from './selectedRoute'
import { combineReducers } from '@reduxjs/toolkit'

export default combineReducers({ providedRoutes: providedRoutesReducer, origin: originReducer, destination: destinationReducer, selectedRoute: selectedRouteReducer})

// Export select commands for the reducers
 
const selectLoading = state => state.providedRoutes.loading
const selectOrigin = state => state.origin.origin
const selectDestination = state => state.destination.destination
const selectProvidedRoutes = state => state.providedRoutes.routes
const selectSelectedRoute = state => state.selectedRoute.routeInfo

export { selectLoading, selectOrigin, selectDestination, selectProvidedRoutes, selectSelectedRoute }