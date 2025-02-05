import { createReducer, on } from '@ngrx/store';
import { loginSuccess, updateUserSuccess, deleteUserSuccess } from './user.actions';

export interface UserState {
  user: any | null;
}

export const initialState: UserState = {
  user: null,
};

export const userReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { user }) => ({ ...state, user })),
  on(updateUserSuccess, (state, { user }) => ({ ...state, user })),
  on(deleteUserSuccess, (state) => ({ ...state, user: null }))
);
