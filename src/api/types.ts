
export type Feature = 'tv' | 'fridge' | 'balcony' | 'wardrobe' | 'doorLock' | 'aircon' | 'lamp' | 'couch' | 'kitchenette';

export interface PropertyListingDetails {
    id: string;
    address: string;
    neighbourhoodId: number;
    neighbourhood: string;
    type: 'privateRoom' | 'sharedRoom';
    bathroomType: 'private' | 'shared';
    shortDescription: string;
    description: string;
    aboutFlatmates: string;
    geometry: {
        lat: number;
        lng: number;
    };
    features: {
        [key in Feature]: boolean;
    },
    specs: {
        price: number;
        cycle: 'weekly' | 'monthly' | 'annual';
        bills: 'billsIncluded' | 'billsNotIncluded';
        bedrooms: number;
        bathrooms: number;
    }
}


export interface Response<T> {
    status: number;
    data: T;
}