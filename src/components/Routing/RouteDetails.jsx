import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import style from "./RoutingContainer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBicycle, faCar, faTruck, faWalking } from "@fortawesome/free-solid-svg-icons";
import Routing from "./Routing";

export default function RouteDetails(){
    const [content, setContent] = useState();
    const route = useSelector(state => state.routing.route);
    const modes = {
        "drive": faCar,
        "truck": faTruck,
        "bicycle": faBicycle,
        "walk": faWalking
    }

    useEffect(() => {
        if(route?.status === "pending"){
            setContent(
                <div style={{marginTop: "25px", display: "flex", justifyContent: "center"}}>
                    <span className={style.loader}></span>
                </div>
            )
        }else if(route?.status === "ok"){
            setContent(
                <div className={style["route-details"]}>
                    <FontAwesomeIcon icon={modes[route.details.mode]} style={{fontSize: "min(30px, 12vw)", color: "#444"}}/>
                    <div>
                        <div>
                            <span>Distance: </span>
                            <span>{route.details.distance}</span>
                        </div>
                        <div>
                            <span>time: </span>
                            <span>{route.details.time}</span>
                        </div>
                    </div>
                </div>
            )
        }else if(route?.status === "error"){
            setContent(
                <h3 style={{marginTop: "25px"}}>{route.msg}</h3>
            )
        }
    }, [route])

    return <>
        <Routing />
        {route && content}
    </>
};