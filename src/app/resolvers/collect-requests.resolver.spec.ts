import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { CollectRequestsResolver } from './collect-requests.resolver';
import { collectRequestsReducer } from '../state/collect-requests/collect-requests.reducer';

describe('CollectRequestsResolver', () => {
  let resolver: CollectRequestsResolver;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({ collectRequests: collectRequestsReducer })
      ],
      providers: [CollectRequestsResolver]
    });
    resolver = TestBed.inject(CollectRequestsResolver);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve collect requests', (done) => {
    store.dispatch({ type: '[CollectRequests] Load Collect Requests Success', requests: [{ id: '1', title: 'Request 1' }] });

    resolver.resolve().subscribe((requests) => {
      expect(requests).toEqual([{ id: '1', title: 'Request 1' }]);
      done();
    });
  });
});
