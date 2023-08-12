import {
    Route,
    Routes,
} from "react-router-dom";
import Home from './home';
import Authentication from "./authentication";
import ListingDetails from "./listing-details";

const PageRoutes = () => {
    return (
        <Routes>
            <Route path="/" Component={Home} />
            <Route path="/auth" Component={Authentication} />
            <Route path="/listing/:listingId" Component={ListingDetails} />
        </Routes>
    );
}

export default PageRoutes;
