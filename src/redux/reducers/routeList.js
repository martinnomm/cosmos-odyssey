import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchNewRouteList } from "../utils";

export const routeListSlice = createSlice({
    name: 'routeList',
    initialState: {
        loading: false,
        routeList: [],
        currentRouteID: '',
    },
    reducers: {
        addRoute: (state, action) => {
            state.routeList = [action.payload]
            state.currentRouteID = action.payload.id
        },
        changeCurrentRoute: (state, action) => {
            state.currentRouteID = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRoutes.pending, state => {state.loading = true})
        builder.addCase(fetchRoutes.fulfilled, (state, action) => {
            console.log(action.payload)
            state.loading = false
            state.currentRouteID = action.payload.id
            state.routeList.push(action.payload)
            // if (state.routeList.length > 15) { // TODO: Remove reservations if no state found
            //     state.routeList.slice(
            //         state.routeList.findIndex(
            //             route => route.id === state.routeList.reduce((prev, curr) => new Date(prev.validUntil).getTime() < new Date(curr.validUntil).getTime() ? prev : curr)).id
            //     ,1)
            // }
        })
        builder.addCase(fetchRoutes.rejected, (state, action) => { state.loading = false})
    }
})

// const fetchRoutes = createAsyncThunk('routeList/fetchRoutes', 
//     async () => {
//         const response = await fetch("https://cosmos-odyssey.azurewebsites.net/api/v1.0/TravelPrices", {"mode": "no-cors"})
//         console.log(response)
//         return response
// })
const fetchRoutes = createAsyncThunk('routeList/fetchRoutes', 
    async () => {
        const response = await fetchNewRouteList()
        return response
})
export const { changeCurrentRoute, addRoute } = routeListSlice.actions
export { fetchRoutes }
export default routeListSlice.reducer
