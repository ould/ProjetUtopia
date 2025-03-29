import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UtilisateurService } from '../autres-services/utilisateur/utilisateur.service';
import { Antenne } from '../gestionApp/interfaces/antenne';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Section } from '../gestionApp/interfaces/section';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  section = Section
  antenneDefautForm: FormGroup;
  public activeTab: String = ''
  public isLoggedIn: boolean = this.AuthService.isLoggedIn()
  public utilisateurMultipleAntennes: Boolean = false
  public antennesUtilisateur: Antenne[] = []

  public aAccesAdmin: Boolean = false;
  public aAccesFamille: Boolean = false;
  public aAccesMineur: Boolean = false;
  public aAccesHebergeuse: Boolean = false;
  public aAccesAstreinte: Boolean = false;
  public aAccesBenevole: Boolean = false;
  public aAccesAdherent: Boolean = false;
  public aAccesHommeSeul: Boolean = false;
  public aAccesReporting: Boolean = false;
  public aAccesStock: Boolean = false;
  public aAccesChat: Boolean = false;

  public antenneActuelle = ""


  collapseNavbar() {
    const navbar = document.getElementById('navbarNavDropdown');
    if (navbar && navbar.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }

  switchActive(term: string) {
    this.activeTab = term
    this.utilisateurService.getDroits(term).subscribe();
    this.collapseNavbar();
  }

  changeAntenneDefaut(idNouvelleAntenne: any) {
    if (idNouvelleAntenne) this.utilisateurService.changeAntenneDefaut(idNouvelleAntenne).subscribe(
      data => {
        this.antenneActuelle = data.nom
      });
    location.reload()
  }


  ngOnInit() {
    if (this.isLoggedIn) {

      //TODO : sortir les string en const globales
      this.utilisateurService.accesSection(Section.admin).subscribe(
        data => {
          this.aAccesAdmin = data
        });
      this.utilisateurService.accesSection(Section.famille).subscribe(
        data => {
          this.aAccesFamille = data
        });
      this.utilisateurService.accesSection(Section.mineur).subscribe(
        data => {
          this.aAccesMineur = data
        });
      this.utilisateurService.accesSection(Section.hebergeuse).subscribe(
        data => {
          this.aAccesHebergeuse = data
        });
      this.utilisateurService.accesSection(Section.astreinte).subscribe(
        data => {
          this.aAccesAstreinte = data
        });
      this.utilisateurService.accesSection(Section.benevole).subscribe(
        data => {
          this.aAccesBenevole = data
        });
      this.utilisateurService.accesSection(Section.adherente).subscribe(
        data => {
          this.aAccesAdherent = data
        });
      this.utilisateurService.accesSection(Section.hommeSeul).subscribe(
        data => {
          this.aAccesHommeSeul = data
        });
      this.utilisateurService.accesSection(Section.reporting).subscribe(
        data => {
          this.aAccesReporting = data
        });
      this.utilisateurService.accesSection(Section.stock).subscribe(
        data => {
          this.aAccesStock = data
        });
      this.utilisateurService.accesSection(Section.chat).subscribe(
        data => {
          this.aAccesChat = data
        });
        this.utilisateurService.getAntennes().subscribe(
          data => {
          this.antennesUtilisateur = data;
          this.utilisateurMultipleAntennes = this.antennesUtilisateur.length > 1;
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
