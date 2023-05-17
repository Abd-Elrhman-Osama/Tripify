import { useMapEvents } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { getDist } from "../../store/slices/places";
import { getMapCenter } from "../../store/slices/mapInfo";
import { setWaypointByPoint } from "../../store/slices/routing";

export default function UserInteraction(){
    const isRoutingVisible = useSelector(state => state.routing.show);
    const dispatch = useDispatch();
    const map = useMapEvents({
        moveend: () => {
            dispatch(getMapCenter({...map.getCenter()}));
            dispatch(getDist({lat_min: map.getBounds().getSouthWest().lat, lon_min: map.getBounds().getSouthWest().lng, lat_max: map.getBounds().getNorthEast().lat, lon_max: map.getBounds().getNorthEast().lng}));
        },
        click: (e) => {
            if(isRoutingVisible)
                dispatch(setWaypointByPoint({
                    point: {...e.latlng}, 
                    final: {
                        key: 2,
                        id: "point", 
                        status: "pending", 
                        coords: {...e.latlng}, 
                        address: "Loading"
                    }
                }));
        }
    })
    return null;
}