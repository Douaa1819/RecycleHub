import { createReducer, on } from '@ngrx/store';
import { loadCollectRequestsSuccess } from './collect-requests.actions';

export interface CollectRequestsState {
  requests: any[];
}

export const initialState: CollectRequestsState = {
  requests: [],
};

export const collectRequestsReducer = createReducer(
  initialState,
  on(loadCollectRequestsSuccess, (state, { requests }) => ({ ...state, requests }))
);


