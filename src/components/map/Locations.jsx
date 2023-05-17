import { Marker, Popup } from "react-leaflet";
import { useSelector } from "react-redux";

export default function Locations(){
    const places = useSelector(state => state.places.data);
    const finalWaypoints = useSelector(state => state.routing.waypoints.map(i => i.final));
    return <>
        {   finalWaypoints.every(val => val.status === "empty") ?
                places.map(i => 
                    <Marker key={i.id} position={[i.coords.lat, i.coords.lon]} riseOnHover={true} >
                        <Popup autoPan={false}>
                            {i?.name}
                        </Popup>
                    </Marker>
                )
                : finalWaypoints.filter(i => i.status === "ok" || i.status === "pending").map(i =>
                    <Marker key={i.key} position={[+i?.coords?.lat, +i?.coords?.lng]} riseOnHover={true}>
                        <Popup autoPan={false}>
                            {i.address}
                        </Popup>
                    </Marker>
                )
        }
    </>
};