import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/**
 * Saves Currently selected route from the route ticket buy page to display on sidebar
 */
export const selectedRouteSlice = createSlice({
    name: 'selectedRoute',
    initialState: {
        loading: false,
        routeInfo: null,
        providers: null,
    },
    reducers: {
        changeSelectedRoute: (state, action) => {
            state.routeInfo = action.payload
        },
        removeSelectedRoute: (state) => {
            state.routeInfo = null
        },
        changeSelectedRouteProviders: (state, action) => {
            state.providers = action.payload
        },
        removeSelectedRouteProviders: (state) => {
            state.providers = null
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchSelectedRouteProviders.pending, state => {state.loading = true})
        builder.addCase(fetchSelectedRouteProviders.fulfilled, (state, action) => {
            state.loading = false
            state.providers = action.payload.data
        })
        builder.addCase(fetchSelectedRouteProviders.rejected, state => { 
            state.loading = false
            state.providers = null
        })
    }
})



const fetchSelectedRouteProviders = createAsyncThunk('selectedRoute/fetchSelectedRouteProviders', 
    async (payload) => fetch(`http://localhost:3001/api/provider?${payload.map(providerID=>`providerids[]=${providerID}`, {mode:'cors'}).join('&')}`).then(res => res.json())
)


export const { changeSelectedRoute, removeSelectedRoute, changeSelectedRouteProviders, removeSelectedRouteProviders } = selectedRouteSlice.actions
export { fetchSelectedRouteProviders }
export default selectedRouteSlice.reducer
