import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ComptesComponent } from './comptes/comptes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatsComponent } from './chats/chats.component';
import { FamillesComponent } from './beneficiaires/familles/familles.component';
import { MineursComponent } from './beneficiaires/mineurs/mineurs.component';
import { FamilleDetailComponent } from './beneficiaires/familles/famille-detail/famille-detail.component';
import { LoginComponent } from './auth/login/login.component';
import { AdminComponent } from './admin/admin/admin.component';
import { LogoutComponent } from './auth/logout/logout.component';


// path case sensitive
const routes: Routes = [
  { path: 'accueil', component: DashboardComponent },
  { path: 'famille', component: FamillesComponent },
  { path: 'detailFamille/:id', component: FamilleDetailComponent },
  { path: 'ajouterFamille', component: FamilleDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: '', redirectTo: '/accueil', pathMatch: 'full' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
