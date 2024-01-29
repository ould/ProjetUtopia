import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from './admin.guard';
import { AdminComponent } from './admin/admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageComptesComponent } from './manage-comptes/manage-comptes.component';
import { ManageGroupeComponent } from './manage-groupe/manage-groupe.component';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard], //TODO auth admin
    children: [
      {
        path: '',
        children: [
          { path: 'comptes', component: ManageComptesComponent },
          { path: 'groupes', component: ManageGroupeComponent },
          { path: '', component: AdminDashboardComponent },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule {}
