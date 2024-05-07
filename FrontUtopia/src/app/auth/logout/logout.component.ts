import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

import { Location } from '@angular/common';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  message: string;

  constructor(public authService: AuthService, public router: Router, private location: Location) {
    this.message = this.getMessage();
  }

  
  getMessage() {
    return 'Logged out';
  }
  
  logout() {
    this.authService.logout();
    this.message = this.getMessage();
    window.location.reload()
  }

  goBack(): void {
    this.location.back();
  }

}
