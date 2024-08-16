import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import { AntenneService } from 'src/app/autres-services/antenne/antenne.service';
import { Antenne } from 'src/app/interfaces/antenne';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  newUserForm: FormGroup;
  antennes: Antenne[] = []

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private antenneService: AntenneService,
    private router: Router) {

    this.newUserForm = this.fb.group({
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
    const password = this.newUserForm?.value?.password;
    const confirmPassword = this.newUserForm?.value?.passwordConfirm;
    
    return password == confirmPassword;
  }

  register() {
    if (this.newUserForm.valid && this.passwordMatchValidator()) {
      const newUser: User = this.newUserForm.value;
      newUser.groupes = ["0"];
      newUser.antennes = [this.newUserForm.get('antennes')?.value];
      this.authService.register(newUser)
        .subscribe(
          result => {
            this.router.navigateByUrl('/accueil');
          }
        );
    }
  }


}