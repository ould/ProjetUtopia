import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {

    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required]],
    });

  }


  passwordMatchValidator() {
    const password = this.form?.value?.password;
    const confirmPassword = this.form?.value?.passwordConfirm;
    
    return password == confirmPassword;
  }

  register() {
    const val: User = this.form.value;
    if (val.nom && val.prenom && val.email && val.password && this.passwordMatchValidator()) {
      val.droits = ["0"]
      this.authService.register(val)
        .subscribe(
          result => {
            console.log(result + " is logged in");
            this.router.navigateByUrl('/accueil');
          }
        );
    }
  }


}