import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IndexedDbService } from '../../../core/services/indexed-db.service';

@Component({
  selector: 'app-edit-request',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.css'],
})
export class EditRequestComponent implements OnInit {
  editForm: FormGroup;
  requestId: number | null = null;
  errorMessage: string | null = null;
  wasteTypes: string[] = ['Plastique', 'Verre', 'Papier', 'Métal']; // Ajoutez cette ligne

  constructor(
    private fb: FormBuilder,
    private indexedDbService: IndexedDbService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      wasteTypes: ['', Validators.required],
      photos: [null],
      estimatedWeight: ['', [Validators.required, Validators.min(1000)]],
      address: ['', Validators.required],
      date: ['', [Validators.required, this.validateFutureDate]],
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
  async ngOnInit() {
    this.requestId = +this.route.snapshot.paramMap.get('id')!;
    const request = await this.indexedDbService.getCollectRequest(this.requestId);
    console.log('Demande récupérée pour édition:', request);

    if (request) {
      this.editForm.patchValue(request);
    } else {
      this.errorMessage = 'Impossible de charger la demande.';
    }
  }


  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.editForm.patchValue({ photos: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  validateTimeSlot(control: any) {
    const time = control.value;
    if (time < '09:00' || time > '18:00') {
      return { invalidTimeSlot: true };
    }
    return null;
  }

  async onSubmit() {
    if (this.editForm.valid && this.requestId) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userId = currentUser.email;

      const pendingRequests = await this.indexedDbService.getPendingRequests(userId);

      const totalWeight = pendingRequests
        .filter(req => req.id !== this.requestId)
        .reduce((sum, req) => sum + req.estimatedWeight, 0);

      if (totalWeight + this.editForm.value.estimatedWeight > 10000) {
        this.errorMessage = 'Le poids total des collectes ne doit pas dépasser 10 kg.';
        return;
      }

      try {
        await this.indexedDbService.updateCollectRequest(this.requestId, this.editForm.value);
        alert('Demande mise à jour avec succès !');
        this.router.navigate(['/particulier-dashboard']);
      } catch (error) {
        console.error('Erreur lors de la mise à jour :', error);
        this.errorMessage = 'Une erreur est survenue lors de la mise à jour.';
      }
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
    }
  }

}
