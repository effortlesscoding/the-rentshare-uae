import { useEffect, useRef } from "react";
import {
    Route,
    Routes,
    useLocation,
} from "react-router-dom";
import Home from './home';
import Authentication from "./authentication";
import ListingDetails from "./listing-details";
import { trackEvent } from "../utils/analytics";

const PageRoutes = () => {
    const location = useLocation();
    const ref = useRef<string | null>(null);

    useEffect(() => {
        console.log('debug::ref.current::', ref.current);
        if (ref.current !== location.pathname) {
            ref.current = location.pathname;

            trackEvent('pageview', { page: location.pathname });
        }
    }, [location.pathname]);

    return (
        <Routes>
            <Route path="/" Component={Home} />
            <Route path="/auth" Component={Authentication} />
            <Route path="/listing/:listingId" Component={ListingDetails} />
        </Routes>
    );
}

export default PageRoutes;
