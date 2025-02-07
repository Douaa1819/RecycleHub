import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IndexedDbService } from '../services/indexed-db.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(
    private fb: FormBuilder,
    private indexedDbService: IndexedDbService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      wasteTypes: [[], [Validators.required, Validators.minLength(1)]],
      photos: [null],
      estimatedWeight: ['', [Validators.required, Validators.min(1000)]],
      address: ['', Validators.required],
      date: ['', Validators.required],
      timeSlot: ['', [Validators.required, this.validateTimeSlot]],
      notes: [''],
    });
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
      try {
        await this.indexedDbService.updateCollectRequest(this.requestId, this.editForm.value);
        alert('Demande mise à jour avec succès !');

        //  update la liste après mise à jour
        const updatedRequest = await this.indexedDbService.getCollectRequest(this.requestId);
        console.log('Nouvelle version de la demande:', updatedRequest);

        this.router.navigate(['/user-requests']);
      } catch (error) {
        console.error('Erreur lors de la mise à jour :', error);
        this.errorMessage = 'Une erreur est survenue lors de la mise à jour.';
      }
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
    }
  }

}
