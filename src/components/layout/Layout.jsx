import Header from '../Header/Header';
import Map from '../map/Map';
import List from '../list/List';
import style from './Layout.module.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RoutingContainer from '../Routing/RoutingContainer';

export default function Layout(){
    const queryClient = new QueryClient()

    return(
        <QueryClientProvider client={queryClient}>
            <div className={style.layout}>
                <Header />
                <div className={style.data}>
                    <Map />
                    <RoutingContainer />
                    <List />
                </div>
            </div>
        </QueryClientProvider>
    )
};