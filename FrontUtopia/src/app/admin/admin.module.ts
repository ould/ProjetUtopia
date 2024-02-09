import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { ManageComptesComponent } from './manage-comptes/manage-comptes.component';
import { ManageGroupeComponent } from './manage-groupe/manage-groupe.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminComponent,
    ManageComptesComponent,
    ManageGroupeComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
