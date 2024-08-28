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

  profils: Profil[];


  creerProfil(newType: HTMLInputElement) {
    const newProfilName = newType.value.trim();
    if (newProfilName) {
      const newProfil = { nom: newProfilName };

      this.profilService.ajouterProfil(newProfil).subscribe(
        (response) => {
          console.log('Profile created successfully', response);
          this.profils.push(response); // Optionally update the list of profiles
          newType.value = ''; // Clear the input field
        },
        (error) => {
          console.error('Error creating profile', error);
        }
      );
    } else {
      console.warn('Profile name cannot be empty');
    }
  }

  openPopupSuppression(term: string, id: string = '') {
    if (term != "" && id != '') {

      const dialogRef = this.dialog.open(PopupComponent, {
        data: {
          title: 'Supprimer un profil',
          message: 'Etes vous sur de vouloir supprimer le profil ' + term + ' ?',
          buttonYes: 'Oui',
          buttonNo: 'Non'
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          // Action lorsque le bouton "Oui" est cliqué
          this.profilService.delete(id).subscribe(
            data => {
              location.reload()
            })
         
        } else if (result === false) {
          // Action lorsque le bouton "Non" est cliqué
          console.log('Bouton Non cliqué');
        } else {
          // La boîte de dialogue est fermée sans clic sur un bouton
        }
      });
    }

  }

  constructor(
    private profilService: ProfilService,
    private dialog: MatDialog) {
    this.profils = []
  }

}
