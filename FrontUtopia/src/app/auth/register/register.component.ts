import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  form:FormGroup;

  constructor(private fb:FormBuilder, 
               private authService: AuthService, 
               private router: Router) {

      this.form = this.fb.group({
          email: ['',Validators.required],
          password: ['',Validators.required],
          passwordConfirm: ['',Validators.required]
      });
  }

  register() {
      const val :User = this.form.value;

      if (val.email && val.password && this.form.value.passwordConfirm == this.form.value.password) {
        val.droits = ["0"]
          this.authService.register(val)
              .subscribe(
                  result => {
                      console.log(result + " is logged in");
                      this.router.navigateByUrl('/');
                  }
              );
      }
  }

  
}