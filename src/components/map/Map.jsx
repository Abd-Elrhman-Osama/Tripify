import { MapContainer, Polyline, TileLayer } from 'react-leaflet';
import UserLocate from './UserLocate';
import UserInteraction from './UserInteraction';
import ScrollBtn from '../../utils/ScrollBtn';
import MapLocate from './MapLocate';
import Locations from './Locations';
import { useSelector } from 'react-redux';

export default function Map() {
    const route = useSelector(state => state.routing.route);
    return (
        <MapContainer id='map' center={[30.033333, 31.233334]} zoom={13} style={{height: window.innerWidth < 700 ? 'calc(100vh - 110px)' : 'calc(100vh - 65px)', width: '100%'}}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                maxZoom={19}
            />
            <UserLocate />
            <Locations />
            <UserInteraction />
            <MapLocate />
            {route?.status === "ok" && <Polyline positions={route.directions.coords.map(i => [i.lat, i.lng])} color={"red"} weight={"4"}/>}
            <ScrollBtn direction='down'/>
        </MapContainer>
    )
}