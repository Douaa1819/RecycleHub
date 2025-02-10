import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IndexedDbService } from '../../../core/services/indexed-db.service';

@Component({
  selector: 'app-collector-request-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './collector-request-details.component.html',
  styleUrls: ['./collector-request-details.component.css'],
})
export class CollectorRequestDetailsComponent implements OnInit {
  request: any = null;
  errorMessage: string | null = null;
  actualWeight: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private indexedDbService: IndexedDbService
  ) {}

  async ngOnInit() {
    const requestId = Number(this.route.snapshot.paramMap.get('id'));
    if (requestId) {
      try {
        this.request = await this.indexedDbService.getCollectRequest(requestId);
      } catch (error) {
        this.errorMessage = 'Erreur lors du chargement de la demande.';
        console.error(error);
      }
    }
  }

  async onValidateCollecte(requestId: number) {
    const request = await this.indexedDbService.getCollectRequest(requestId);

    if (!request) {
      this.errorMessage = 'La demande n\'existe pas.';
      return;
    }

    const weightToUse = this.actualWeight || request.estimatedWeight;

    if (!weightToUse) {
      this.errorMessage = 'Veuillez entrer un poids valide.';
      return;
    }

    if (request.status !== 'En cours' && request.status !== 'Validée') {
      this.errorMessage = 'La demande n\'est pas en cours de collecte.';
      return;
    }

    if (this.actualWeight && this.actualWeight !== request.estimatedWeight) {
      request.estimatedWeight = this.actualWeight;
    }

    const points = this.indexedDbService.calculatePoints(
      Array.isArray(request.wasteTypes) ? request.wasteTypes : [request.wasteTypes],
      request.estimatedWeight,
      weightToUse
    );

    await this.indexedDbService.updateCollectorPoints(request.userId, points);

    try {
      await this.indexedDbService.updateCollectRequest(requestId, {
        actualWeight: this.actualWeight || weightToUse,
        estimatedWeight: request.estimatedWeight,
        points: points,
        status: 'Validée'
      });

      alert('Demande validée avec succès ! Points mis à jour.');
      this.router.navigate(['/collector-dashboard']);
    } catch (error) {
      console.error('Erreur lors de la validation de la demande :', error);
      this.errorMessage = 'Une erreur est survenue lors de la validation.';
    }
  }



  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.request.photos = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  goBack() {
    this.router.navigate(['collector-dashboard']);
  }
}
