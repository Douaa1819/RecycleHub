import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IndexedDbService } from '../services/indexed-db.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  isSubmitting = false;
  registerForm: FormGroup;
  cities: string[] = [
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

  constructor(
    private fb: FormBuilder,
    private indexedDbService: IndexedDbService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      birthDate: ['', Validators.required],
      city: ['', Validators.required],
      profilePhoto: [null],
      role: ['particulier'],
    });
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      const user = this.registerForm.value;

      try {
        await this.indexedDbService.addUser(user);
        alert('Inscription réussie !');
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Erreur lors de l’inscription :', error);
        alert('Une erreur est survenue lors de l’inscription.');
      } finally {
        this.isSubmitting = false;
      }
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.registerForm.patchValue({ profilePhoto: reader.result as string });
        this.registerForm.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

}
