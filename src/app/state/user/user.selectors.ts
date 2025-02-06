import { createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = (state: any) => state.user;

export const selectUser = createSelector(
  selectUserState,
  (state: UserState) => state.user
);
