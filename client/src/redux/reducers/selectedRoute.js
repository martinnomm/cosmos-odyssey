import { createSlice } from "@reduxjs/toolkit";

export const selectedRouteSlice = createSlice({
    name: 'selectedRoute',
    initialState: {
        routeInfo: null,
    },
    reducers: {
        changeSelectedRoute: (state, action) => {
            state.routeInfo = action.payload
        },
        removeSelectedRoute: (state, action) => {
            state.routeInfo = null
        }
    },
})


export const { changeSelectedRoute, removeSelectedRoute } = selectedRouteSlice.actions
export default selectedRouteSlice.reducer
