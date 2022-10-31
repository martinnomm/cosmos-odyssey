import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const providedRoutesSlice = createSlice({
    name: 'providedRoutes',
    initialState: {
        loading: false,
        routes: [],
        validUntil: 0,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRoutes.pending, state => {state.loading = true})
        builder.addCase(fetchRoutes.fulfilled, (state, action) => {
            state.loading = false
            state.routes = action.payload.data
            state.validUntil = action.payload.validUntil
        })
        builder.addCase(fetchRoutes.rejected, state => { 
            state.loading = false
            state.routes = []
        })
    }
})

const fetchRoutes = createAsyncThunk('providedRoutes/fetchRoutes', 
    async (payload) => payload?.origin && payload.destination ? 
        fetch(`http://localhost:3001/api/provided-routes?fromplanet=${payload.origin}&toplanet=${payload.destination}`).then(res => res.json()) : 
        fetch(`http://localhost:3001/api/provided-routes`).then(res => res.json())
)
export { fetchRoutes }
export default providedRoutesSlice.reducer
