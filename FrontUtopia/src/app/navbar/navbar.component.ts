import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { InitialisationService } from '../autres-services/initialisation/initialisation.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public isIntialise :Boolean = true
  public isLoggedIn :boolean = this.AuthService.isLoggedIn()

  initialiseDonnees() {
    this.InitialiseService.initialise().subscribe()
  }
  
  
  ngOnInit() {
    this.InitialiseService.estInitialise().subscribe(
      data => {
        this.isIntialise = data
      }
    )
  }


  constructor(public AuthService: AuthService,
              public InitialiseService : InitialisationService) {}
}
