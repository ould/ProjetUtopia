import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-modifier-mdp',
    templateUrl: './modifier-mdp.component.html',
    styleUrls: ['./modifier-mdp.component.css'],
    standalone: false
})
export class ModifierMdpComponent {
  successMessage?: string;
  errorMessage?: string;
  afficherErreur: boolean = false;
  hash: string;
  newMdpForm: FormGroup;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.hash = this.route.snapshot.params['id'] || '';

    this.newMdpForm = this.fb.group({
      newPassword: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordsMatchValidator.bind(this)
    });

    this.newMdpForm.get('newPassword')?.valueChanges.subscribe(() => {
      if(this.afficherErreur) {
      const newPasswordControl = this.newMdpForm.get('newPassword');
      const errors = newPasswordControl ? newPasswordControl.errors : null;
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
      } else {
      this.errorMessage = undefined;
      }
    }
    });
  }

  private passwordsMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const password = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if(this.errorMessage === undefined && password !== confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
    }
    else if(password === confirmPassword && this.errorMessage === 'Les mots de passe ne correspondent pas.') {
      this.errorMessage = undefined;
    }
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  updatePassword(): void {
    if (this.newMdpForm.invalid) {
      this.afficherErreur = true;
      return;
    }

    const newPassword = this.newMdpForm.get('newPassword')?.value;

    this.authService.accepteReinitialisationMotDePasse(this.hash, newPassword).subscribe({
      next: (response) => {
      if (response === true) {
        alert('Mot de passe réinitialisé avec succès.');
        this.errorMessage = undefined;
        this.router.navigateByUrl('/accueil');
      } else {
        alert('La réinitialisation du mot de passe a échoué.');
      }
      },
      error: (err) => {
      this.errorMessage = 'Une erreur est survenue lors de la réinitialisation du mot de passe.';
      console.error(err);
      }
    });
  }
}
