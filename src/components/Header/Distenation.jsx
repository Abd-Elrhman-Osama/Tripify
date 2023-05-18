import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingColumns, faDollarSign, faGasPump, faHotel, faUtensils, faMugSaucer, faShop, faCircleXmark, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import citiesNearLocation from '../../api/search/citiesNearLocation';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { getMapCenter } from '../../store/slices/mapInfo';
import { getFilter } from '../../store/slices/places';
import geocoding from "../../api/routing/geocoding";

export default function Distenation(props){
    const dispatch = useDispatch();
    const userLocation = useSelector(state => state.mapInfo.user);
    const filter = useSelector(state => state.places.filter.vis);
    const [content, setContent] = useState()
    const [nearbyApiKeyIndex, setNearbyKeyIndex] = useState(0)
    const [geoApiKeyIndex, setGeoKeyIndex] = useState(0)
    let icon = {"Hotels": faHotel, "Resorts": faHotel, "Banks": faBuildingColumns, "ATM": faDollarSign, "Restaurants": faUtensils, "Cafes": faMugSaucer, "Malls": faShop, "Fuel": faGasPump};

    const {isFetching: isNearbyFetching, data: nearbyCities, refetch: nearbyRefetch } = useQuery({
        queryKey: ["Nearby Cities", userLocation.lat, userLocation.lng, nearbyApiKeyIndex],
        queryFn: () => citiesNearLocation(userLocation.lat, userLocation.lng, import.meta.env[`VITE_REACT_RAPID_API_KEY_${nearbyApiKeyIndex}`]),
        enabled: false,
        select: data => {
            if(data.message || data.error){
                return "error";
            }else{
                return data.data.map(city => {return {id: city.id, name: city.name, country: city.country, distance: `${city.distance} KM`, lat: city.latitude, lng: city.longitude}})
            }
        }
    })

    useEffect(() => {
        if(!isNearbyFetching && nearbyCities === "error"){
            setNearbyKeyIndex(prevState => (prevState + 1) % 5)
        }else if(!isNearbyFetching && nearbyCities){
            props.setSearch(prevState => {
                return {
                    ...prevState,
                    dist: {...prevState.dist, nearby: {show: true, feed: nearbyCities}, geocode: false, coordsFromNearby: false},
                }
            });
        }
    }, [isNearbyFetching, nearbyCities])

    useEffect(() => {
        if(nearbyApiKeyIndex){
            nearbyRefetch();
        }
    }, [nearbyApiKeyIndex])

    const {isLoading: isGeoCodingLoading, isFetching: isGeoCodingFetching, data: geocode, refetch: geocodingRefetch} = useQuery({
        queryKey: ["geocoding", props.search.dist.data, geoApiKeyIndex],
        queryFn: () => geocoding(props.search.dist.data, import.meta.env[`VITE_REACT_GEOKEO_GEOCODING_HEADER_API_KEY_${geoApiKeyIndex}`]),
        enabled: false,
        select: data => {
            if(data.status === "ok"){
                return data.results.map((val, i) => {
                    return {
                        id: i,
                        status: "ok", 
                        name: val.formatted_address, 
                        lat: val.geometry.location.lat, 
                        lng: val.geometry.location.lng, 
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
        if(props.search.dist.data && !props.search.dist.coordsFromNearby){
            geocodingRefetch();
        }
    }, [props.search.dist.data, props.search.dist.coordsFromNearby, geoApiKeyIndex])

    useEffect(() => {
        if(isGeoCodingLoading){
            setContent(
                <div className={props.style.suggestions}>
                    <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <span className={props.style.loader}></span>
                    </div>
                </div>
            )
        }else if(!isGeoCodingFetching && geocode?.error){
            setGeoKeyIndex(prevState => (prevState + 1) % 5);
        }else if(!isGeoCodingFetching && geocode){
            setContent(
                <div className={props.style.suggestions}> 
                    {
                        geocode.length ? 
                            geocode.map((val) => 
                                <div key={val.id} onClick={() => suggestionHandler(val)}>
                                    <FontAwesomeIcon icon={faLocationDot} />
                                    <p style={{fontSize: "16px", fontWeight: "bold"}}>{val.name}</p>
                                </div>)
                            : <div><p style={{fontSize: "16px", fontWeight: "bold"}}>Not Found</p></div>
                    }
                </div>
            )
        }
    }, [isGeoCodingLoading, isGeoCodingFetching, geocode])
    

    const suggestionHandler = useCallback((city) => {
        const distCoords = {lat: city.lat, lng: city.lng};
        dispatch(getMapCenter(distCoords));
        dispatch(getFilter(props.search.filter.data));
        props.setSearch(prevState => {
            return {
                ...prevState,
                dist: {show: true, data: city.name, coords: distCoords, nearby: {...prevState.dist.nearby, show: false}, geocode: false, coordsFromNearby: true}
            }
        })
    }, [props.search.filter.data.vis, props.search.filter.data.orig])

    const removeSuggestionsList = () => {
        props.setSearch(prevState => {
            return {
                ...prevState,
                dist: {...prevState.dist, nearby: {...prevState.dist.nearby, show: false}}
            }
        })
    }

    return  <div 
                id="dist" 
                className={props.search.dist.show? props.style.stretch : null} 
                onClick={props.search.dist.show? null : props.iconHandler}
            >

                <FontAwesomeIcon icon={icon[filter]}/>
                <input 
                    type="search"
                    placeholder="Where are you going?"
                    className={props.search.dist.show? null : props.style.hide} 
                    value={props.search.dist.data} 
                    onBlur={e => e.target.style.border="initial"}
                    onChange={e => {
                        e.target.style.border="initial";
                        !e.target.value && userLocation.lat ? nearbyRefetch() : null;
                        props.setSearch(prevState => {
                            return {...prevState, dist: {...prevState.dist, data: e.target.value, nearby: {...prevState.dist.nearby, show: userLocation.lat && Boolean(!e.target.value)}, geocode: Boolean(e.target.value), coordsFromNearby: false}}
                        })
                    }}
                    onFocus={e => !e.target.value && userLocation.lat ? nearbyRefetch() : 
                        props.setSearch(prevState => {
                            return {
                                ...prevState,
                                dist: {...prevState.dist, nearby: {...props.search.dist.nearby, show: false}, geocode: true, coordsFromNearby: false},
                            }
                        })
                    }
                />

                {
                    props.search.dist.nearby.show &&
                        <div className={props.style.suggestions}>
                            <button onClick={removeSuggestionsList}>
                                <FontAwesomeIcon icon={faCircleXmark}/>
                                <span className={props.style.overlay}></span>
                            </button>
                            <p>Popular Nearby Cities from your location</p>
                            {
                                props.search.dist.nearby.feed?.map(city => 
                                    <div key={city.id} onClick={() => suggestionHandler(city)}>
                                        <FontAwesomeIcon icon={faLocationDot} />
                                        <div>
                                            <p>{city.name}{city.distance ? ` is ${city.distance} away.` : null}</p>
                                            <p>{city.country}</p>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                }

                {
                    (props.search.dist.data && props.search.dist.geocode && !props.search.dist.coordsFromNearby) && content
                }
            </div>
}
