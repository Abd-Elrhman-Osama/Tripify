import { useDispatch, useSelector } from "react-redux";
import style from "./RoutingContainer.module.css";
import style2 from "../../utils/btn.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faRoute } from "@fortawesome/free-solid-svg-icons";
import { resetWaypoints, setShow } from "../../store/slices/routing";
import TravelMode from "./TravelMode";
import RouteDetails from "./RouteDetails";
import RouteDirections from "./RouteDirections";
import RouteData from "./RouteData";

export default function RoutingContainer(){
    const routingShow = useSelector(state => state.routing.show);
    const dispatch = useDispatch();
    
    const toggleRoutingContainer = (op) => {
        dispatch(setShow(!routingShow));
        op === "hide" && dispatch(resetWaypoints());
    }

    return <>
        <FontAwesomeIcon 
            icon={faRoute} 
            title="Routing" 
            className={style2.btn} 
            style={{transitionDuration: "1s", top: "10px", right: !routingShow ? "10px" : "-400px"}} 
            onClick={() => toggleRoutingContainer("show")} 
        />
        <div 
            className={style.routing} 
            style={{right: routingShow ? "10px" : "-400px"}}
        >
            <button onClick={() => toggleRoutingContainer("hide")}>
                <FontAwesomeIcon icon={faCircleXmark}/>
                <span className={style.overlay}></span>
            </button>
            <TravelMode />
            <RouteData />
            <RouteDetails />
            <RouteDirections />
        </div>
        
    </>
};