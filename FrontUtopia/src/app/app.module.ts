import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ComptesComponent } from './comptes/comptes.component';
import { ChatsComponent } from './chats/chats.component';
import { FamillesComponent } from './benficiaires/familles/familles.component';
import { MineursComponent } from './benficiaires/mineurs/mineurs.component';
import { FamilleDetailComponent } from './benficiaires/familles/famille-detail/famille-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    ComptesComponent,
    ChatsComponent,
    FamillesComponent,
    MineursComponent,
    FamilleDetailComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
