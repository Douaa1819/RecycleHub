import { CollectRequestService } from './../../../core/services/collect-request.service';
import { UserService } from './../../../core/services/user.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-requests',
  standalone: true,
 imports: [ReactiveFormsModule, CommonModule],
 templateUrl: './user-requests.component.html',
  styleUrls: ['./user-requests.component.css'],
})
export class UserRequestsComponent implements OnInit {
  requests: any[] = [];
  errorMessage: string | null = null;

  constructor(
    private collectRequestService: CollectRequestService,

    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadRequests();
  }

  async loadRequests() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.email;
    console.log('Utilisateur actuel:', userId);

    this.requests = await this.collectRequestService.getUserRequests(userId);
    console.log('Demandes récupérées:', this.requests);
  }

  async deleteRequest(id: number) {
    try {
      await this.collectRequestService.deleteCollectRequest(id);
      await this.loadRequests();
    } catch (error) {
      console.error('Erreur lors de la suppression de la demande :', error);
      this.errorMessage = 'Une erreur est survenue lors de la suppression.';
    }
  }

  editRequest(id: number) {
    this.router.navigate(['/edit-request', id]);
  }
}
