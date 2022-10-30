import { createSlice } from "@reduxjs/toolkit";
export const sortingSlice = createSlice({
    name: 'sorting',
    initialState: {
        sorting: '',
    },
    reducers: {
        changeSorting: (state, action) => {
            state.sorting = action.payload
        }
    }
})

export const { changeSorting } = sortingSlice.actions

export default sortingSlice.reducer
