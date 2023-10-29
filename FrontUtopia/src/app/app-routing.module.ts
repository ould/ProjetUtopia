import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ComptesComponent } from './comptes/comptes.component';
import { ChatsComponent } from './chats/chats.component';
import { FamillesComponent } from './benficiaires/familles/familles.component';
import { MineursComponent } from './benficiaires/mineurs/mineurs.component';
import { FamilleDetailComponent } from './benficiaires/familles/famille-detail/famille-detail.component';


// path case sensitive
const routes: Routes = [
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'accueil', component: AppComponent },
  { path: 'famille', component: FamillesComponent },
  { path: 'detailFamille/:id', component: FamilleDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
