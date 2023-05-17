import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown, faAngleUp, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useDispatch } from "react-redux"
import { getFilter } from "../store/slices/places";

export default function SelectMenu(props){
    const dispatch = useDispatch();
    const menuVisibility = (vis) => {
        props.setSearch(prevState => {
            return {
                ...prevState, 
                [props.id]: {
                    ...prevState[props.id], 
                    menu: {...prevState[props.id].menu, show: vis}
                }
            }
        })
    }

    const menuItemClickHandler = countryORCategory => {
        props.id === "filter" && dispatch(getFilter({vis: countryORCategory.Name, orig: countryORCategory.Code}));
        props.setSearch(prevState => {
            return {
                ...prevState,
                [props.id]: {
                    ...prevState[props.id], 
                    data: {vis: countryORCategory.Name, orig: countryORCategory.Code}, 
                    menu: {...prevState[props.id].menu, show: false}
                }
            }
        })
    }

    return  <div 
                id={props.id}
                className={props.state.show? props.style.stretch : null} 
                onClick={props.state.show ? 
                    !props.state.menu.show ? 
                        () => menuVisibility(true) : null
                    : props.iconHandler
                }
            >

                <FontAwesomeIcon icon={props.icon}/>
                <input 
                    type="text" 
                    placeholder={props.id === "countryCode" ? "Select the country" : null} 
                    value={props.state.data.vis} 
                    readOnly 
                    className={!props.state.show? props.style.hide : null}
                />
                
                {props.id === "countryCode" && 
                    <button
                        style={{display: props.state.show && props.state.data.vis ?  null : "none", backgroundColor: "transparent", border: "none", fontSize: "24px", cursor: "pointer"}}
                        onClick={e => {
                            e.preventDefault();
                            props.setSearch(prevState => {
                                return {
                                    ...prevState,
                                    countryCode: {...prevState.countryCode, data: {vis: "", orig: ""}}
                                }
                            })
                    }}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                }
                
                <FontAwesomeIcon 
                    icon={faAngleDown} 
                    style={{display: props.state.show && !props.state.menu.show ?  null : "none"}}
                />

                <FontAwesomeIcon 
                    icon={faAngleUp} 
                    style={{display: props.state.menu.show? null : "none"}}
                    onClick={props.state.show && props.state.menu.show ? 
                                () => menuVisibility(false) 
                                : null
                            }
                />
                
                <div className={props.state.menu.show? props.style.menu : props.style.hide}>
                    {props.id === "countryCode" && 
                        <input 
                            type="text" 
                            placeholder="Find Country"
                            autoComplete="off"
                            value={props.state.menu.search.word}
                            onChange={e => {
                                let searchedResults = e.target.value ? props.data?.filter(country => country.Name.toLowerCase().startsWith(e.target.value.toLowerCase())) : props.data;
                                props.setSearch(prevState => {
                                    return {
                                        ...prevState,
                                        countryCode: {...prevState.countryCode, menu: {...prevState.countryCode, search: {results: searchedResults, word: e.target.value} }}
                                    }
                                })
                            }}
                        />
                    }
                    {props.id === "countryCode" ?
                        <div>
                            {props.state.menu.search.results.length ? 
                                props.state.menu.search.results.map(country => 
                                    <p key={country.Code} onClick={() => menuItemClickHandler(country)}>
                                        <b>{country.Name.slice(0, [props.state.menu.search.word.length])}</b>
                                        {country.Name.slice([props.state.menu.search.word.length])}
                                    </p>)
                                : props.state.menu.search.word ? 
                                    <h4>Not Found</h4>
                                    : props.data?.map(country => <p key={country.Code} onClick={() => menuItemClickHandler(country)}>{country.Name}</p>)
                            }
                        </div>
                        : <div>
                            {
                                props.state.menu.feed.map(category => <p key={category.Code} onClick={() => menuItemClickHandler(category)}>{category.Name}</p>)
                            }
                        </div>
                    }
                </div>

            </div>
};