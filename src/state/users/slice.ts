import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import * as UsersApi from '../../api/users';

// fine a type for the slice state
interface UsersState {
  user: UsersApi.User | null;
}

// Define the initial state using that type
const initialState: UsersState = {
  user: null,
}

interface LoginRequest {
    email: string;
    password: string;
}

interface RegistrationRequest extends LoginRequest {
    extraDetails: object;
}

export interface AuthPayload {
  user: UsersApi.User | null;
  status: number;
  error?: string;
}

export const loginUser = createAsyncThunk(
    'users/login',
    async ({ email, password }: LoginRequest): Promise<AuthPayload> => {
        const { status, data: user } = await UsersApi.login({ email, password });
        if (status === 200) {
          return { user, status };
        }
        return { user: null, status, error: 'Failed to login' };
    }
)

export const registerUser = createAsyncThunk(
  'users/register',
  async ({ email, password, extraDetails }: RegistrationRequest, thunkAPI): Promise<AuthPayload> => {
      const { status, data: user } = await UsersApi.register({ email, password, extraDetails });
      if (status === 201) {
        return { user, status };
      }
      return { user: null, status, error: 'Failed to register' };
  }
)

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
      builder.addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
    },
  });
