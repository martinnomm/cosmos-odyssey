import { createSlice } from "@reduxjs/toolkit";
export const routeListSlice = createSlice({
    name: 'routeList',
    initialState: {
        loading: true,
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
    }
})

export const { changeCurrentRoute, addRoute } = routeListSlice.actions

export default routeListSlice.reducer
