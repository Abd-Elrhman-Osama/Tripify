import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import style from '../../utils/btn.module.css';
import { getMap } from "../../store/slices/mapInfo";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faLocationCrosshairs} from "@fortawesome/free-solid-svg-icons"; 
import { useEffect, useState } from "react";
import { setUserWaypoint, setWaypointByPoint } from "../../store/slices/routing";

export default function UserLocate(){
    const [isUserLocAllowed, setUserLocAllowance] = useState();
    const userLocation = useSelector(state => state.mapInfo.user)
    const dispatch = useDispatch();
    const map = useMap();
    useMapEvents({
        locationfound: (loc) => {
            dispatch(setWaypointByPoint({point: {...loc.latlng}, final: {key: 0, status: "empty", id: "userLocation"}}))
            dispatch(getMap({...loc.latlng}));
            map.flyTo([loc.latlng.lat, loc.latlng.lng]);
            setUserLocAllowance(true);
        },
        locationerror: () => {
            dispatch(setUserWaypoint({status: "blocked"}));
            setUserLocAllowance(false);
        }
    })

    useEffect(() => {
        map.locate();
    }, [])
    
    return <>
        <FontAwesomeIcon icon={faLocationCrosshairs} className={style.btn} onClick={() => map.locate()} style={{left: "10px", cursor: isUserLocAllowed ? "pointer" : "not-allowed", bottom: window.innerWidth < 700 ? "20px" : "10px"}} title={isUserLocAllowed ? "Your current location" : "User location access is denied"}/>
        {
            userLocation.lat &&
            <Marker position={[userLocation.lat, userLocation.lng]} riseOnHover={true}>
                <Popup>
                    <h3>You're Here.</h3>
                </Popup>
            </Marker>
        }
    </>
}