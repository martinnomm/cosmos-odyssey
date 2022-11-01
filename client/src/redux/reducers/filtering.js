import { createSlice } from "@reduxjs/toolkit";
/**
 * Filtering array to filter out companies from route query
 */
export const filteringSlice = createSlice({
    name: 'filtering',
    initialState: {
        filtering: [],
    },
    reducers: {
        changeFiltering: (state, action) => {
            state.filtering = action.payload
        }
    }
})

export const { changeFiltering } = filteringSlice.actions

export default filteringSlice.reducer
