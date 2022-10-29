import { createSlice } from "@reduxjs/toolkit";
export const showLoaderOverlaySlice = createSlice({
    name: 'showLoaderOverlay',
    initialState: {
        showLoaderOverlay: false,
    },
    reducers: {
        showLoader: (state, action) => {
            state.showLoaderOverlay = true
        },
        hideLoader: (state, action) => {
            state.showLoaderOverlay = false
        },
    }
})

export const { showLoader, hideLoader } = showLoaderOverlaySlice.actions

export default showLoaderOverlaySlice.reducer
