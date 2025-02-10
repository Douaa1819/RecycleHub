import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRequestsComponent } from '../user-requests/user-requests.component';
import { CollectRequestComponent } from '../collect-request/collect-request.component';
import { ProfileComponent } from '../../auth/profile/profile.component';
import { RouterOutlet,Router, ActivatedRoute } from '@angular/router';
import { UserPointsComponent } from '../user-points/user-points.component';

@Component({
  selector: 'app-particulier-dashboard',
  standalone: true,
  imports: [CommonModule, UserRequestsComponent, UserPointsComponent,CollectRequestComponent, ProfileComponent],
  templateUrl: './particulier-dashboard.component.html',
  styleUrls: ['./particulier-dashboard.component.css'],
})
export class ParticulierDashboardComponent  implements OnInit {
  user: any;

  activeSection: string = 'requests';

  showSection(section: string) {
    this.activeSection = section;
  }
  constructor(private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.user = this.route.snapshot.data['user']; // pour acceder aux données résolues
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }


}
