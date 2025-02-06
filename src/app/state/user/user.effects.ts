import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { IndexedDbService } from '../../services/indexed-db.service';
import {
  login,
  loginSuccess,
  loginFailure,
  updateUser,
  updateUserSuccess,
  updateUserFailure,
  deleteUser,
  deleteUserSuccess,
  deleteUserFailure,
} from './user.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private indexedDbService: IndexedDbService
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap((action) =>
        from(this.indexedDbService.getUser(action.email)).pipe(
          map((user) => {
            if (user && user.password === action.password) {
              return loginSuccess({ user });
            } else {
              return loginFailure({ error: 'Email ou mot de passe incorrect.' });
            }
          }),
          catchError((error) => of(loginFailure({ error: 'Une erreur est survenue.' })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      mergeMap((action) =>
        from(this.indexedDbService.updateUser(action.user)).pipe(
          map((user) => updateUserSuccess({ user })),
          catchError((error) => of(updateUserFailure({ error: 'Une erreur est survenue.' })))
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteUser),
      mergeMap((action) =>
        from(this.indexedDbService.deleteUser(action.email)).pipe(
          map(() => deleteUserSuccess()),
          catchError((error) => of(deleteUserFailure({ error: 'Une erreur est survenue.' })))
        )
      )
    )
  );
}
