import { UserService } from './../../../core/services/user.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
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
      this.isSubmitting = true;
      this.errorMessage = null;

      const { email, password } = this.loginForm.value;

      try {
        const user = await this.userService.getUser(email);

        if (user && user.password === password) {
          localStorage.setItem('currentUser', JSON.stringify(user));

          const redirectUrl = user.role === 'collector' ? '/collector-dashboard' : '/particulier-dashboard';
          this.router.navigate([redirectUrl]);
        } else {
          this.errorMessage = 'Email ou mot de passe incorrect.';
        }
      } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        this.errorMessage = 'Une erreur est survenue lors de la connexion.';
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
    }
  }
}
