import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      return true; // Autoriser l'accès si l'utilisateur est connecté
    } else {
      this.router.navigate(['/login']); // Rediriger vers la page de connexion
      return false; // Bloquer l'accès
    }
  }
}
