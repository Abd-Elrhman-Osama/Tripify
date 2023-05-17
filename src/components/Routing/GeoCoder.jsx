import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import geocoding from "../../api/routing/geocoding";
import style from "./RoutingContainer.module.css";
import { getMapCenter } from "../../store/slices/mapInfo";
import { setWaypointBySuggestion } from "../../store/slices/routing";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default React.memo(
    function GeoCoder(props){
        const [content, setContent] = useState()
        const [apiKeyIndex, setKeyIndex] = useState(0)
        const dispatch = useDispatch();
        const suggestions = useSelector(state => {
            return{
                isOpened: state.routing.waypoints[props.index].suggestions?.show,
                isSelected: state.routing.waypoints[props.index].suggestions?.selected,
                query: state.routing.waypoints[props.index]?.address,
            }
        });
    
        const suggestionHandler = (waypoint) => {
            dispatch(setWaypointBySuggestion({
                data: {
                    address: waypoint.address,
                    suggestions: {show: false, selected: true},
                    final: {...waypoint, key: props.index},
                },
                index: props.index,
            }));
            dispatch(getMapCenter(waypoint.coords));
        }
    
        const {isLoading, isFetching, data, refetch} = useQuery({
            queryKey: ["geocoding", suggestions.query, apiKeyIndex],
            queryFn: () => geocoding(suggestions.query, import.meta.env[`VITE_REACT_GEOKEO_GEOCODING_ROUTING_API_KEY_${apiKeyIndex}`]),
            enabled: false,
            select: data => {
                if(data.status === "ok"){
                    return data.results.map(val => {
                        return {
                            id: "point", 
                            status: "ok", 
                            address: val.formatted_address, 
                            coords: val.geometry.location, 
                            country: val.address_components.country
                        }
                    })
                }else if(data.status === "ZERO_RESULTS"){
                    return [];
                }else{
                    return {error: "ACCESS_DENIED"};
                }
            }
        })
    
        useEffect(() => {
            if(!suggestions.isSelected) refetch();
        }, [suggestions.query, suggestions.isSelected, apiKeyIndex])
    
        useEffect(() => {
            if(isLoading){
                setContent(
                    <div className={style.suggestions}>
                        <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <span className={style.loader}></span>
                        </div>
                    </div>
                )
            }else if(!isFetching && data?.error){
                setKeyIndex(prevState => (prevState + 1) % 5);
            }else if(!isFetching && data){
                setContent(
                    <div className={style.suggestions}> 
                        {
                            data.length ? 
                                data.map((val, i) => 
                                    <div key={i} onClick={() => suggestionHandler(val)}>
                                        <FontAwesomeIcon icon={faLocationDot} style={{color: "red", fontSize: "19px"}}/>
                                        <h4>{val.address}</h4>
                                    </div>)
                                : <div><h4>Not Found</h4></div>
                        }
                    </div>
                )
            }
        }, [isLoading, isFetching, data])
    
        return <>
            {suggestions.isOpened ? content : null}
        </>
    }
) 