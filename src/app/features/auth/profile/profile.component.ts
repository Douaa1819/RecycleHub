import { UserService } from './../../../core/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: any;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
private userService :UserService ,
   private router: Router
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      birthDate: ['', Validators.required],
      profilePhoto: [null],
    });
  }

  ngOnInit() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
      this.profileForm.patchValue(this.currentUser);
    } else {
      this.router.navigate(['/login']);
    }
  }

  async onSubmit() {
    if (this.profileForm.valid) {
      const updatedUser = { ...this.currentUser, ...this.profileForm.value };

      try {
        await this.userService.updateUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        alert('Informations mises à jour avec succès !');
      } catch (error) {
        console.error('Erreur lors de la mise à jour :', error);
        this.errorMessage = 'Une erreur est survenue lors de la mise à jour.';
      }
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
    }
  }

  deleteAccount() {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      this.userService.deleteUser(this.currentUser.email).subscribe({
        next: () => {
          localStorage.removeItem('currentUser');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du compte :', error);
          this.errorMessage = 'Une erreur est survenue lors de la suppression du compte.';
        }
      });
    }
  }


  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileForm.patchValue({ profilePhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }
}
