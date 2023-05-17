import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import style from "./RoutingContainer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiamondTurnRight } from "@fortawesome/free-solid-svg-icons";

export default function RouteDirections(){
    const [content, setContent] = useState();
    const route = useSelector(state => state.routing.route);

    useEffect(() => {
        if(route?.status === "ok"){
            setContent(<div>{
                route.directions.steps.map((val, i) => 
                    <div key={i} className={style["route-direction"]}>
                        <FontAwesomeIcon icon={faDiamondTurnRight} style={{fontSize: "20px"}}/>
                        <p style={{fontWeight: "bold"}}>{val.instruction}</p>
                    </div>
                )
            }</div>)
        }else{
            setContent("");
        }
    }, [route])

    return <>
        {route?.status === "ok" && content}
    </>
};