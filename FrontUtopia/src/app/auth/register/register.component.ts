import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AntenneService } from 'src/app/autres-services/antenne/antenne.service';
import { Antenne } from 'src/app/interfaces/antenne';
import { Utilisateur } from 'src/app/autres-services/utilisateur/utilisateur';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  newUtilisateurForm: FormGroup;
  antennes: Antenne[] = []

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private antenneService: AntenneService,
    private router: Router) {

    this.newUtilisateurForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required]],
      antennes: ['', [Validators.required]]
    });

  }
  ngOnInit(): void {
    this.antenneService.getAllPublic().subscribe(
      data => {
        this.antennes = data
      }
    )
  }


  passwordMatchValidator() {
    const password = this.newUtilisateurForm?.value?.password;
    const confirmPassword = this.newUtilisateurForm?.value?.passwordConfirm;
    
    return password == confirmPassword;
  }

  register() {
    if (this.newUtilisateurForm.valid && this.passwordMatchValidator()) {
      const newUtilisateur: Utilisateur = this.newUtilisateurForm.value;
      newUtilisateur.antennes = [this.newUtilisateurForm.get('antennes')?.value];
      this.authService.register(newUtilisateur)
        .subscribe(
          result => {
            this.router.navigateByUrl('/accueil');
          }
        );
    }
  }


}