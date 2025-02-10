import { Component } from '@angular/core';
import { RouterOutlet,Router } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'RecycleHub';

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
