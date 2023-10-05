import { PropertyListingDetails } from "./types";
import { config } from './config';

const BASE_URL = config.apiHost;

export const searchListings = (placeId: string): Promise<{
    data: Array<{
        id: string;
        extraDetails: PropertyListingDetails;
        createdAt: string;
        updatedAt: string;
    }>
}> =>
    fetch(`${BASE_URL}/listings/search`, {
        method: 'POST',
        body: JSON.stringify({ placeId }),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(r => r.json());


export const getListingById = (listingId: string): Promise<{
    data: {
        id: string;
        extraDetails: PropertyListingDetails;
        createdAt: string;
        updatedAt: string;
    }
}> =>
    fetch(`${BASE_URL}/listings/${listingId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(r => r.json());

export const sendListingMessage = (request:{
    fromUserId: string;
    listingId: string;
    message: string;
}): Promise<{ sent:boolean;}> =>
        fetch(`${BASE_URL}/listings/message`, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(r => r.json());
