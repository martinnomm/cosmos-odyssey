import { createSlice } from "@reduxjs/toolkit";
/**
 * Saves destination for picking routes to buy ticket
 */
export const destinationSlice = createSlice({
    name: 'destination',
    initialState: {
        destination: '',
    },
    reducers: {
        changeDestination: (state, action) => {
            state.destination = action.payload
        }
    }
})

export const { changeDestination } = destinationSlice.actions

export default destinationSlice.reducer
