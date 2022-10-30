// Export combined reducers

import providedRoutes from './providedRoutes'
import origin from './origin'
import destination from './destination'
import selectedRoute from './selectedRoute'
import showLoaderOverlay from './showLoaderOverlay'
import reservations from './reservations'
import sorting from './sorting'
import filtering from './filtering'
import { combineReducers } from '@reduxjs/toolkit'

export default combineReducers({ providedRoutes, origin, destination, selectedRoute, showLoaderOverlay, reservations, sorting, filtering})

// Export select commands for the reducers
 
const selectRoutesLoading = state => state.providedRoutes.loading
const selectValidUntil = state => state.providedRoutes.validUntil
const selectProvidedRoutes = state => state.providedRoutes.routes

const selectReservationsLoading = state => state.reservations.loading
const selectReservations = state => state.reservations.reservations

const selectOrigin = state => state.origin.origin
const selectDestination = state => state.destination.destination
const selectSorting = state => state.sorting.sorting
const selectFiltering = state => state.filtering.filtering

const selectSelectedRoute = state => state.selectedRoute.routeInfo
const selectSelectedRouteProviders = state => state.selectedRoute.providers
const selectSelectedRouteLoading = state => state.selectedRoute.loading

const selectShowLoaderOverlay = state => state.providedRoutes.loading || state.reservations.loading || state.showLoaderOverlay.showLoaderOverlay || state.selectedRoute.loading

export { selectRoutesLoading, selectValidUntil, selectOrigin, selectDestination, selectProvidedRoutes, selectSelectedRoute, selectShowLoaderOverlay, selectReservationsLoading, selectReservations, selectSorting, selectFiltering, selectSelectedRouteProviders, selectSelectedRouteLoading }