import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AdminModule } from './admin/admin.module';
import { MatDialogModule } from '@angular/material/dialog';

import { AuthInterceptorService } from './auth-interceptor.service';
import { AppComponent } from './app.component';
import { ComptesComponent } from './comptes/comptes.component';
import { ChatsComponent } from './chats/chats.component';
import { FamillesComponent } from './beneficiaires/familles/familles.component';
import { MineursComponent } from './beneficiaires/mineurs/mineurs.component';
import { FamilleDetailComponent } from './beneficiaires/familles/famille-detail/famille-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PersonneComponent } from './personne/personne.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { ChatDetailComponent } from './chats/chat-detail/chat-detail.component';
import { ReportingComponent } from './reporting/reporting.component';
import { AdminRoutingModule } from './admin/admin-routing.module';
import { RequeteDetailComponent } from './reporting/requete-detail/requete-detail.component';
import { RegisterComponent } from './auth/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PopupComponent } from './popup/popup.component';
import { GroupeComponent } from './groupe/groupe.component';
import { ManageGroupeComponent } from './admin/manage-groupe/manage-groupe.component';

@NgModule({
  declarations: [
    AppComponent,
    ComptesComponent,
    ChatsComponent,
    FamillesComponent,
    MineursComponent,
    FamilleDetailComponent,
    DashboardComponent,
    PersonneComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    ChatDetailComponent,
    ReportingComponent,
    RequeteDetailComponent,
    PopupComponent,
    GroupeComponent,
    ManageGroupeComponent
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
