import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { InitialisationService } from '../autres-services/initialisation/initialisation.service';
import { UtilisateurService } from '../autres-services/utilisateur/utilisateur.service';
import { Antenne } from '../interfaces/antenne';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  public activeTab: String = ''
  public isInitialise: Boolean = true
  public isLoggedIn: boolean = this.AuthService.isLoggedIn()
  public userMultipleAntennes: Boolean = false
  public antennesUser: Antenne[] = []

  public isGroupeAdmin: Boolean = false;
  public isGroupeFamille: Boolean = false;
  public isGroupeMineur: Boolean = false;
  public isGroupeHebergeuse: Boolean = false;
  public isGroupeAstreinte: Boolean = false;
  public isGroupeBenevole: Boolean = false;
  public isGroupeAdherent: Boolean = false;
  public isGroupeHommeSeul: Boolean = false;
  public isGroupeRapports: Boolean = false;
  public isGroupeStock: Boolean = false;
  public isGroupeChat: Boolean = false;

  initialiseDonnees() {
    this.InitialiseService.initialise().subscribe()
  }

  getUserAntennes() {
    this.utilisateurService.getAntennes().subscribe(
      data => {
        //this.antennesUser = data
        //this.userMultipleAntennes = this.antennesUser.length > 1;
      }
    );
  }

  collapseNavbar() {
    const navbar = document.getElementById('navbarNavDropdown');
    if (navbar && navbar.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }

  switchActive(term : String) {
    this.activeTab = term
    this.collapseNavbar();
  }



  ngOnInit() {
    this.InitialiseService.estInitialise().subscribe(
      data => {
        this.isInitialise = data
      }
    );
    //TODO : sortir les string en const globales
    this.utilisateurService.isGroup("Admin").subscribe(
      data => {
        this.isGroupeAdmin = data
      });
    this.utilisateurService.isGroup("Famille").subscribe(
      data => {
        this.isGroupeFamille = data
      });
    this.utilisateurService.isGroup("Mineur").subscribe(
      data => {
        this.isGroupeMineur = data
      });
    this.utilisateurService.isGroup("Hebergeuse").subscribe(
      data => {
        this.isGroupeHebergeuse = data
      });
    this.utilisateurService.isGroup("Astreinte").subscribe(
      data => {
        this.isGroupeAstreinte = data
      });
    this.utilisateurService.isGroup("Benevole").subscribe(
      data => {
        this.isGroupeBenevole = data
      });
    this.utilisateurService.isGroup("Adherent").subscribe(
      data => {
        this.isGroupeAdherent = data
      });
    this.utilisateurService.isGroup("HommeSeul").subscribe(
      data => {
        this.isGroupeHommeSeul = data
      });
    this.utilisateurService.isGroup("Rapports").subscribe(
      data => {
        this.isGroupeRapports = data
      });
    this.utilisateurService.isGroup("Stock").subscribe(
      data => {
        this.isGroupeStock = data
      });
    this.utilisateurService.isGroup("Chat").subscribe(
      data => {
        this.isGroupeChat = data
      });
      this.getUserAntennes();
    
  }


  constructor(public AuthService: AuthService,
    public InitialiseService: InitialisationService,
    public utilisateurService: UtilisateurService) { }
}
