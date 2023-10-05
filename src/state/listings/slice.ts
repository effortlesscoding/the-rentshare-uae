import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { PropertyListingDetails } from "../../api/types";
import * as ListingsApi from '../../api/listings';

type ApiState = 'loading' | 'done' | 'error' | 'initial';

// fine a type for the slice state
interface ListingsState {
  state: ApiState;
  searchPlaceName: string | null;
  listings: Record<string, {
    data: PropertyListingDetails | null;
    error?: string;
    state: ApiState;
  }>;
}

// Define the initial state using that type
const initialState: ListingsState = {
  state: 'initial',
  searchPlaceName: null,
  listings: {},
}

export const searchListingsByPlaceId = createAsyncThunk(
    'listings/search',
    async (args: { placeId: string; placeName: string; }, thunkAPI) => {
      const { placeId } = args;
      try {
        const response = await ListingsApi.searchListings(placeId);
        return response.data.map(listing => ({
          ...listing.extraDetails,
          id: listing.id,
        }));
      } catch (err) {
        return thunkAPI.rejectWithValue([]);
      }
    }
)

export const getListingByListingId = createAsyncThunk(
  'listings/fetch',
  async (args: { listingId: string }, thunkAPI): Promise<PropertyListingDetails> => {
      const response = await ListingsApi.getListingById(args.listingId);
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
      builder.addCase(searchListingsByPlaceId.pending, (state, action) => {
        console.log('debug::searchListingsByPlaceId::action::', action);
        // Add a listing to the state array
        state.state = 'loading';
        state.searchPlaceName = action.meta.arg.placeName;
        state.listings = {};
      });
      builder.addCase(searchListingsByPlaceId.fulfilled, (state, action) => {
        // Add a listing to the state array
        state.state = 'done';
        state.listings = {
          ...state.listings,
          ...action.payload.reduce<ListingsState['listings']>((map, listing) => {
            map[listing.id] = {
              data: listing,
              state: 'done',
            };
            return map;
          }, {})
        };
      });
      builder.addCase(searchListingsByPlaceId.rejected, (state, action) => {
        // Add a listing to the state array
        state.state = 'error';
        state.listings = {};
      });
      builder.addCase(getListingByListingId.pending, (state, action) => {
        console.log('debug::getListingById::', action);
        state.listings = {
          ...state.listings,
          [action.meta.arg.listingId]: {
            data: null,
            state: 'loading',
          },
        };
        console.log('debug::state.listings::', state.listings, action.payload);
      });
      builder.addCase(getListingByListingId.fulfilled, (state, action) => {
        // Add a listing to the state array
        state.listings = {
          ...state.listings,
          [action.payload.id]: {
            data: action.payload,
            state: 'done',
          },
        };
        console.log('debug::state.listings::', state.listings, action.payload);
      });
      builder.addCase(getListingByListingId.rejected, (state, action) => {
        // Add a listing to the state array
        state.listings = {
          ...state.listings,
          [action.meta.arg.listingId]: {
            data: null,
            state: 'error',
          },
        };
        console.log('debug::state.listings::', state.listings, action.payload);
      });
    },
  });
