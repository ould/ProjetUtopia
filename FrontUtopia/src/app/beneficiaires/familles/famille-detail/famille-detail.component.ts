import { Component, Input } from '@angular/core';
import { Famille } from '../../../interfaces/famille';
import { Personne } from 'src/app/interfaces/Personne';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FamilleService } from '../famille.service';
import { PersonneService } from 'src/app/personne/personne.service';


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
    const route = String(this.route.snapshot.url);
    console.log(route)
    if (route.includes("detailFamille")) {
      this.getFamille();
    }
    else {
      this.familleInput = { nomFamille: "Nouvelle Famille", personnesId: [] }
      this.personnes.push({ nom: "", type: "2" })
      this.lectureSeule = false
    }
  }

  getFamille(): void {
    const nom = String(this.route.snapshot.paramMap.get('id'));
    this.familleService.getFamille(nom)
      .subscribe(famille => {
        this.familleInput = famille;
        famille.personnesId.forEach(personneid =>
          this.getPersonne(personneid));
      });
  }

  getPersonne(personneId: string): void {
    this.personneService.getPersonne(personneId)
      .subscribe((personne: Personne) => {
        this.personnes.push(personne);
      });
  }


  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.lectureSeule = this.VerificationCoherence();

    this.personnes.forEach(personne => {
      personne.type = "2";
    })

    this.personneService.addOrUpdateAll(this.personnes)
      .subscribe(ids => {
        this.familleInput.personnesId = ids
        console.log("les ids " + ids)
        this.familleInput.nomFamille = this.personnes[0].nom + ids[0].slice(0, 5);
        console.log(this.familleInput)
        this.familleService.addOrUpdate(this.familleInput)
          .subscribe(id => this.familleInput._id = id);
      });

  }


  change(): void {
    this.lectureSeule = false
  }

  VerificationCoherence(): boolean {
    if (this.personnes[0].nom == '') {
      return false;
    }
    return true;
  }


  constructor(
    private route: ActivatedRoute,
    private familleService: FamilleService,
    private personneService: PersonneService,
    private location: Location
  ) { }
}
