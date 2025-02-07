import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  template: `<p>Déconnexion en cours...</p>`,
})
export class LogoutComponent {
  constructor(private router: Router) {
    this.logout();
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
