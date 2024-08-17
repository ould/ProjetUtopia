import { Component, Input } from '@angular/core';
import { Famille } from '../models/famille';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FamilleService } from '../famille.service';
import { Membre } from '../models/Membre';


@Component({
  selector: 'app-famille-detail',
  templateUrl: './famille-detail.component.html',
  styleUrls: ['./famille-detail.component.css']
})
export class FamilleDetailComponent {


  @Input() familleInput!: Famille;
  membresFamille: Membre[] = []

  lectureSeule = true;

  ngOnInit(): void {
    const route = String(this.route.snapshot.url);
    console.log(route)
    if (route.includes("detailFamille")) {
      this.getFamille();
    }
    else {
      this.familleInput = { nomFamille: "Nouvelle Famille", personnesId: [] }
      this.membresFamille.push({ nom: "", type: "2" })
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
    this.familleService.getMembre(personneId)
      .subscribe((personne: Membre) => {
        this.membresFamille.push(personne);
      });
  }


  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.lectureSeule = this.VerificationCoherence();

    this.familleService.addOrUpdateAllMembres(this.membresFamille)
      .subscribe(ids => {
        this.familleInput.personnesId = ids
        this.familleInput.nomFamille = this.membresFamille[0].nom + ids[0].slice(0, 5);
        this.familleService.addOrUpdate(this.familleInput)
          .subscribe(id => this.familleInput._id = id);
      });

  }


  change(): void {
    this.lectureSeule = false
  }

  VerificationCoherence(): boolean {
    if (this.membresFamille[0].nom == '') {
      return false;
    }
    return true;
  }


  constructor(
    private route: ActivatedRoute,
    private familleService: FamilleService,
    private location: Location
  ) { }
}
