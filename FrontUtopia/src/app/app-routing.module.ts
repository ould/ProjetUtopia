import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatsComponent } from './chats/chats.component';
import { FamillesComponent } from './beneficiaires/familles/familles.component';
import { MineursComponent } from './beneficiaires/mineurs/mineurs.component';
import { FamilleDetailComponent } from './beneficiaires/familles/famille-detail/famille-detail.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { ReportingComponent } from './reporting/reporting.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './auth/auth.guard';


// path case sensitive
const routes: Routes = [
  {
    path: '', canActivate: [authGuard], children: [
      { path: 'accueil', component: DashboardComponent },
      { path: 'famille', component: FamillesComponent },
      { path: 'detailFamille/:id', component: FamilleDetailComponent },
      { path: 'ajouterFamille', component: FamilleDetailComponent },
      { path: 'chat', component: ChatsComponent },
      { path: 'reporting', component: ReportingComponent },
      { path: 'logout', component: LogoutComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: '**', component: DashboardComponent }
  //TODO faire une page accueil hors authetification
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
