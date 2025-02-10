import { CollectorRequestsComponent } from './features/collector/collector-requests/collector-requests.component';
import { CollectorRequestDetailsComponent } from './features/collector/collector-request-details/collector-request-details.component';
import { LogoutComponent } from './features/auth/logout/logout.component';
import { EditRequestComponent } from './features/particulier/edit-request/edit-request.component';
import { UserRequestsComponent } from './features/particulier/user-requests/user-requests.component';
import { CollectRequestComponent } from './features/particulier/collect-request/collect-request.component';
import { ProfileComponent } from './features/auth/profile/profile.component';
import { CollectorDashboardComponent } from './features/collector/collector-dashboard/collector-dashboard.component';
import { ParticulierDashboardComponent } from './features/particulier/particulier-dashboard/particulier-dashboard.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'collector-request', component: CollectorRequestsComponent },
  { path: 'collect-request', component: CollectRequestComponent },
  { path: 'collect-request-list',component: UserRequestsComponent},
  { path: 'collector-request-details/:id', component: CollectorRequestDetailsComponent },
  { path: 'edit-request/:id', component: EditRequestComponent },


    { path: 'particulier-dashboard', component: ParticulierDashboardComponent},
  { path: 'collector-dashboard', component: CollectorDashboardComponent},


  // {
  //   path: 'dashboard',
  //   component: ParticulierDashboardComponent,
  //   children: [
  //     { path: 'profile', component: ProfileComponent },
  //     { path: 'create-request', component: CollectRequestComponent },
  //     { path: 'my-requests', component: UserRequestsComponent },}
];
