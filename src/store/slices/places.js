import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dist: {lat_min: 0, lat_max: 0, lon_min: 0, lon_max: 0},
    filter: {vis: "Hotels", orig: "other_hotels"},
    data: [],
}

const places = createSlice({
    name: 'places',
    initialState,
    reducers: {
        getDist: (state, action) => {
            state.dist = action.payload;
        },
        getFilter: (state, action) => {
            state.filter = action.payload;
        },
        getData: (state, action) => {
            state.data = action.payload;
        },
    }
});

export const { getDist, getFilter, getData } = places.actions;
export default places.reducer;