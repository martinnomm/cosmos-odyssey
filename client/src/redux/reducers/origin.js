import { createSlice } from "@reduxjs/toolkit";
/**
 * Saves origin for picking routes to buy ticket
 */
export const originSlice = createSlice({
    name: 'origin',
    initialState: {
        origin: '',
    },
    reducers: {
        changeOrigin: (state, action) => {
            state.origin = action.payload
        }
    }
})

export const { changeOrigin } = originSlice.actions

export default originSlice.reducer
