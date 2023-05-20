import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { getDist } from "../../store/slices/places";
export default function MapLocate(){
    const dispatch = useDispatch();
    const mapCenter = useSelector(state => state.mapInfo.center);
    const map = useMap();
    useEffect(() => {
        map.flyTo(mapCenter);
        (map.getBounds().getSouthWest().lng >= -90 && map.getBounds().getSouthWest().lng <= 90) && dispatch(getDist({lat_min: map.getBounds().getSouthWest().lat, lon_min: map.getBounds().getSouthWest().lng, lat_max: map.getBounds().getNorthEast().lat, lon_max: map.getBounds().getNorthEast().lng}));
    }, [mapCenter.lat, mapCenter.lng])
    return null;
};