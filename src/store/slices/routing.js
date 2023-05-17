import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    show: false,
    mode: "drive",
    waypoints: [0, 1].map(i => {
        return{
            address: "",
            suggestions: {
                show: false,
                selected: false,
            },
            point: {
                lat: null,
                lng: null,
            },
            final: {status: "empty", key: i},
        }
    }),
    userWaypoint : {status: "empty"},
    route: null,
    whereIsMouse: "map"
}

const routing = createSlice({
    name: "routing",
    initialState,
    reducers: {
        setShow: (state, action) => {
            state.show = action.payload;
        },
        setMode: (state, action) => {
            state.mode = action.payload;
        },
        setMouse: (state, action) => {
            state.whereIsMouse = action.payload;
        },
        resetWaypoints: (state) => {
            state.waypoints = [0, 1].map(i => {
                return{
                    address: "",
                    suggestions: {
                        show: false,
                        selected: false,
                    },
                    point: {
                        lat: null,
                        lng: null,
                        type: "point"
                    },
                    final: {status: "empty", key: i},
                }
            });
            state.route = null;
        },
        clearWaypoint: (state, action) => {
            state.waypoints[action.payload.index] = {
                address: "",
                suggestions: {
                    show: false,
                    selected: false,
                },
                point: {
                    lat: null,
                    lng: null,
                },
                final: {status: "empty", key: action.payload.index},
            };
            state.route = null;
        },
        setWaypointBySuggestion: (state, action) => {
            state.waypoints[action.payload.index] = {
                ...state.waypoints[action.payload.index], 
                ...action.payload.data
            };
        },
        setWaypointByPoint: (state, action) => {
            const index = action.payload.final.id === "userLocation" ? 0 : state.waypoints.findIndex(i => i.final.status === "empty")
            if(index === -1){
                return;
            }
            state.waypoints[index] = {...state.waypoints[index], ...action.payload};
        },
        setUserWaypoint: (state, action) => {
            state.userWaypoint = action.payload;
        },
        setUserAs1stWaypoint: (state) => {
            state.waypoints[0] = {
                address: state.userWaypoint.address,
                suggestions: {show: false, selected: true},
                point: state.userWaypoint.coords,
                final: {...state.userWaypoint, key: 0}
            }
        },
        setRoute: (state, action) => {
            state.route = action.payload;
        },
    }
})

export default routing.reducer;
export const { 
            setShow, 
            setMode,
            setMouse,
            resetWaypoints,
            clearWaypoint,
            setWaypointBySuggestion,
            setWaypointByPoint,
            setUserWaypoint,
            setUserAs1stWaypoint,
            setRoute
        } = routing.actions;