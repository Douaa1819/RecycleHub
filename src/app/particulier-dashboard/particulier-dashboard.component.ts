import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-particulier-dashboard',
  imports: [],
  templateUrl: './particulier-dashboard.component.html',
  styleUrl: './particulier-dashboard.component.css'
})
export class ParticulierDashboardComponent {
  collectRequests: any[] = [];

  constructor(private route: ActivatedRoute) {
    this.collectRequests = this.route.snapshot.data['collectRequests'];
  }

}
