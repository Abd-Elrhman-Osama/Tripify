import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./RoutingContainer.module.css";
import { faLocationDot, faX } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { clearWaypoint, setWaypointBySuggestion } from "../../store/slices/routing";
import GeoCoder from "./GeoCoder";
import RevGeoCoder from "./RevGeoCoder";
import React from "react";

export default React.memo(
    function Waypoint(props){
        const dispatch = useDispatch();
        const waypoint = useSelector(state => {
            return {
                cnt: state.routing.waypoints.length,
                initialAddress: state.routing.waypoints[props.index].address,
            }
        })
    
        const fillWaypointHandler = event => {
            const query = event.currentTarget.value;
            dispatch(setWaypointBySuggestion({
                data: {
                    address: query,
                    suggestions: {show: query ? true : false, selected: false},
                    final: {status: "empty", key: props.index},
                    point: {lat: null, lng: null},
                },
                index: props.index,
            }))
        }
    
        return (
            <div>
    
                {(props.index + 1) === waypoint.cnt ? 
                    <FontAwesomeIcon icon={faLocationDot} style={{color: "red", fontSize: "19px"}}/> 
                    : <span className={style["waypoint-icon"]}></span>
                }
    
                <span className={style["waypoint-field"]}>
                    <input 
                        type="text"
                        value={waypoint.initialAddress}
                        autoComplete="off" 
                        placeholder="Enter address here, or click on the map"
                        onChange={fillWaypointHandler}
                    />
                    <button id="clear" onClick={() => dispatch(clearWaypoint({index: props.index}))}>
                        <FontAwesomeIcon icon={faX} />
                        <span className={style.overlay}></span>
                    </button>
    
                    <GeoCoder index={props.index}/>
                    <RevGeoCoder index={props.index} />
                    
                </span>
            </div>
        )
    }
) 