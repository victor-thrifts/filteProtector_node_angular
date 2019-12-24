import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { AcclogesComponent }      from './accloges/accloges.component';
import { AcclogDetailComponent }  from './acclog-detail/acclog-detail.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './_guards';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { SettingsComponent } from './settings/settings.component';
import { Registersoftware1Component } from './registersoftware1/registersoftware1.component';
import { LogAllsComponent } from './logAll/logAlls.component';
import { PersonalComponent } from './personal/personal.component';
import { LogAllDetailComponent } from './logAll-detail/logAll-detail.component';
const routes: Routes = [
  { path: '', component: LoginComponent},
  //{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]  },
  { path: 'accloges/:id', component: AcclogDetailComponent, canActivate: [AuthGuard]  },
  { path: 'accloges', component: AcclogesComponent, canActivate: [AuthGuard]  },
  { path: 'login', component: LoginComponent},
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard]  },
  { path: 'users/:id', component: UserDetailComponent, canActivate: [AuthGuard]  },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard]  },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'registersoftware1', component: Registersoftware1Component},
  { path: 'logAlls', component: LogAllsComponent, canActivate: [AuthGuard] },
  { path: 'logAll/:id', component: LogAllDetailComponent, canActivate: [AuthGuard] },
  { path: 'personal', component: PersonalComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
