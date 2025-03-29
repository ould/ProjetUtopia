import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/autres-services/utilisateur/utilisateur';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent {
  
  form:FormGroup;

  constructor(private fb:FormBuilder, 
               private authService: AuthService, 
               private route: ActivatedRoute) {

      this.form = this.fb.group({
          email: ['',Validators.required],
          password: ['',Validators.required]
      });
  }

  login() {
      const val :Utilisateur = this.form.value;

      if (val.email && val.password) {
        let originUrl:string = this.route.snapshot.queryParams['originUrl']
        if (originUrl?.length < 1 || originUrl?.includes("logout") ) {
            originUrl = "accueil"
        }
          this.authService.login(val).subscribe({
            next: (result) => {
              // Redirection uniquement en cas de succès
             if(result) window.location.href = '/' + originUrl;
            },
            error: (err) => {
              // Gérer l'erreur ici, par exemple afficher un message d'erreur
              console.error('Erreur lors de la connexion :', err);
            }
          });
          
      }
  }
}