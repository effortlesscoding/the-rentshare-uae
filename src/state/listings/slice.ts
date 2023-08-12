import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { PropertyListingDetails } from "../../api/types";
import * as ListingsApi from '../../api/listings';

// fine a type for the slice state
interface ListingsState {
  listings: Record<string, PropertyListingDetails>;
}

// Define the initial state using that type
const initialState: ListingsState = {
  listings: {},
}

export const searchListingsByPlaceId = createAsyncThunk(
    'listings/search',
    async (placeId: string, thunkAPI): Promise<PropertyListingDetails[]> => {
        const response = await ListingsApi.searchListingsId(placeId);
        return response.data.map(listing => ({
          ...listing.extraDetails,
          id: listing.id,
        }));
    }
)

export const getListingByListingId = createAsyncThunk(
  'listings/fetch',
  async (listingId: string, thunkAPI): Promise<PropertyListingDetails> => {
      const response = await ListingsApi.getListingById(listingId);
      return {
        ...response.data.extraDetails,
        id: response.data.id,
      };
  }
)

export const sendListingMessage = createAsyncThunk(
  'listings/sendMessage',
  async (request:{
    fromUserId: string;
    listingId: string;
    message: string;
}, thunkAPI): Promise<any> => {
      const response = await ListingsApi.sendListingMessage(request);
      return response;
  }
)

export const listingsSlice = createSlice({
    name: 'listings',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      // Add reducers for additional action types here, and handle loading state as needed
      builder.addCase(searchListingsByPlaceId.fulfilled, (state, action) => {
        // Add a listing to the state array
        state.listings = {
          ...state.listings,
          ...action.payload.reduce<Record<string, PropertyListingDetails>>((map, listing) => {
            map[listing.id] = listing;
            return map;
          }, {})
        };
      });
      builder.addCase(getListingByListingId.fulfilled, (state, action) => {
        // Add a listing to the state array
        state.listings = {
          ...state.listings,
          [action.payload.id]: action.payload,
        };
        console.log('debug::state.listings::', state.listings, action.payload);
      });
    },
  });
