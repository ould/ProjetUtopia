import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
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
    password:['', [Validators.required, Validators.minLength(8),Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)]]
  })

  ajouterUtilisateur() {
    // Ajoutez ici la logique pour ajouter un utilisateur à la liste
    if (this.newUtilisateurForm.valid) {
      const newUtilisateur: Utilisateur = this.newUtilisateurForm.value;
      newUtilisateur.antennes = [this.newUtilisateurForm.get('antennes')?.value]
      newUtilisateur.antenneDefautId = newUtilisateur.antennes[0]
      this.utilisateurService.addUtilisateur(newUtilisateur).subscribe(
        (response) => {
          this.utilisateurs.push(newUtilisateur);
          alert('Utilisateur ajouté avec succès !');
          location.reload();
        },
        (error) => {
          alert('Erreur lors de l\'ajout de l\'utilisateur');
        }
      )
      }
  }


  reinitialiseMotDePasse(utilisateur: Utilisateur) {
    if(utilisateur._id === undefined) {
      return false;
    }
    this.authService.demandeReinitialiseMotDePasseByEmail(utilisateur.email).subscribe();
    alert('Un email de réinitialisation a été envoyé à ' + utilisateur.email);
  return true;
  }


  openPopupSupprimer(utilisateur: Utilisateur) {
    const dialogRef = this.dialog.open(PopupComponent, {
      data: {
        title: 'Supprimer un utilisateur',
        message: 'Etes vous sur de vouloir supprimer l\'utilisateur avec l\'email ' + utilisateur.email + ' ?',
        buttonYes: 'Oui',
        buttonNo: 'Non'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // Action lorsque le bouton "Oui" est cliqué
        if (utilisateur._id)
          this.utilisateurService.deleteUtilisateur(utilisateur._id).subscribe(
            () => {
              location.reload()
            }
          );
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
    private authService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder) { }
}
