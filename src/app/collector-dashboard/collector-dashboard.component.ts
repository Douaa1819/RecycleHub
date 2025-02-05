import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-collector-dashboard',
  imports: [],
  templateUrl: './collector-dashboard.component.html',
  styleUrl: './collector-dashboard.component.css'
})
export class CollectorDashboardComponent {
  collectRequests: any[] = [];

  constructor(private route: ActivatedRoute) {
    this.collectRequests = this.route.snapshot.data['collectRequests'];
  }


}
