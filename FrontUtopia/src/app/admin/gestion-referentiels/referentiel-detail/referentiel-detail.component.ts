import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Referentiel } from 'src/app/gestionApp/interfaces/referentiel';
import { ReferentielsService } from '../referentiels.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-referentiel-detail',
    templateUrl: './referentiel-detail.component.html',
    styleUrls: ['./referentiel-detail.component.css'],
    standalone: false
})
export class ReferentielDetailComponent implements OnInit {
  @Input() referentielId!: string; // ID du référentiel à afficher/modifier
  referentiel?: Referentiel;
  newDonnees: string = '';

  constructor(
    private referentielService: ReferentielsService,
    private route: ActivatedRoute,
    private router: Router,
    private location : Location
  ) {}

  ngOnInit(): void {
    // Charger le référentiel à partir de l'ID passé en paramètre de route ou en entrée
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') || this.referentielId;
      if (id) {
        this.loadReferentiel(id);
      }
    });
  }

  loadReferentiel(id: string): void {
    this.referentielService.getById(id).subscribe((data: Referentiel) => {
      this.referentiel = data;
    });
  }

  addDonnees() {
    if (this.newDonnees.trim()) {
      // Diviser les données en lignes
      const nouvellesDonnees = this.newDonnees.split('\n').map(donnee => donnee.trim()).filter(donnee => donnee.length > 0);
      
      if(!this.referentiel) this.referentiel= {nom:"NouveauReferentiel"}
      if(!this.referentiel.donnees) this.referentiel.donnees= []
      // Ajouter chaque nouvelle donnée au référentiel
      this.referentiel.donnees.push(...nouvellesDonnees);

      // Réinitialiser le champ de texte
      this.newDonnees = '';
    }
  }

  deleteDonnee(index: number): void {
    if (this.referentiel) {
      this.referentiel.donnees?.splice(index, 1);
    }
  }

  updateReferentiel(): void {
    if (this.referentiel) {
      this.referentielService.updateReferentiel(this.referentiel)
        .subscribe(() => {
          this.goBack() 
        });
    }
  }

  cancelEdit(): void {
    this.goBack() 
  }

  goBack(): void {
    this.location.back();
  }
}
