import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from './admin.guard';
import { AdminComponent } from './admin/admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageComptesComponent } from './manage-comptes/manage-comptes.component';
import { CompteDetailComponent } from './manage-comptes/compte-detail/compte-detail.component';
import { ProfilComponent } from './profil/profil.component';
import { ProfilDetailComponent } from './profil/profil-detail/profil-detail.component';

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
          { path: 'profil', component: ProfilComponent },
          { path: 'modifierProfil/:id', component: ProfilDetailComponent },
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
