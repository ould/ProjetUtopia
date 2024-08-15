import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UtilisateurService } from '../autres-services/utilisateur/utilisateur.service';
import { Antenne } from '../interfaces/antenne';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

   antenneDefautForm: FormGroup;
  public activeTab: String = ''
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

  public antenneActuelle = ""


  collapseNavbar() {
    const navbar = document.getElementById('navbarNavDropdown');
    if (navbar && navbar.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }

  switchActive(term: String) {
    this.activeTab = term
    this.collapseNavbar();
  }

  changeAntenneDefaut(idNouvelleAntenne: any) {
    if(idNouvelleAntenne)  this.utilisateurService.changeAntenneDefaut(idNouvelleAntenne).subscribe(
      data => {
        this.antenneActuelle = data.nom
      });
  }


  ngOnInit() {
    if (this.isLoggedIn) {

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
      this.utilisateurService.getAntennes().subscribe(
        data => {
          this.antennesUser = data;
          this.userMultipleAntennes = this.antennesUser.length > 1;
          this.utilisateurService.getAntenneDefaut().subscribe(
            data => {
              this.antenneDefautForm.setValue({
                antenneDefaut: data._id
              })
              this.antenneActuelle = data.nom
            }
          );
        }
      );
      
    }
  }


  constructor(public AuthService: AuthService,
    public utilisateurService: UtilisateurService,
    private fb: FormBuilder) { 

      this.antenneDefautForm = this.fb.group({
        antenneDefaut: ['', Validators.required]
      });


    }
}
