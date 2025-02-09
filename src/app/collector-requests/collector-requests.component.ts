import { Component, OnInit } from '@angular/core';
import { IndexedDbService } from '../services/indexed-db.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collector-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collector-requests.component.html',
  styleUrls: ['./collector-requests.component.css'],
})
export class CollectorRequestsComponent implements OnInit {
  requests: any[] = [];
  errorMessage: string | null = null;

  constructor(
    private indexedDbService: IndexedDbService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadRequests();
  }

  async loadRequests() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const city = currentUser.city;
    if (city) {
      this.requests = await this.indexedDbService.getCollectRequestsByCity(city);
      console.log('Demandes récupérées:', this.requests);
    } else {
      this.errorMessage = 'Ville non définie pour le collecteur.';
    }
  }

  async acceptRequest(id: number) {
    try {
      await this.indexedDbService.updateCollectRequestStatus(id, 'Occupée');
      await this.loadRequests();
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de la demande :', error);
      this.errorMessage = 'Une erreur est survenue lors de l\'acceptation.';
    }
  }

  async validateRequest(id: number) {
    try {
      await this.indexedDbService.updateCollectRequestStatus(id, 'Validée');
      await this.loadRequests(); 
    } catch (error) {
      console.error('Erreur lors de la validation de la demande :', error);
      this.errorMessage = 'Une erreur est survenue lors de la validation.';
    }
  }

  async rejectRequest(id: number) {
    try {
      await this.indexedDbService.updateCollectRequestStatus(id, 'Rejetée');
      await this.loadRequests();
    } catch (error) {
      console.error('Erreur lors du rejet de la demande :', error);
      this.errorMessage = 'Une erreur est survenue lors du rejet.';
    }
  }
}
