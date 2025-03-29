import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-mdp-oublie',
    templateUrl: './mdp-oublie.component.html',
    styleUrls: ['./mdp-oublie.component.css'],
    standalone: false
})
export class MdpOublieComponent {
  email: string = '';

  changeMdp() {
    if (this.email) {
      this.authService.demandeReinitialiseMotDePasseByEmail(this.email).subscribe({next: (response) => {
        if (response === true) {
          alert('Vous devriez recevoir un mail contenant les instructions à suivre.');
          this.router.navigateByUrl('/accueil');
        } else {
          alert('La réinitialisation du mot de passe a échoué.');
        }
        },
        error: (err) => {
        alert('Une erreur est survenue lors de la réinitialisation du mot de passe.');
        console.error(err);
        }
      });
    }
  }

  constructor(
      private authService: AuthService,
    private router: Router)
  {}
}
