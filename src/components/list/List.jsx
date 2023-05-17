import ScrollBtn from '../../utils/ScrollBtn';
import style from './List.module.css';
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import placesListByBBox from "../../api/places/placesListByBBox";
import { useEffect, useState } from "react";
import Card from './Card';
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getData } from '../../store/slices/places';

export default function List() {
    const [apiKeyIndex, setKeyIndex] = useState(0);
    const dispatch = useDispatch();

    const [content, setContent] = useState({
        view: <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}><span className={style.loader}></span></div>, 
        page: {min: 0, max: 0, current: 1}
    });

    const placesInfo = useSelector(state => {return {dist: state.places.dist, filter: state.places.filter}});

    const apiParams = {
        lon_max: placesInfo.dist.lon_max,
        lat_min: placesInfo.dist.lat_min,
        lon_min: placesInfo.dist.lon_min,
        lat_max: placesInfo.dist.lat_max,
        format: "json",
        kinds: placesInfo.filter.orig
    }

    const { isLoading, data } = useQuery({
        queryKey: ['get places by center coords', placesInfo.dist.lat_min, placesInfo.dist.lat_max, placesInfo.dist.lon_min, placesInfo.dist.lon_max, placesInfo.filter.orig, apiKeyIndex],
        queryFn: () => placesListByBBox(apiParams, import.meta.env[`VITE_REACT_RAPID_API_KEY_${apiKeyIndex}`]),
        select: data => {
            if(data.error || data.message){
                return data;
            }else{
                let neededData = {};
                const filteredData = data.filter(sthg => sthg.name !== "").map(sthg => {return {id: sthg.xid, name: sthg.name, coords: sthg.point} }).sort((a, b) => a.dist - b.dist);
                for(let i = 1; i <= Math.ceil(filteredData.length / 25); i++){
                    neededData[i] = filteredData.filter((_, index) => index < i * 25 && index >= (i-1) * 25);
                }
                return neededData;
            }
        }
    });

    useEffect(() => {
        if(isLoading){

            setContent({
                view: <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}><span className={style.loader}></span></div>,
                page: {min: 0, max: 0, current: 1}
            })

        }else if(data.error || data.message){
            
            setKeyIndex(prevState => (prevState + 1) % 5);

        }else if(Object.keys(data).length){
            dispatch(getData(data[1]));
            setContent({
                view: data[1].map(i => <Card key={i.id} id={i.id} style={style} coords={i.coords}>{i.name}</Card>),
                page: {min: 1, max: Object.keys(data).length, current: 1}
            })

        }else{
            
            dispatch(getData([]));
            setContent({
                view: <h4>Unfortunately, There isn't any nearby {placesInfo.filter.vis} in this location. Try to search another location or drag the map.</h4>,
                page: {min: 0, max: 0, current: 1}
            })

        }
    }, [isLoading, data])

    const paginateHandler = e => {
        if(e.target.id === "prev" && content.page.current > content.page.min || e.target.id === "next" && content.page.current < content.page.max){
            dispatch(getData(data[e.target.id === "prev" ? content.page.current - 1 : content.page.current + 1]));
            setContent(prevState => { return{
                view: data[e.target.id === "prev" ? prevState.page.current - 1 : prevState.page.current + 1].map(i => <Card key={i.id} id={i.id} style={style} coords={i.coords}>{i.name}</Card>),
                page: {...prevState.page, current: e.target.id === "prev" ? prevState.page.current - 1 : prevState.page.current + 1}
            }})
        }
    }

    return (
        <div className={style.list}>
            <div className={style.container}>
                {content.view}
            </div>
            {content.page.max !== 0 && <div className={style.paginate}>
                <button
                    onClick={paginateHandler}
                    style={content.page.current === 1 ? {cursor: "not-allowed", color: "#777"} : null}
                >
                    <div className={style.overlay} id="prev"></div>
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <input type="text" readOnly value={content.page.current}/>
                <button
                    onClick={paginateHandler}
                    style={content.page.current === content.page.max ? {cursor: "not-allowed", color: "#777"} : null}
                >
                    <div className={style.overlay} id="next"></div>
                    <FontAwesomeIcon icon={faAngleRight} />
                </button>
            </div>}
            <ScrollBtn direction='up'/>
        </div>
    )
}

