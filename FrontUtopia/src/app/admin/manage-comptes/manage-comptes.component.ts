import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilisateurService } from 'src/app/autre/utilisateur/utilisateur.service';
import { User } from 'src/app/interfaces/user';
import { PopupComponent } from 'src/app/popup/popup.component';

@Component({
  selector: 'app-manage-comptes',
  templateUrl: './manage-comptes.component.html',
  styleUrls: ['./manage-comptes.component.css']
})
export class ManageComptesComponent implements OnInit {

  utilisateurs: User[] = [];
  nouvelUtilisateur: User = { email: "", nom : "", prenom: "", password:"", groupes: ["Basique"], antenne:"" }; // Initialisez un objet pour le nouvel utilisateur

  ngOnInit(): void {

    this.utilisateurService.getAllUsers().subscribe(
      data => {
        this.utilisateurs = data
      }
    )
  }


  ajouterUtilisateur() {
    // Ajoutez ici la logique pour ajouter un utilisateur à la liste
    if (this.nouvelUtilisateur && this.nouvelUtilisateur.email != "") {
      this.utilisateurs.push(this.nouvelUtilisateur);
      this.nouvelUtilisateur = { email: "", nom : "", prenom: "", password:"", groupes: ["Basique"], antenne:""  }; // Réinitialisez l'objet nouvelUtilisateur après l'ajout
    }
  }

  
  reinitialiseMotDePasse(utilisateur: User): void {
  }


  modifierUtilisateur(utilisateur: User) {


  }

  openPopupSupprimer(utilisateur: User) {
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
          this.utilisateurService.deleteUser(utilisateur._id).subscribe()
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
    private dialog: MatDialog) { }
}
