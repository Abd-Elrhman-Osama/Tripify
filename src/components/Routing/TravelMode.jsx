import { faBicycle, faCar, faTruck, faWalking } from "@fortawesome/free-solid-svg-icons";
import style from "./RoutingContainer.module.css";
import React from "react";
import { setMode } from "../../store/slices/routing";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default React.memo(
    function TravelMode() {
        const routingMode = useSelector(state => state.routing.mode);
        const dispatch = useDispatch();
        const modes = [
            {name: "drive", icon: faCar}, 
            {name: "truck", icon: faTruck}, 
            {name: "bicycle", icon: faBicycle}, 
            {name: "walk", icon: faWalking}
        ];
    
        return (
            <div className={style["travel-mode"]}>
                {modes.map(val => 
                    <button 
                        key={val.name} 
                        title={val.name} 
                        style={{backgroundColor: routingMode === val.name ? "#777" : null}}
                        onClick={e => dispatch(setMode(e.currentTarget.title))}
                    >
                        <FontAwesomeIcon icon={val.icon} />
                        <span className={style.overlay}></span>
                    </button>
                )}
            </div>
        )
    }
)