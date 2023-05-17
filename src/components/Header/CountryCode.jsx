import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import countryCodes from "../../api/search/countryCodes";
import SelectMenu from "../../utils/SelectMenu";

export default function CountryCode(props){
    const {data} = useQuery({
        queryKey: ["country codes"],
        queryFn: countryCodes,
    })

    return <SelectMenu
            id="countryCode"
            state={props.search.countryCode}
            setSearch={props.setSearch}
            style={props.style}
            iconHandler={props.iconHandler}
            icon={faFlag}
            data={data}
            />
};