import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { selectUser } from '../state/user/user.selectors';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let store: Store;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, StoreModule.forRoot({})],  
      providers: [AuthGuard]
    });

    guard = TestBed.inject(AuthGuard);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation when user is authenticated', (done) => {
    spyOn(store, 'select').and.returnValue(of({ id: 'user1', name: 'Test User' }));

    guard.canActivate().subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should redirect to login when user is not authenticated', (done) => {
    spyOn(store, 'select').and.returnValue(of(null));
    spyOn(router, 'navigate');

    guard.canActivate().subscribe((result) => {
      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });
});
