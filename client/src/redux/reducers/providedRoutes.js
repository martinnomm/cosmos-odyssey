import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const providedRoutesSlice = createSlice({
    name: 'providedRoutes',
    initialState: {
        loading: false,
        routes: [],
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRoutes.pending, state => {state.loading = true})
        builder.addCase(fetchRoutes.fulfilled, (state, action) => {
            state.loading = false
            state.routes = action.payload.data
        })
        builder.addCase(fetchRoutes.rejected, state => { state.loading = false})
    }
})

const fetchRoutes = createAsyncThunk('providedRoutes/fetchRoutes', 
    async (payload) => fetch(`http://localhost:3001/api/provided-routes?fromplanet=${payload.origin}&toplanet=${payload.destination}`).then(res => res.json())
)
export { fetchRoutes }
export default providedRoutesSlice.reducer
