import { faFilter } from "@fortawesome/free-solid-svg-icons"
import SelectMenu from "../../utils/SelectMenu"

export default function Filter(props){
    return <SelectMenu
            id="filter"
            state={props.search.filter}
            setSearch={props.setSearch}
            style={props.style}
            iconHandler={props.iconHandler}
            icon={faFilter}
            />
};