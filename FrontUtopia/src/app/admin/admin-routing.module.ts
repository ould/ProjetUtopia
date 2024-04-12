import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from './admin.guard';
import { AdminComponent } from './admin/admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageComptesComponent } from './manage-comptes/manage-comptes.component';
import { ManageGroupeComponent } from './manage-groupe/manage-groupe.component';
import { ManagePersonneTypeComponent } from './manage-personne-type/manage-personne-type.component';
import { CompteDetailComponent } from './manage-comptes/compte-detail/compte-detail.component';

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
          { path: 'modifierUtilisateur/:id', component: CompteDetailComponent },
          { path: 'groupes', component: ManageGroupeComponent },
          { path: 'personneType', component: ManagePersonneTypeComponent },
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
