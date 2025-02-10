import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CollectorRequestsComponent } from '../collector-requests/collector-requests.component';
import { CollectorRequestDetailsComponent } from '../collector-request-details/collector-request-details.component';
import { ProfileComponent } from '../../auth/profile/profile.component';

@Component({
  selector: 'app-collector-dashboard',
  standalone: true,
  imports: [CommonModule, CollectorRequestsComponent, ProfileComponent],
  templateUrl: './collector-dashboard.component.html',
  styleUrls: ['./collector-dashboard.component.css'],
})
export class CollectorDashboardComponent {
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
