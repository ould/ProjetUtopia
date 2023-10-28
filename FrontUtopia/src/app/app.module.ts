import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComptesComponent } from './comptes/comptes.component';
import { ChatsComponent } from './chats/chats.component';
import { FamillesComponent } from './benficiaires/familles/familles.component';
import { MineursComponent } from './benficiaires/mineurs/mineurs.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    ComptesComponent,
    ChatsComponent,
    FamillesComponent,
    MineursComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
