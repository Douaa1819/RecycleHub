import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard],
    });

    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if user is logged in', () => {
    localStorage.setItem('currentUser', JSON.stringify({ email: 'test@example.com' }));

    const result = guard.canActivate();

    expect(result).toBeTrue();
  });

  it('should block access and redirect to login if user is not logged in', () => {
    localStorage.removeItem('currentUser');

    const navigateSpy = spyOn(router, 'navigate');

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']); 
  });
});
