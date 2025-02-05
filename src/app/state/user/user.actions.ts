import { createAction, props } from '@ngrx/store';

export const login = createAction('[User] Login', props<{ email: string; password: string }>());
export const loginSuccess = createAction('[User] Login Success', props<{ user: any }>());
export const loginFailure = createAction('[User] Login Failure', props<{ error: string }>());

export const updateUser = createAction('[User] Update User', props<{ user: any }>());
export const updateUserSuccess = createAction('[User] Update User Success', props<{ user: any }>());
export const updateUserFailure = createAction('[User] Update User Failure', props<{ error: string }>());

export const deleteUser = createAction('[User] Delete User', props<{ email: string }>());
export const deleteUserSuccess = createAction('[User] Delete User Success');
export const deleteUserFailure = createAction('[User] Delete User Failure', props<{ error: string }>());
