import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ParticulierDashboardComponent} from './particulier-dashboard/particulier-dashboard.component';
import { CollectorDashboardComponent } from './collector-dashboard/collector-dashboard.component';
import { ProfileComponent } from './profile/profile.component';
export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'particulier-dashboard', component: ParticulierDashboardComponent },
  { path: 'collector-dashboard', component: CollectorDashboardComponent },
];
