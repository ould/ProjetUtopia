import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TypePersonneService } from 'src/app/autre/typePersonne/type.service';
import { PopupComponent } from 'src/app/popup/popup.component';
import { Type } from 'src/app/interfaces/type';

@Component({
  selector: 'app-manage-personne-type',
  templateUrl: './manage-personne-type.component.html',
  styleUrls: ['./manage-personne-type.component.css']
})
export class ManagePersonneTypeComponent  implements OnInit  {

  
  ngOnInit(): void {

    this.TypePersonneService.getAllType().subscribe(
      data => {
        this.types = data
      }
    )
  }

  types?: Type[];

  modifierRole(typeId?: string) {
  }

  openPopupCreation(term: string) {
    if (term != "") {

      const dialogRef = this.dialog.open(PopupComponent, {
        data: {
          title: 'Ajouter/Modifier un type',
          message: 'Etes vous sur de vouloir créer le type ' + term + ' ?',
          buttonYes: 'Oui',
          buttonNo: 'Non'
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          // Action lorsque le bouton "Oui" est cliqué
          this.TypePersonneService.addType(term).subscribe()
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


  openPopupSuppression(term: string, id:string = '') {
    if (term != "" && id != '') {

      const dialogRef = this.dialog.open(PopupComponent, {
        data: {
          title: 'Supprimer un type',
          message: 'Etes vous sur de vouloir supprimer le type ' + term + ' ?',
          buttonYes: 'Oui',
          buttonNo: 'Non'
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          // Action lorsque le bouton "Oui" est cliqué
          this.TypePersonneService.deleteType(id).subscribe()
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
    private TypePersonneService: TypePersonneService ,
    private dialog: MatDialog) { }
}
