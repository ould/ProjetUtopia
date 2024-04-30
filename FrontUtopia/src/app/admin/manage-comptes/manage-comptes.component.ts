import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AntenneService } from 'src/app/autres-services/antenne/antenne.service';
import { UtilisateurService } from 'src/app/autres-services/utilisateur/utilisateur.service';
import { Antenne } from 'src/app/interfaces/antenne';
import { User } from 'src/app/interfaces/user';
import { PopupComponent } from 'src/app/popup/popup.component';

@Component({
  selector: 'app-manage-comptes',
  templateUrl: './manage-comptes.component.html',
  styleUrls: ['./manage-comptes.component.css']
})
export class ManageComptesComponent implements OnInit {

  utilisateurs: User[] = [];
  nouvelUtilisateur?:User
  Antennes: Antenne[] = []


  ngOnInit(): void {

    this.utilisateurService.getAllUsers().subscribe(
      data => {
        this.utilisateurs = data
      }
    )

    this.antenneService.getAllAntennes().subscribe(
      data => {
        this.Antennes = data
      }
    )
  }


  registrationForm = this.fb.group({
    email: ['', [Validators.required]],
    nom: ['', [Validators.required]],
    prenom: ['', [Validators.required]],
    antenne: ['', [Validators.required]]
  })

  ajouterUtilisateur() {
    // Ajoutez ici la logique pour ajouter un utilisateur à la liste
    this.nouvelUtilisateur = { email: "", nom: "", prenom: "", password: "", groupes: ["0"], antenne: ["0"] }; // Réinitialisez l'objet nouvelUtilisateur après l'ajout
      

    //this.utilisateurs.push(this.nouvelUtilisateur);

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
    private antenneService: AntenneService,
    private dialog: MatDialog,
    private fb: FormBuilder) { }
}
