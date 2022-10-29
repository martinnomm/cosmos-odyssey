// Export combined reducers

import providedRoutes from './providedRoutes'
import origin from './origin'
import destination from './destination'
import selectedRoute from './selectedRoute'
import showLoaderOverlay from './showLoaderOverlay'
import reservations from './reservations'
import { combineReducers } from '@reduxjs/toolkit'

export default combineReducers({ providedRoutes, origin, destination, selectedRoute, showLoaderOverlay, reservations})

// Export select commands for the reducers
 
const selectRoutesLoading = state => state.providedRoutes.loading
const selectReservationsLoading = state => state.reservations.loading
const selectOrigin = state => state.origin.origin
const selectDestination = state => state.destination.destination
const selectProvidedRoutes = state => state.providedRoutes.routes
const selectReservations = state => state.reservations.reservations
const selectSelectedRoute = state => state.selectedRoute.routeInfo
const selectShowLoaderOverlay = state => state.providedRoutes.loading || state.reservations.loading || state.showLoaderOverlay.showLoaderOverlay

export { selectRoutesLoading, selectOrigin, selectDestination, selectProvidedRoutes, selectSelectedRoute, selectShowLoaderOverlay, selectReservationsLoading, selectReservations }