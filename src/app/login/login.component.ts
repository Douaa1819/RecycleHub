import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IndexedDbService } from '../services/indexed-db.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private indexedDbService: IndexedDbService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      try {
        const user = await this.indexedDbService.getUser(email);

        if (user && user.password === password) {
          alert('Connexion réussie !');
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.router.navigate([user.role === 'collector' ? '/collector-dashboard' : '/particulier-dashboard']);
        } else {
          this.errorMessage = 'Email ou mot de passe incorrect.';
        }
      } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        this.errorMessage = 'Une erreur est survenue lors de la connexion.';
      }
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
    }
  }
}
