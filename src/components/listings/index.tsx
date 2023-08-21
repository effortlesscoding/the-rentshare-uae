import styled from "@emotion/styled";
import Grid from '@mui/material/Grid';
import { useNavigate } from "react-router-dom";
// import { listings } from "../../state/listings";
import { useSelector } from 'react-redux';
import { RootState } from "../../state/store";
import { Bathroom, Bed } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

const Image = styled.div`
    background-size: cover;
    height: 200px;
    width: 100%;
`

const Listings = () => {
    const navigate = useNavigate();
    const listingsState = useSelector((state: RootState) => state.listings);
    const listingsData = useSelector((state: RootState) => Object.values(state.listings.listings));

    console.log('debug::listingsData::', listingsData);
    if (listingsState.state === 'initial') {
        return (
            <h1>Type in the neighbourhood you want to find a shared accommodation in.</h1>
        );
    }

    if (listingsState.state === 'loading') {
        return (
            <Grid container>
                <CircularProgress /><span>Searching in {listingsState.searchPlaceName}</span>
            </Grid>
        );
    }

    const listingsDataLoaded = Object.values(listingsData).filter(l => l.data && l.state === 'done');

    if (!listingsDataLoaded.length) {
        return (
            <h1>Nothing found in {listingsState.searchPlaceName}</h1>
        );
    }
    const listings = listingsDataLoaded.map(l => l.data);
    const listingNeighbourhood = listingsState.searchPlaceName;
    const listingComponents = listings.filter(l => !!l).map((listing, idx) => {
        if (!listing) {
            return null;
        }
        return (
            <Grid
                item
                xs={12}
                md={6}
                lg={4}
                className="listing"
                key={`key=${idx}`}
                role="button"
                onClick={() => navigate(`listing/${listing.id}`)}
                sx={{
                    transition: 'transform .2s ease-in',
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'translate(-2px, -2px)',
                        boxShadow: '2px 2px #ececec',
                    }
                }}
            >
                <Image
                    style={{
                        backgroundImage: `url('https://mybayutcdn.bayut.com/mybayut/wp-content/uploads/Comparison-between-Arabian-Ranches-vs-Dubai-hills-estate-3rd-April-2020.png')`
                    }}
                />
                <h2>{listing.address}</h2>
                <p><Bathroom /> {listing.specs.bathrooms} <Bed /> {listing.specs.bedrooms}</p>
                <p>{listing.shortDescription}</p>
            </Grid>
        )
    })

    return (
        <>
            <h1>Available share houses in {listingNeighbourhood}</h1>
            <Grid container gap={0} spacing={4}>
                {listingComponents}
            </Grid>
        </>
    )
};

export default Listings;