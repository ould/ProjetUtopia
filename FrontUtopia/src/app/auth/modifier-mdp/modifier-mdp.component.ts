import { Component } from '@angular/core';
import { UtilisateurService } from 'src/app/autres-services/utilisateur/utilisateur.service';

@Component({
  selector: 'app-modifier-mdp',
  templateUrl: './modifier-mdp.component.html',
  styleUrls: ['./modifier-mdp.component.css']
})
export class ModifierMdpComponent {
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  hash = '';

  constructor(private utilisateurService: UtilisateurService) {
    const url = new URL(window.location.href);
    this.hash = url.searchParams.get('hash') || '';
  }

  updatePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    this.utilisateurService.accepteReinitialisationMotDePasse(this.hash, this.newPassword).subscribe(
      (response) => {
        this.successMessage = "Mot de passe réinitialisé avec succès.";
      }
    );
  }
}
