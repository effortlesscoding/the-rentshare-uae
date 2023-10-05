
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
  images: string[];
  geometry: {
    lat: number;
    lng: number;
  };
  host: {
    name: string;
    lastOnline: 'today' | 'yesterday' | 'recently';
    responseRate: number;
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
    buildingType: string;
    roomType: string;
    deposit: number;
    peopleInTheHouse: number;
    preferredTenants: string;
    updated: string;
    furnishing: 'furnished' | 'unfurnished',
  }
}

export interface Response<T> {
    status: number;
    data: T;
}