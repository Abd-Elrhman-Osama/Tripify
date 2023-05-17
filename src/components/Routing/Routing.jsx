import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux"
import routing from "../../api/routing/routing";
import { useEffect, useState } from "react";
import { setRoute } from "../../store/slices/routing";

export default function Routing(){
    const [apikeyIndex, setKeyIndex] = useState(0);
    const dispatch = useDispatch();
    const nav = useSelector(state => state.routing.navigation)
    const route = useSelector(state => {
        return {
            mode: state.routing.mode,
            finalWaypoints: state.routing.waypoints.map(i => i.final).filter(i => i.status === "ok" || i.status === "userLocation")
        }
    })

    const {isLoading, isFetching, data, refetch} = useQuery({
        queryKey: [
            "routing",
            route.finalWaypoints[0]?.coords.lat,
            route.finalWaypoints[0]?.coords.lng,
            route.finalWaypoints[1]?.coords.lat,
            route.finalWaypoints[1]?.coords.lng,
            route.mode,
            apikeyIndex
        ],
        queryFn: () => routing(route.finalWaypoints[0]?.coords, route.finalWaypoints[1]?.coords, route.mode, apikeyIndex),
        enabled: false,
        select: data => {
            if(!data.error){
                const neededData = {
                    status: "ok",
                    firstWaypoint: {
                        lat: data.properties.waypoints[0].lat, 
                        lng: data.properties.waypoints[0].lon
                    },
                    details: {
                        mode: data.features[0].properties.mode,
                        distance: formatDistance(data.features[0].properties.distance),
                        time: formatTime(data.features[0].properties.time),
                    },
                    directions: {
                        coords: data.features[0].geometry.coordinates[0].map(i => {
                            return{
                                lat: i[1],
                                lng: i[0]
                            }
                        }),
                        steps: data.features[0].properties.legs[0].steps.map(i => {
                            return{
                                ...i,
                                distance: formatDistance(i.distance),
                                time: formatTime(i.time),
                                instruction: i.instruction.text
                            }
                        })
                    }
                }
                return neededData;
            }
            return data;
        }
    })

    useEffect(() => {
        if(route.finalWaypoints.length === 2){
            const isSameCountry = route.finalWaypoints[0].country.length > route.finalWaypoints[1].country.length ?
                route.finalWaypoints[0].country.toLowerCase().startsWith(route.finalWaypoints[1].country.toLowerCase()) || route.finalWaypoints[0].country.toLowerCase().endsWith(route.finalWaypoints[1].country.toLowerCase())
                : route.finalWaypoints[1].country.toLowerCase().startsWith(route.finalWaypoints[0].country.toLowerCase()) || route.finalWaypoints[1].country.toLowerCase().endsWith(route.finalWaypoints[0].country.toLowerCase())
            if(isSameCountry){
                refetch()
            }else{
                dispatch(setRoute({
                    status: "error", 
                    msg: "Both the starting and ending point are in two different countries, so we're sorry we can't provide a good route.",
                }));
            }
        }
    }, [
        route.finalWaypoints[0]?.coords.lat,
        route.finalWaypoints[0]?.coords.lng,
        route.finalWaypoints[1]?.coords.lat,
        route.finalWaypoints[1]?.coords.lng,
        route.mode,
        apikeyIndex,
    ])

    useEffect(() => {
        if(isFetching && isLoading && !nav){
            dispatch(setRoute({status: "pending"}));
        }else if(data?.error){
            setKeyIndex(prevState => (prevState + 1) % 5)
        }else if(!isFetching && data){
            dispatch(setRoute(data));
        }
    }, [isFetching, isLoading, data, nav])

    return null
};


function formatTime(t) {
    const time = Number(t);
    const h = Math.floor(time / 3600);
    const m = Math.floor(time % 3600 / 60);
    const s = Math.floor(time % 3600 % 60);

    const hDisplay = h > 0 ? `${h}h ` : "";
    const mDisplay = m > 0 ? `${m}min ` : "";
    const sDisplay = s > 0 ? `${s}sec` : "";
    return hDisplay + mDisplay + sDisplay; 
}

function formatDistance(d) {
    const distance = Number(d);
    const km = Math.floor(distance / 1000);
    const m = distance % 1000;

    const kmDisplay = km > 0 ? `${km}KM `: "";
    const mDisplay = m > 0 ? `${m}m`: "";

    return kmDisplay + mDisplay; 
}