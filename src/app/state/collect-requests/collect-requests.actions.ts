import { createAction, props } from '@ngrx/store';

export const loadCollectRequests = createAction('[CollectRequests] Load Collect Requests');
export const loadCollectRequestsSuccess = createAction(
  '[CollectRequests] Load Collect Requests Success',
  props<{ requests: any[] }>()
);
export const loadCollectRequestsFailure = createAction(
  '[CollectRequests] Load Collect Requests Failure',
  props<{ error: string }>()
);
