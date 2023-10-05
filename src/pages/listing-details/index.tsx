import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ImageGallery from '../../components/image-gallery';
import {
    Air,
    Kitchen,
    Balcony,
    Bed,
    CalendarMonth,
    DoorBack,
    MonetizationOn,
    Receipt,
    Tv,
    Weekend,
    Close,
    Lock,
    Countertops,
    EmojiObjects,
    Checkroom,
    Bathtub
} from '@mui/icons-material';
import { Avatar, Button, Chip, CircularProgress, IconButton, TextField } from '@mui/material';
import { RootState } from '../../state/store';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../state/hooks';
import { getListingByListingId, sendListingMessage } from '../../state/listings/slice';
import Authentication from '../authentication';
import { Feature } from '../../api/types';
import { trackEvent } from '../../utils/analytics';
interface ListingFeatureProps {
    icon: JSX.Element;
    label: string;
    sublabel?: string;
}

const ListingFeature = ({
    icon,
    label,
    sublabel,
}: ListingFeatureProps) => {
    return (
        <Grid container sx={{ width: 'auto' }}>
            <Grid item sx={{ width: '48px' }}>
                {icon}
            </Grid>
            <Grid item sx={{ flex: 1, '& p': { margin: 0, paddingBottom: '1rem', } }}>
                <p>{label}</p>
                <p>{sublabel}</p>
            </Grid>
        </Grid>
    )
}

const roomType = (type: 'privateRoom' | 'sharedRoom') => {
    if (type === 'privateRoom') {
        return 'Private room';
    }
    if (type === 'sharedRoom') {
        return 'Shared room';
    }
    return 'Room';
}

const featureToComponent: Record<Feature, JSX.Element> = {
    'aircon': <ListingFeature
        icon={<Air />}
        label="Air conditioner"
    />,
    'tv':  <ListingFeature
        icon={<Tv />}
        label="TV"
    />,
    'balcony':  <ListingFeature
        icon={<Balcony />}
        label="Balcony"
    />,
    'couch' :  <ListingFeature
        icon={<Weekend />}
        label="Couch"
    />,
    'doorLock': <ListingFeature
        icon={<Lock />}
        label="Smart lock"
    />,
    'fridge':  <ListingFeature
        icon={<Kitchen />}
        label="Fridge"
    />,
    'kitchenette': <ListingFeature
        icon={<Countertops />}
        label="Kitchenette"
    />,
    'lamp':  <ListingFeature
        icon={<EmojiObjects />}
        label="Kitchenette"
    />,
    'wardrobe': <ListingFeature
        icon={<Checkroom />}
        label="Wardrobe"
    />,
}

const ListingDetails = () => {
    // Grab the listing id from the URL
    const params = useParams();
    const listingId = params['listingId'];
    const [messageSent, setMessageSent] = useState(false);
    const [message, setMessage] = useState('');
    const listingData = useSelector((state: RootState) => {
        if (!listingId) {
            return null;
        }
        return state.listings.listings[listingId];
    });

    const user = useSelector((state: RootState) => {
        return state.users.user
    });
    const dispatch = useAppDispatch();
    const [registrationFormOpen, setRegistrationFormOpen] = useState(false);

    const handleSendMessage = (e?: FormEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (!user) {
            trackEvent('ui_event', {
                action: 'clicked',
                subject: 'sendHostMessageButton',
                extra: 'unregistered'
            });
            setRegistrationFormOpen(true);
        } else {
            trackEvent('ui_event', {
                action: 'clicked',
                subject: 'sendHostMessageButton',
                extra: 'registration'
            });
            dispatch(sendListingMessage({
                fromUserId: user.id,
                message,
                listingId: listingData?.data?.id ?? '--',
            }));
            setMessageSent(true);
        }
    };

    const fetched = useRef(false);
    useEffect(() => {
        if (!listingId || fetched.current) {
            return;
        }
        if (!listingData?.data && !fetched.current) {
            fetched.current = true;
            dispatch(getListingByListingId({ listingId }));
        }
    }, [dispatch, listingData, listingId])

    if (listingData?.state === 'loading') {
        return (
            <Grid container justifyContent="center">
                <CircularProgress />
            </Grid>
        );
    }

    if (listingData?.state === 'error') {
        return (
            <Grid container justifyContent="center">
                <p>Sorry, we could not retrieve the listing.</p>
            </Grid>
        );
    }
    const listing = listingData?.data;
    if (!listing) {
        if (listingData?.state === 'initial') {
            return null;
        }
        return (
            <Grid container justifyContent="center">
                <h1>Sorry, we could not find the listing</h1>
            </Grid>
        );
    }

    const featureComponents = Object.entries(listing.features).reduce<JSX.Element[]>((components, [feature, available]) => {
        const featureComponent = featureToComponent[feature as Feature];
        if (available && featureComponent) {
            components.push(featureComponent);
        }
        return components;
    }, []);

    const featureComponentsPerColumn = Math.min(featureComponents.length, Math.ceil(9 / 2));

    return (
        <>
            <Grid container justifyContent="center">
                <Grid item container xs={10} sm={8}>
                    <Grid item container xs={12} sx={{ marginBottom: '1rem', }}>
                        <span><a href="/">Home</a> / {listing.address}</span>
                    </Grid>
                    <Grid item container>
                        <ImageGallery
                            imageURLs={
                                listing.images.map((img) => ({
                                    original: img,
                                    thumbnail: img,
                                }))
                            }
                        />
                    </Grid>
                    <Grid item container sm={8} sx={{ paddingRight: '2rem' }}>
                        <Grid item xs={10} sm={8}>
                            <h2>{listing.address}</h2>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Bathtub /> <span style={{ margin: '0 12px'}}>{listing.specs.bathrooms}</span>
                                <Bed /> {listing.specs.bedrooms}
                            </div>
                        </Grid>
                        <Grid item xs={10} sm={8}>
                            <p>{listing.shortDescription}</p>
                            <h2>About the property</h2>
                            <p>{listing.description}</p>
                            <h2>Room overview</h2>
                            <Grid container>
                                <Grid item xs={6}>
                                    <ListingFeature
                                        icon={<MonetizationOn />}
                                        label={listing.specs.price + ' ' + listing.specs.cycle}
                                    />
                                    <ListingFeature
                                        icon={<DoorBack />}
                                        label={roomType(listing.type)}
                                    />
                                    <ListingFeature
                                        icon={<CalendarMonth />}
                                        label={'Min 6 months'}
                                    />
                                    <ListingFeature
                                        icon={<Bed />}
                                        label={listing.specs.furnishing === 'unfurnished' ? 'Unfurnished' : 'Furnished'}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <ListingFeature
                                        icon={<Receipt />}
                                        label={listing.specs.bills === 'billsIncluded' ? 'DEWA included' : 'DEWA not included'}
                                    />
                                    <ListingFeature
                                        icon={<DoorBack />}
                                        label={listing.specs.bedrooms + ' bedrooms'}
                                    />
                                </Grid>
                            </Grid>
                            <h2>Features</h2>
                            <Grid container>
                                <Grid item xs={6}>
                                    {featureComponents
                                        .slice(0, featureComponentsPerColumn)
                                        .map(component => component)}
                                </Grid>
                                <Grid item xs={6}>
                                    {featureComponents
                                        .slice(featureComponentsPerColumn, featureComponents.length)
                                        .map(component => component)}
                                </Grid>
                            </Grid>
                            {/* <h2>About the flatmates</h2>
                            <p>
                                I’m Alex, a 33 year old risk consulting professional working in the city, work in the city 2-3 days a week and 2 days WFH. Love hiking and seeing friends for brunch and outings on the weekends.
                            </p>
                            <p>
                                I’m a social but private person, and very respectful of other people’s privacy.
                            </p>
                            <p>
                                I’m neat and tidy and would prefer people who are the same, personal / share space hygiene is big for me.
                            </p> */}
                        </Grid>
                    </Grid>
                    <Grid item container sm={4}>
                        <Grid>
                            <Grid
                                component="form"
                                sx={{
                                    marginTop: '2rem',
                                    backgroundColor: '#efefef',
                                    border: '1px solid #ececec',
                                    borderRadius: '12px',
                                    padding: '12px',
                                }}
                                onSubmit={handleSendMessage}
                            >
                                <Grid item container sx={{ marginBottom: '12px' }}>
                                    <Grid item sx={{ padding: '0 1rem 0 0' }}>
                                        <Avatar />
                                    </Grid>
                                    <Grid item sx={{ '& p': { margin: 0 }, '& h3': { margin: '0 1rem 0 0' }}}>
                                        <h3>Message {listing.host?.name ?? 'the host'}</h3>
                                        <p>Online {listing.host?.lastOnline ?? 'recently'}</p>
                                        {listing.host?.responseRate > 0.5 ? <Chip label={`Response rate ${listing.host.responseRate * 100}%`} /> : null}
                                    </Grid>
                                </Grid>
                                <TextField
                                    placeholder="Type your message..."
                                    sx={{ width: '100%', marginBottom: '12px' }}
                                    multiline
                                    onChange={(e) => setMessage(e.target.value)}
                                    value={message}
                                />
                                <Button
                                    variant="contained"
                                    sx={{ width: '100%' }}
                                    type="submit"
                                    disabled={messageSent}
                                >
                                    {messageSent ? 'Message sent' : 'Send message to the host'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Dialog
                open={registrationFormOpen}
            >
                <Grid container sx={{ minWidth: '500px', padding: 2, }}>
                    <Grid item container justifyContent="space-between" sx={{ '& h2': { margin: '12px 0' } }}>
                        <h2>Create an account or sign in to send a message</h2>
                        <IconButton onClick={() => setRegistrationFormOpen(false)}>
                            <Close />
                        </IconButton>
                    </Grid>
                    <Authentication defaultTab='2' onDone={() => {
                        handleSendMessage();
                        setRegistrationFormOpen(false);
                    }}/>
                </Grid>
            </Dialog>
        </>
    );
};

export default ListingDetails;
