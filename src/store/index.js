import { configureStore } from "@reduxjs/toolkit";
import mapInfoReducer from "./slices/mapInfo";
import placesReducer from "./slices/places";
import routingReducer from "./slices/routing"

const store = configureStore({
    reducer: {
        mapInfo: mapInfoReducer,
        places: placesReducer,
        routing: routingReducer,
    },
})

export default store;