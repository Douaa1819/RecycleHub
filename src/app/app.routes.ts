import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ParticulierDashboardComponent} from './particulier-dashboard/particulier-dashboard.component';
import { CollectorDashboardComponent } from './collector-dashboard/collector-dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { CollectRequestComponent } from './collect-request/collect-request.component';
import { UserRequestsComponent } from './user-requests/user-requests.component';
import { EditRequestComponent } from './edit-request/edit-request.component';
import { LogoutComponent } from './logout/logout.component';
import { CollectorRequestsComponent } from './collector-requests/collector-requests.component';
import { CollectorRequestDetailsComponent } from './collector-request-details/collector-request-details.component';
export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'collector-request', component: CollectorRequestsComponent },
  { path: 'collect-request', component: CollectRequestComponent },
  { path: 'collect-request-list',component: UserRequestsComponent},
  { path: 'collector-request-details/:id', component: CollectorRequestDetailsComponent },
  { path: 'edit-request/:id', component: EditRequestComponent },
    { path: 'particulier-dashboard', component: ParticulierDashboardComponent},
  { path: 'collector-dashboard', component: CollectorDashboardComponent},
];
