import { Component, OnInit } from '@angular/core';
import { IndexedDbService } from '../../../core/services/indexed-db.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-points',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-points.component.html',
  styleUrls: ['./user-points.component.css'],
})
export class UserPointsComponent implements OnInit {
  convertiblePoints: number = 0;
  vouchers: { points: number; value: string }[] = [
    { points: 100, value: '50 Dh' },
    { points: 200, value: '120 Dh' },
    { points: 500, value: '350 Dh' },
  ];
  selectedVoucher: number | null = null;
  errorMessage: string | null = null;

  constructor(private indexedDbService: IndexedDbService) {}

  async ngOnInit() {
    await this.loadUserPoints();
  }

  async loadUserPoints() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.email) {
      const user = await this.indexedDbService.getUser(currentUser.email);
      if (user) {
        this.convertiblePoints = user.convertiblePoints || 0;
      }
    }
  }

  async convertPoints() {
    if (this.selectedVoucher === null) {
      this.errorMessage = 'Veuillez sélectionner un bon d\'achat.';
      return;
    }

    const selectedVoucher = this.vouchers.find(v => v.points === this.selectedVoucher);
    if (!selectedVoucher) {
      this.errorMessage = 'Bon d\'achat invalide.';
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.email) {
      const user = await this.indexedDbService.getUser(currentUser.email);
      if (user) {
        user.convertiblePoints = user.convertiblePoints || 0;

        if (user.convertiblePoints < selectedVoucher.points) {
          this.errorMessage = 'Vous n\'avez pas assez de points pour ce bon d\'achat.';
          return;
        }

        user.convertiblePoints -= selectedVoucher.points;
        await this.indexedDbService.updateUser(user);
        this.convertiblePoints = user.convertiblePoints;
        alert(`Bon d'achat de ${selectedVoucher.value} attribué avec succès !`);
        this.selectedVoucher = null;
        this.errorMessage = null;
      }
    }
  }
}
