import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRequestsComponent } from '../user-requests/user-requests.component';
import { CollectRequestComponent } from '../collect-request/collect-request.component';
import { ProfileComponent } from '../../auth/profile/profile.component';
import { RouterOutlet,Router } from '@angular/router';
import { UserPointsComponent } from '../user-points/user-points.component';

@Component({
  selector: 'app-particulier-dashboard',
  standalone: true,
  imports: [CommonModule, UserRequestsComponent, UserPointsComponent,CollectRequestComponent, ProfileComponent],
  templateUrl: './particulier-dashboard.component.html',
  styleUrls: ['./particulier-dashboard.component.css'],
})
export class ParticulierDashboardComponent {
  activeSection: string = 'requests';

  showSection(section: string) {
    this.activeSection = section;
  }
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }


}
