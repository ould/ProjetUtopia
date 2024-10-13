import { Component, OnInit } from '@angular/core';
import { ErreurService } from 'src/app/autres-services/erreur/erreur.service';

@Component({
  selector: 'app-affichage-erreur',
  templateUrl: './affichage-erreur.component.html',
  styleUrls: ['./affichage-erreur.component.css']
})
export class AffichageErreurComponent implements OnInit {
  messageErreur: string | null = null;

  constructor(private erreurService: ErreurService) {}

  ngOnInit(): void {
    this.erreurService.getErreur().subscribe(message => {
      this.messageErreur = message;
    });
  }

  closeAlert(): void {
    this.erreurService.clearErreur();
  }
}
