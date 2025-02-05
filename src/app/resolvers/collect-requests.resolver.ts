import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, take } from 'rxjs/operators';
import { loadCollectRequests } from '../state/collect-requests/collect-requests.actions';
import { selectAllCollectRequests} from '../state/collect-requests/collect-requests.selectors';

interface CollectRequest {  // Définir un type explicite pour les demandes de collecte
  id: string;
  title: string;
  // Ajoutez d'autres propriétés ici selon vos besoins
}

@Injectable({
  providedIn: 'root',
})
export class CollectRequestsResolver implements Resolve<CollectRequest[]> {  // Préciser que le résolveur retourne un tableau de CollectRequest
  constructor(private store: Store) {}

  resolve(): Observable<CollectRequest[]> {
    // Dispatcher l'action pour charger les demandes de collecte
    this.store.dispatch(loadCollectRequests());

    // Retourner les données une fois qu'elles sont chargées
    return this.store.select(selectAllCollectRequests).pipe(
      // Attendre que les données soient disponibles
      filter((requests: CollectRequest[]) => requests.length > 0),
      take(1), // Prendre la première valeur émise
      catchError(() => {
        // En cas d'erreur, retourner un Observable vide ou une valeur par défaut
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );
  }
}
