import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import reducers from './reducers'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'cosmos-persist-key',
    blacklist: ['origin', 'destination', 'loading'],
    storage
}

const reducer = persistReducer( persistConfig, reducers)
const store = configureStore({ reducer, devTools: true, middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, }),})
const persistor = persistStore(store)

export default store
export { persistor }
