import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const reservationsSlice = createSlice({
    name: 'reservations',
    initialState: {
        loading: false,
        reservations: [],
    },
    reducers: {
        removeReservations: (state, action) => {
            state.reservations = []
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchReservations.pending, state => {state.loading = true})
        builder.addCase(fetchReservations.fulfilled, (state, action) => {
            state.loading = false
            state.reservations = action.payload.data
        })
        builder.addCase(fetchReservations.rejected, state => { state.loading = false})
    }
})

const fetchReservations = createAsyncThunk('reservations/fetchReservations', 
    async (payload) => fetch(`http://localhost:3001/api/reservation?firstname=${payload.firstName}&lastname=${payload.lastName}`).then(res => res.json())
)

export const { removeReservations } = reservationsSlice.actions
export { fetchReservations }
export default reservationsSlice.reducer
