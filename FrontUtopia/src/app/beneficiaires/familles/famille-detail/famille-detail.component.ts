import { Component, Input } from '@angular/core';
import { Famille } from '../../../interfaces/famille';
import { Personne } from 'src/app/interfaces/Personne';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FamilleService } from '../famille.service';
import { PersonneService } from 'src/app/personne/personne.service';
import { IfStmt } from '@angular/compiler';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-famille-detail',
  templateUrl: './famille-detail.component.html',
  styleUrls: ['./famille-detail.component.css']
})
export class FamilleDetailComponent {


  @Input() familleInput!: Famille;
  personnes: Personne[] = []

  lectureSeule = true;

  ngOnInit(): void {
    this.getFamille();
  }

  getFamille(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    // if (id == "") {
    //   //todo : verifier si ajoute famille
    //   // let ajoutFamille: Famille = {
    //   //     nomFamille: 'Nouvelle famille',
    //   //     personnes: [{nom:'', prenom:''}]
    //   // };
    //   // this.lectureSeule = false;
    //   // this.familleInput = notj  ;
    // }
    // else {
      
      this.familleService.getFamille(id)
          .subscribe(famille => {
            this.familleInput = famille;
            famille.personnesId.forEach(personneid => 
              this.getPersonne(personneid));
          });
    //}
  }

  getPersonne(personneId : string): void {
    this.personneService.getPersonne(personneId)
    .subscribe((personne: Personne) => {
      this.personnes.push(personne);
    });
  }


  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.lectureSeule = true
    // if (this.familleInput.personnes[0].nom == '') {
    //   this.lectureSeule = false;
    // }
    // else if (this.familleInput.familleId == null) {
    //   this.familleInput.nomFamille = this.familleInput.personnes[0].nom;
    //   this.familleService.addFamille(this.familleInput)
    //     .subscribe(() => this.goBack());
    // }

    // else if (this.familleInput) {
    //   this.familleInput.nomFamille = this.familleInput.personnes[0].nom;
    //   this.familleService.updateFamille(this.familleInput)
    //     .subscribe(() => this.goBack());
    // }
  }


  change(): void {
    this.lectureSeule = false
  }




  constructor(
    private route: ActivatedRoute,
    private familleService: FamilleService,
    private personneService: PersonneService,
    private location: Location
  ) { }
}
