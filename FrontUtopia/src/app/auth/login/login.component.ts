import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/autres-services/utilisateur/utilisateur';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
          this.authService.login(val)
              .subscribe(
                  () => {
                      window.location.href = '/'+originUrl
                  }
              );
      }
  }

  
}