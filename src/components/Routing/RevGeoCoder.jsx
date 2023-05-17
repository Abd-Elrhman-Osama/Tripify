import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import reverseGeocoding from "../../api/routing/reverseGeocoding";
import React, { useEffect } from "react";
import { setUserWaypoint, setWaypointBySuggestion } from "../../store/slices/routing";

export default React.memo(
    function RevGeoCoder(props){
        const routing = useSelector(state => {
            return{
                show: state.routing.show,
                pos: state.routing.waypoints.findIndex(i => i.final.status === "empty"),
                point: state.routing.waypoints[props.index].point,
                id: state.routing.waypoints[props.index].final.id,
            }
        });
        const dispatch = useDispatch();
    
        const {isFetching, data, refetch} = useQuery({
            queryKey: ["reverse geocoding", routing.point?.lat, routing.point?.lng],
            queryFn: () => reverseGeocoding(routing.point),
            enabled: false,
            select: data => {
                return {
                    key: props.index,
                    id: routing.id.startsWith("place") || routing.id.startsWith("userLocation") ? routing.id : "point", 
                    status: "ok",
                    address: data.Result.Address, 
                    coords: {lat: +data.Query.lat, lng: +data.Query.lon}, 
                    country: data.AdminAreas[0]
                }
            }
        })
    
        useEffect(() => {
            if (routing.point.lat && routing.point.lng) {
                refetch()
            }
        }, [routing.point?.lat, routing.point?.lng])

        useEffect(() => {
            if(!isFetching && data){
                routing.id === "userLocation" ?
                dispatch(setUserWaypoint({...data, status: "userLocation"}))
                : dispatch(setWaypointBySuggestion({
                    data: {
                        address: data.address,
                        suggestions: {show: false, selected: true},
                        final: data,
                    },
                    index: props.index,
                }))
            }
        }, [isFetching, data])
    
        return null;
    }
) 