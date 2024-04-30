import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilisateurService } from 'src/app/autres-services/utilisateur/utilisateur.service';
import { User } from 'src/app/interfaces/user';
import { Location } from '@angular/common';

@Component({
  selector: 'app-compte-detail',
  templateUrl: './compte-detail.component.html',
  styleUrls: ['./compte-detail.component.css']
})
export class CompteDetailComponent implements OnInit {
  @Input() utilisateur!: User;

  constructor( private utilisateurService: UtilisateurService,
    private route: ActivatedRoute,
    private location: Location) { }

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.utilisateurService.getUser(id)
      .subscribe(user => {
        this.utilisateur = user;
  })}

  modifierUtilisateur(): void {
    // Mettez à jour les détails de l'utilisateur à l'aide de votre service utilisateur
    this.utilisateurService.updateUser(this.utilisateur); // Implémentez cette méthode dans votre service utilisateur
  }

  goBack(): void {
    this.location.back();
  }
}
