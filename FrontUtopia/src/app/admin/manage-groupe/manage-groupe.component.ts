import { Component, OnInit } from '@angular/core';
import { GroupeService } from 'src/app/autres-services/groupe/groupe.service';
import { Groupe } from 'src/app/interfaces/groupe';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from 'src/app/popup/popup.component';

@Component({
  selector: 'app-manage-groupe',
  templateUrl: './manage-groupe.component.html',
  styleUrls: ['./manage-groupe.component.css']
})
export class ManageGroupeComponent implements OnInit {



  ngOnInit(): void {

    this.groupeService.getAllGroupes().subscribe(
      data => {
        this.groupes = data
      }
    )
  }

  groupes?: Groupe[];
  groupeEnCours: any = {};

  saveGroupe() {
    // Logique pour enregistrer le rôle (ajout ou modification)
    if (this.groupeEnCours.id) {
      // Modification d'un rôle existant
      // Ajoutez la logique nécessaire ici
    } else {
      // Ajout d'un nouveau rôle
      this.groupeService.addGroupe(this.groupeEnCours.nom)
    }
  }

  openPopupCreation(term: string) {
    if (term != "") {

      const dialogRef = this.dialog.open(PopupComponent, {
        data: {
          title: 'Ajouter un rôle/groupe',
          message: 'Etes vous sur de vouloir créer le groupe ' + term + ' ?',
          buttonYes: 'Oui',
          buttonNo: 'Non'
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          // Action lorsque le bouton "Oui" est cliqué

          this.groupeService.addGroupe(term).subscribe()
        } else if (result === false) {
          // Action lorsque le bouton "Non" est cliqué
          console.log('Bouton Non cliqué');
        } else {
          // La boîte de dialogue est fermée sans clic sur un bouton
          console.log('Boîte de dialogue fermée');
        }
      });
    }
  }

  openPopupModifier(term: string, id:string = '')  {
    if (term != "") {

      //TODO
      const dialogRef = this.dialog.open(PopupComponent, {
        data: {
          title: 'Modifier un rôle/groupe',
          message: 'Etes vous sur de vouloir modifier le groupe ' + term + ' ?',
          buttonYes: 'Oui',
          buttonNo: 'Non'
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          // Action lorsque le bouton "Oui" est cliqué
          this.groupeService.updateGroupe(term, term).subscribe()

        } else if (result === false) {
          // Action lorsque le bouton "Non" est cliqué
          console.log('Bouton Non cliqué');
        } else {
          // La boîte de dialogue est fermée sans clic sur un bouton
          console.log('Boîte de dialogue fermée');
        }
      });
    }
  }

  openPopupSuppression(term: string) {
    if (term != "") {

      const dialogRef = this.dialog.open(PopupComponent, {
        data: {
          title: 'Supprimer un rôle/groupe',
          message: 'Etes vous sur de vouloir supprimer le groupe ' + term + ' ?',
          buttonYes: 'Oui',
          buttonNo: 'Non'
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          // Action lorsque le bouton "Oui" est cliqué

          this.groupeService.deleteGroupe(term).subscribe()
        } else if (result === false) {
          // Action lorsque le bouton "Non" est cliqué
          console.log('Bouton Non cliqué');
        } else {
          // La boîte de dialogue est fermée sans clic sur un bouton
          console.log('Boîte de dialogue fermée');
        }
      });
    }
  }


  constructor(
    private groupeService: GroupeService,
    private dialog: MatDialog) { }


}
