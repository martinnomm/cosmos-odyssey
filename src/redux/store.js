import { configureStore, combineReducers } from '@reduxjs/toolkit'
import originReducer from './origin'
import destinationReducer from './destination'

export default configureStore({
    reducer: combineReducers({originReducer,destinationReducer}),
    devTools: true,
})