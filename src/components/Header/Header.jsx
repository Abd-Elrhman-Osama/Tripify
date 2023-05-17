import { useEffect, useState } from 'react';
import style from './Header.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Distenation from './Distenation';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { getFilter } from '../../store/slices/places';
import { getMapCenter } from '../../store/slices/mapInfo';
import CountryCode from './CountryCode';
import Filter from './Filter';
import coordsByPlaceName from '../../api/search/coordsByPlaceName';

export default function header() {
    const dispatch = useDispatch()
    const categories = [
        {Name: "Hotels", Code: "other_hotels"},
        {Name: "Resorts", Code: "resorts"},
        {Name: "Banks", Code: "bank"},
        {Name: "ATM", Code: "atm"},
        {Name: "Restaurants", Code: "restaurants"},
        {Name: "Cafes", Code: "cafes"},
        {Name: "Malls", Code: "malls"},
        {Name: "Fuel", Code: "fuel"}
    ]
    const [search, setSearch] = useState({
        dist: {show: true, data: '', coords: {lat: null, lng: null}, nearby: {show: false, feed: null}, geocode: false, coordsFromNearby: false},
        countryCode: {show: false, data: {vis: "", orig: ""}, menu: {show: false, feed: null, search: {results: [], word: ""}}},
        filter: {show: false, data: {vis: categories[0].Name, orig: categories[0].Code}, menu: {show: false, feed: categories}},
    })
    const [apiKeyIndex, setKeyIndex] = useState(0)
    
    const {isFetching, data, refetch} = useQuery({
        queryKey: ["place coordinates", search.dist.data, search.countryCode.data.orig, apiKeyIndex],
        queryFn: () => coordsByPlaceName(search.dist.data, search.countryCode.data.orig, import.meta.env[`VITE_REACT_RAPID_API_KEY_${apiKeyIndex}`]),
        enabled: false,
        select: data => {
            if(data.error || data.message){
                return "error";
            }else if(data.status === "OK"){
                return {lat: data.lat, lng: data.lon};
            }else if(data.status === "NOT_FOUND"){
                return false;
            }
            return false;
        }
    })

    useEffect(() => {
        if(!isFetching && data === "error"){
            setKeyIndex(prevState => (prevState + 1) % 5);
        }else if(!isFetching && data){
            dispatch(getMapCenter(data));
            dispatch(getFilter(search.filter.data));
            setSearch(prevState => {
                return {
                    ...prevState, 
                    dist: {...prevState.dist, coords: data}
                };
            })
        }
    }, [isFetching, data])

    useEffect(() => {
        if(apiKeyIndex){
            refetch();
        }
    }, [apiKeyIndex])

    const iconHandler = (e) => {
            const id = e.currentTarget.id;
            setSearch(prevState => {
                let newState = {};
                for(const prop in prevState){
                    newState[prop] = {...prevState[prop], show: prop === id};
                    id !== "dist" && prop === "dist" ? newState.dist = {...newState.dist, nearby: {show: false, feed: null}, geocode: false} : null;
                    id !== "countryCode" && prop === "countryCode" ? newState.countryCode.menu = {...newState.countryCode.menu, show: false, search: {results: [], word: ""}} : null;
                    id !== "filter" && prop === "filter" ? newState.filter.menu = {...newState.filter.menu, show: false} : null;
                }
                return newState;
            })
    }
    const submitHandler = e => {
        e.preventDefault();
        setSearch(prevState => {return{
            dist: {...prevState.dist, show: true, geocode: false},
            countryCode: {...prevState.countryCode, show: false, menu: {...prevState.countryCode.menu, show: false, search: {results: [], word: ""}}},
            filter: {...prevState.filter, show: false, menu: {...prevState.filter.menu, show: false}},
        }})
        if(search.dist.coordsFromNearby){
            dispatch(getMapCenter(search.dist.coords))
        }
        else if(search.dist.data && !search.dist.coordsFromNearby){
            refetch();
        }else if(!search.dist.data && !search.dist.nearby.show){
            e.target.firstElementChild.lastElementChild.style.border="2.5px dashed #dd2c00";
            e.target.firstElementChild.lastElementChild.focus();
        }
    }

    return (
        <header>
            
            <div className={style.container}>
                <div className={style.title}>Tripify</div>
                <form onSubmit={submitHandler} autoComplete='off'>
                    <Distenation search={search} setSearch={setSearch} style={style} iconHandler={iconHandler}/>
                    <CountryCode search={search} setSearch={setSearch} style={style} iconHandler={iconHandler}/>
                    <Filter search={search} setSearch={setSearch} style={style} iconHandler={iconHandler} />
                    <button type="submit"> <FontAwesomeIcon icon={faMagnifyingGlass} /> </button>
                </form>
            </div>
        </header>
    )
}