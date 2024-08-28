import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { ManageComptesComponent } from './gestion-comptes/gestion-comptes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfilComponent } from './gestion-profil/profil.component';
import { ProfilDetailComponent } from './gestion-profil/profil-detail/profil-detail.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminComponent,
    ManageComptesComponent,
    ProfilComponent,
    ProfilDetailComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
