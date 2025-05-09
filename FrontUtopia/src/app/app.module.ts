import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AdminModule } from './admin/admin.module';
import { MatDialogModule } from '@angular/material/dialog';

import { AuthInterceptorService } from './autres-services/auth-interceptor/auth-interceptor.service';
import { AppComponent } from './app.component';
import { ComptesComponent } from './comptes/comptes.component';
import { ChatsComponent } from './chats/chats.component';
import { FamillesComponent } from './beneficiaires/familles/familles.component';
import { MineursComponent } from './beneficiaires/mineurs/mineurs.component';
import { FamilleDetailComponent } from './beneficiaires/familles/famille-detail/famille-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { ChatDetailComponent } from './chats/chat-detail/chat-detail.component';
import { ReportingComponent } from './reporting/reporting.component';
import { AdminRoutingModule } from './admin/admin-routing.module';
import { RequeteDetailComponent } from './reporting/requete-detail/requete-detail.component';
import { RegisterComponent } from './auth/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PopupComponent } from './gestionApp/popup/popup.component';
import { CompteDetailComponent } from './admin/gestion-comptes/compte-detail/compte-detail.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AccueilComponent } from './accueil/accueil.component';
import { MembreComponent } from './beneficiaires/familles/membre/membre.component';
import { CalendrierComponent } from './benevole/calendrier/calendrier.component';
import { ActionSelectionComponent } from './benevole/action-selection/action-selection.component';
import { GestionReferentielsComponent } from './admin/gestion-referentiels/gestion-referentiels.component';
import { ReferentielDetailComponent } from './admin/gestion-referentiels/referentiel-detail/referentiel-detail.component';
import { GestionHistoriqueComponent } from './admin/gestion-historique/gestion-historique.component';
import { GestionLogsComponent } from './admin/gestion-logs/gestion-logs.component';
import { AffichageErreurComponent } from './gestionApp/affichage-erreur/affichage-erreur.component';
import { ModifierMdpComponent } from './auth/modifier-mdp/modifier-mdp.component';
import { MdpOublieComponent } from './auth/modifier-mdp/mdp-oublie/mdp-oublie.component';
import { ConfirmationEmailComponent } from './auth/confirmation-email/confirmation-email.component';

@NgModule({
  declarations: [
    AppComponent,
    ComptesComponent,
    ChatsComponent,
    FamillesComponent,
    MineursComponent,
    FamilleDetailComponent,
    DashboardComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    ChatDetailComponent,
    ReportingComponent,
    RequeteDetailComponent,
    PopupComponent,
    CompteDetailComponent,
    NavbarComponent,
    AccueilComponent,
    MembreComponent,
    CalendrierComponent,
    ActionSelectionComponent,
    GestionReferentielsComponent,
    ReferentielDetailComponent,
    GestionHistoriqueComponent,
    GestionLogsComponent,
    AffichageErreurComponent,
    ModifierMdpComponent,
    MdpOublieComponent,
    ConfirmationEmailComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AdminModule,
    HttpClientModule,
    AdminRoutingModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule
    
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
