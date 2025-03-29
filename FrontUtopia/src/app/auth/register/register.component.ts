import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AntenneService } from 'src/app/autres-services/antenne/antenne.service';
import { Antenne } from 'src/app/gestionApp/interfaces/antenne';
import { Utilisateur } from 'src/app/autres-services/utilisateur/utilisateur';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  newUtilisateurForm: FormGroup;
  antennes: Antenne[] = [];
  successMessage?: string;
  errorMessage?: string;
  afficherErreur: boolean = false;

  ngOnInit(): void {
    this.antenneService.getAllPublic().subscribe({
      next: (data) => {
        this.antennes = data;
      }
    });

    this.newUtilisateurForm.get('password')?.valueChanges.subscribe(() => {
      this.updateErrorMessage();
    });

    this.newUtilisateurForm.get('passwordConfirm')?.valueChanges.subscribe(() => {
      this.updateErrorMessage();
    });
  }

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private antenneService: AntenneService,
    private router: Router) {

    this.newUtilisateurForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      prenom: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)]],
      passwordConfirm: ['', [Validators.required]],
      antenneDefautId: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('passwordConfirm')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  updateErrorMessage() {
    const passwordControl = this.newUtilisateurForm.get('password');
    const errors = passwordControl ? passwordControl.errors : null;

    if (errors) {
      if (errors['required']) {
        this.errorMessage = 'Le mot de passe est requis.';
      } else if (errors['minlength']) {
        this.errorMessage = 'Le mot de passe doit contenir au moins 8 caractères.';
      } else if (errors['pattern']) {
        this.errorMessage = 'Le mot de passe doit contenir au moins une lettre, un chiffre et un caractère spécial.';
      } else {
        this.errorMessage = undefined;
      }
    } else if (this.newUtilisateurForm.hasError('passwordMismatch')) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
    } else {
      this.errorMessage = undefined;
    }
  }

  register() {
    if (this.newUtilisateurForm.valid) {
      const newUtilisateur: Utilisateur = this.newUtilisateurForm.value;
      newUtilisateur.antennes = [this.newUtilisateurForm.get('antenneDefautId')?.value];
      this.authService.register(newUtilisateur)
        .subscribe({
          next: (response) => {
            if(response) {
              this.router.navigateByUrl('/accueil');
            }
          },
          error: () => {
            this.errorMessage = 'Une erreur est survenue lors de l’enregistrement.';
          }
        });
    }
  }
}