import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from './admin.guard';
import { AdminComponent } from './admin/admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageComptesComponent } from './gestion-comptes/gestion-comptes.component';
import { CompteDetailComponent } from './gestion-comptes/compte-detail/compte-detail.component';
import { ProfilComponent } from './gestion-profil/profil.component';
import { ProfilDetailComponent } from './gestion-profil/profil-detail/profil-detail.component';
import { GestionReferentielsComponent } from './gestion-referentiels/gestion-referentiels.component';
import { ReferentielDetailComponent } from './gestion-referentiels/referentiel-detail/referentiel-detail.component';
import { GestionHistoriqueComponent } from './gestion-historique/gestion-historique.component';
import { GestionLogsComponent } from './gestion-logs/gestion-logs.component';

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
          { path: 'referentiel', component: GestionReferentielsComponent },
          { path: 'referentiel/:id', component: ReferentielDetailComponent },
          { path: 'historique', component: GestionHistoriqueComponent },
          { path: 'log', component: GestionLogsComponent },
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
export class AdminRoutingModule { }
