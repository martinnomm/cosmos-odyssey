import { createSlice } from "@reduxjs/toolkit";
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
