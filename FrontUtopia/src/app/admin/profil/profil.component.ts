import { Component, OnInit } from '@angular/core';
import { Profil } from './profil';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from 'src/app/popup/popup.component';
import { ProfilService } from './profil.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  ngOnInit(): void {    
    this.profilService.getAll().subscribe(
      data => {
        this.profils = data
      }
    )
  }
  
profils?: Profil[];

ModifierProfil(arg0: any) {
throw new Error('Method not implemented.');
}
ouvrirPageCreation() {
throw new Error('Method not implemented.');
}

openPopupSuppression(term: string, id:string = '') {
  if (term != "" && id != '') {

    const dialogRef = this.dialog.open(PopupComponent, {
      data: {
        title: 'Supprimer un type',
        message: 'Etes vous sur de vouloir supprimer le profil ' + term + ' ?',
        buttonYes: 'Oui',
        buttonNo: 'Non'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // Action lorsque le bouton "Oui" est cliqué
        //this.TypePersonneService.deleteType(id).subscribe()
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
  private profilService:ProfilService,
  private dialog: MatDialog) { }

}
