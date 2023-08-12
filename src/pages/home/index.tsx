import Grid from '@mui/material/Grid';
import Listings from "../../components/listings";

const HomePage = () => {
    return (
        <Grid container justifyContent="center">
            <Grid item xs={10} sm={8}>
                <Listings />
            </Grid>
        </Grid>
    )
};

export default HomePage;
