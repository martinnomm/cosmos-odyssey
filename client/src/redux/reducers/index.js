import providedRoutesReducer from './providedRoutes'
import originReducer from './origin'
import destinationReducer from './destination'
import { combineReducers } from '@reduxjs/toolkit'

export default combineReducers({ providedRoutes: providedRoutesReducer, origin: originReducer, destination: destinationReducer })

const selectLoading = state => state.providedRoutes.loading
const selectOrigin = state => state.origin.origin
const selectDestination = state => state.destination.destination
const selectProvidedRoutes = state => state.providedRoutes.routes

export { selectOrigin, selectDestination, selectLoading, selectProvidedRoutes }