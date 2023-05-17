import { useSelector } from "react-redux";
import style from "./RoutingContainer.module.css";
import WaypointOp from "./WaypointOp";
import Waypoint from "./Waypoint";
import React from "react";

export default React.memo(
    function RouteData(){
        const waypointsLength = useSelector(state => state.routing.waypoints.length);
        let waypoints = []
        for(let i = 0; i < waypointsLength; i++){
            waypoints.push(i);
        }
        return (
            <div>
                <div className={style["waypoints-container"]}>
                    {waypoints.map(i => <Waypoint key={i} index={i}/>)}
                </div>
                <WaypointOp />
            </div>
        )
    }
)