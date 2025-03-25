import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AntenneService } from 'src/app/autres-services/antenne/antenne.service';
import { Utilisateur } from 'src/app/autres-services/utilisateur/utilisateur';
import { UtilisateurService } from 'src/app/autres-services/utilisateur/utilisateur.service';
import { Antenne } from 'src/app/gestionApp/interfaces/antenne';
import { PopupComponent } from 'src/app/gestionApp/popup/popup.component';

@Component({
  selector: 'app-gestion-comptes',
  templateUrl: './gestion-comptes.component.html',
  styleUrls: ['./gestion-comptes.component.css']
})
export class ManageComptesComponent implements OnInit {

  utilisateurs: Utilisateur[] = [];
  nouvelUtilisateur?:Utilisateur
  Antennes: Antenne[] = []
  isPanelOpen = false; // Initialise le panneau comme fermé

  ngOnInit(): void {

    this.utilisateurService.getAll().subscribe(
      data => {
        this.utilisateurs = data
      }
    )

    this.antenneService.getAll().subscribe(
      data => {
        this.Antennes = data
      }
    )
  }

  newUtilisateurForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    nom: ['', [Validators.required]],
    prenom: ['', [Validators.required]],
    antennes: ['', [Validators.required]],
    password:['', [Validators.required, Validators.minLength(5)]]
  })

  ajouterUtilisateur() {
    // Ajoutez ici la logique pour ajouter un utilisateur à la liste
    if (this.newUtilisateurForm.valid) {
      const newUtilisateur: Utilisateur = this.newUtilisateurForm.value;
      newUtilisateur.antennes = [this.newUtilisateurForm.get('antennes')?.value]
      newUtilisateur.antenneDefautId = newUtilisateur.antennes[0]
      this.utilisateurService.addUtilisateur(newUtilisateur).subscribe()
      this.utilisateurs.push(newUtilisateur);
      }
  }


  reinitialiseMotDePasse(utilisateur: Utilisateur) {
    if(utilisateur._id === undefined) {
      return false;
    }
    this.utilisateurService.demandeReinitialiseMotDePasseByEmail(utilisateur.email).subscribe();
    //TODO : Afficher un message de confirmation
  return true;
  }


  openPopupSupprimer(utilisateur: Utilisateur) {
    const dialogRef = this.dialog.open(PopupComponent, {
      data: {
        title: 'Ajouter un rôle/groupe',
        message: 'Etes vous sur de vouloir créer l\'utilisateur avec l\'email ' + utilisateur.email + ' ?',
        buttonYes: 'Oui',
        buttonNo: 'Non'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // Action lorsque le bouton "Oui" est cliqué
        if (utilisateur._id)
          this.utilisateurService.deleteUtilisateur(utilisateur._id).subscribe()
        location.reload()
      } else if (result === false) {
        // Action lorsque le bouton "Non" est cliqué
        console.log('Bouton Non cliqué');
      } else {
        // La boîte de dialogue est fermée sans clic sur un bouton
        console.log('Boîte de dialogue fermée');
      }
    });

  }

  constructor(
    private utilisateurService: UtilisateurService,
    private antenneService: AntenneService,
    private dialog: MatDialog,
    private fb: FormBuilder) { }
}
