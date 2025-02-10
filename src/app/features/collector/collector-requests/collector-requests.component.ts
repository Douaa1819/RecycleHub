import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IndexedDbService } from '../../../core/services/indexed-db.service';

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
  getStatusClass(status: string): string {
    switch (status) {
      case 'En attente':
        return 'en-attente';
      case 'Occupée':
        return 'occupée';
      case 'En cours':
        return 'en-cours';
      case 'Validée':
        return 'validée';
      case 'Rejetée':
        return 'rejetée';
      default:
        return '';
    }
  }
  async loadRequests() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const city = currentUser.city;
    if (city) {
      const allRequests = await this.indexedDbService.getCollectRequestsByCity(city);
      this.requests = allRequests.filter(req => ['En attente', 'Occupée', 'En cours','Validée'].includes(req.status));
      console.log('Requests:', this.requests);
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


  async startCollection(id: number) {
    try {
      await this.indexedDbService.updateCollectRequestStatus(id, 'En cours');
      await this.loadRequests();
    } catch (error) {
      console.error('Erreur lors du démarrage de la collecte :', error);
      this.errorMessage = 'Une erreur est survenue lors du démarrage de la collecte.';
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

  viewDetails(requestId: number) {
    this.router.navigate(['/collector-request-details', requestId]);
  }
}
