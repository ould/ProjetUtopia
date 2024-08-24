import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { ManageComptesComponent } from './manage-comptes/manage-comptes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfilComponent } from './profil/profil.component';
import { ProfilDetailComponent } from './profil/profil-detail/profil-detail.component';


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
