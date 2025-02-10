import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IndexedDbService } from '../../../core/services/indexed-db.service';

@Component({
  selector: 'app-collect-request',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './collect-request.component.html',
  styleUrls: ['./collect-request.component.css'],
})
export class CollectRequestComponent {
  collectRequestForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  city: string[] = [
    'Casablanca',
    'Rabat',
    'Safi',
    'Marrakech',
    'Fès',
    'Tangier',
    'Agadir',
    'Meknès',
    'Oujda',
    'Tétouan',
    'Essaouira'
  ];
  wasteTypes: string[] = ['Plastique', 'Verre', 'Papier', 'Métal'];

  constructor(
    private fb: FormBuilder,
    private indexedDbService: IndexedDbService,
    private router: Router
  ) {
    this.collectRequestForm = this.fb.group({
      wasteTypes: ['', Validators.required],
      photos: [null],
      estimatedWeight: ['', [Validators.required, Validators.min(1000)]],
      address: ['', Validators.required],
      date: ['', [Validators.required, this.validateFutureDate]],
      city: ['', Validators.required],
      timeSlot: ['', [Validators.required, this.validateTimeSlot]],
      notes: [''],
    });
  }

  validateFutureDate(control: any) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return { pastDate: true };
    }
    return null;
  }


  validateTimeSlot(control: any) {
    const time = control.value;
    if (time < '09:00' || time > '18:00') {
      return { invalidTimeSlot: true };
    }
    return null;
  }

  async onSubmit() {
    if (this.collectRequestForm.valid) {
      this.isSubmitting = true;
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userId = currentUser.email;


      const pendingRequests = await this.indexedDbService.getPendingRequests(userId);
      if (pendingRequests.length >= 3) {
        this.errorMessage = 'Vous ne pouvez pas avoir plus de 3 demandes en attente.';
        this.isSubmitting = false;
        return;
      }

      const totalWeight = pendingRequests.reduce((sum, req) => sum + req.estimatedWeight, 0);
      if (totalWeight + this.collectRequestForm.value.estimatedWeight > 10000) {
        this.errorMessage = 'Le poids total des collectes ne doit pas dépasser 10kg.';
        this.isSubmitting = false;
        return;
      }

      const request = {
        userId,
        ...this.collectRequestForm.value,
        status: 'En attente',
      };

      try {
        await this.indexedDbService.addCollectRequest(request);
        alert('Demande de collecte soumise avec succès !');
        this.router.navigate(['/particulier-dashboard']);
      } catch (error) {
        console.error('Erreur lors de la soumission de la demande :', error);
        this.errorMessage = 'Une erreur est survenue lors de la soumission de la demande.';
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.collectRequestForm.patchValue({ photos: reader.result as string });
        this.collectRequestForm.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }
}
