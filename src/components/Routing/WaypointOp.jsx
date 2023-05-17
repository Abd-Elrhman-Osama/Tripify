import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./RoutingContainer.module.css";
import { faLocation, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { setUserAs1stWaypoint } from "../../store/slices/routing";
import React from "react";
import { getMapCenter } from "../../store/slices/mapInfo";

export default React.memo(
    function WaypointOp(){
        const dispatch = useDispatch();
        const userLocation = useSelector(state => state.mapInfo.user);
        const route = useSelector(state => state.routing.route);
        const isUserLocationWaypoint = useSelector(state => 
            state.routing.waypoints.findIndex(i => i.final.status === "userLocation") !== -1
        );
        const isUserLocAllowed = useSelector(state => state.routing.userWaypoint.status);
    
        const userlocAsWaypointHandler = () => {
            if(!isUserLocationWaypoint && isUserLocAllowed !== "blocked"){
                dispatch(setUserAs1stWaypoint());
                dispatch(getMapCenter(userLocation))
            }
        }
    
        return (
            <div className={style["waypoint-op"]}>
                <button 
                    title={isUserLocationWaypoint || isUserLocAllowed !== "blocked" ? (isUserLocationWaypoint ? "Your location has already added as a 1st waypoint" : "Select Your Location as start point") : "User location access is denied"} 
                    onClick={userlocAsWaypointHandler} 
                    style={{cursor: isUserLocationWaypoint || isUserLocAllowed === "blocked" ? "not-allowed" : "pointer"}}
                >
                    <FontAwesomeIcon icon={faLocation} />
                    <span className={style.overlay}></span>
                </button>
                <button 
                    title="Find the route on the map"
                    onClick={() => route?.status === "ok" && dispatch(getMapCenter(route?.firstWaypoint))}
                    style={{cursor: route?.status !== "ok"  ? "not-allowed" : "pointer"}}
                >
                    <FontAwesomeIcon icon={faMapLocationDot} />
                    <span className={style.overlay}></span>
                </button>
            </div>
        )
    }
) 