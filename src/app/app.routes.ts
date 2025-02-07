import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ParticulierDashboardComponent} from './particulier-dashboard/particulier-dashboard.component';
import { CollectorDashboardComponent } from './collector-dashboard/collector-dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { CollectRequestComponent } from './collect-request/collect-request.component';
import { UserRequestsComponent } from './user-requests/user-requests.component';
import { EditRequestComponent } from './edit-request/edit-request.component';
export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'collect-request', component: CollectRequestComponent },
  { path: 'collect-request-list',component: UserRequestsComponent},
  { path: 'edit-request/:id', component: EditRequestComponent },
    { path: 'particulier-dashboard', component: ParticulierDashboardComponent},
  { path: 'collector-dashboard', component: CollectorDashboardComponent},
];
