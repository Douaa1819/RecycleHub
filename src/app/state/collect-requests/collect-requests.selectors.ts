import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollectRequestsState } from './collect-requests.reducer';

const getCollectRequestsState = createFeatureSelector<CollectRequestsState>('collectRequests');

export const selectAllCollectRequests = createSelector(
  getCollectRequestsState,
  (state: CollectRequestsState) => state.requests
);
