import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  form:FormGroup;

  constructor(private fb:FormBuilder, 
               private authService: AuthService, 
               private router: Router) {

      this.form = this.fb.group({
          email: ['',Validators.required],
          password: ['',Validators.required]
      });
  }

  login() {
      const val :User = this.form.value;

      if (val.email && val.password) {
          this.authService.login(val)
              .subscribe(
                  result => {
                      console.log(result + " is logged in");
                      this.router.navigateByUrl('/');
                  }
              );
      }
  }

  
}