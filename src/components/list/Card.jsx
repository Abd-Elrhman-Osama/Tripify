import { faBuildingColumns, faDollarSign, faGasPump, faHotel, faUtensils, faMugSaucer, faShop, faRoute } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { resetWaypoints, setShow, setUserAs1stWaypoint, setWaypointByPoint } from "../../store/slices/routing";

export default function HotelCard(props){
    const filter = useSelector(state => state.places.filter.vis);
    const finalWaypoint = useSelector(state => state.routing.waypoints[1].final.id);
    const isUserLocAllowed = useSelector(state => state.routing.userWaypoint.status);
    const dispatch = useDispatch();
    let icon = {"Hotels": faHotel, "Resorts": faHotel, "Banks": faBuildingColumns, "ATM": faDollarSign, "Restaurants": faUtensils, "Cafes": faMugSaucer, "Malls": faShop, "Fuel": faGasPump};

    const routingHandler = () => {
        if(finalWaypoint !== `place${props.id}` && isUserLocAllowed !== "blocked"){
            dispatch(setShow(true))
            dispatch(resetWaypoints())
            dispatch(setUserAs1stWaypoint());   
            dispatch(setWaypointByPoint({
                point: {lat: props.coords.lat, lng: props.coords.lon}, 
                final: {
                    key: 1,
                    id: `place${props.id}`,
                    status: "pending", 
                    coords: {lat: props.coords.lat, lng: props.coords.lon}, 
                    address: "Loading"
                }
            }));
        }
    }

    return <div className={props.style.card}>
        <FontAwesomeIcon icon={icon[filter]}/>
        <h4>{props.children}</h4>
        <button onClick={routingHandler} style={{cursor: isUserLocAllowed === "blocked" ? "not-allowed" : "pointer"}} title={isUserLocAllowed === "blocked" ? "User location access is denied" : "Routing from user location to this place"}>
            <FontAwesomeIcon icon={faRoute} />
        </button>
    </div>;
}