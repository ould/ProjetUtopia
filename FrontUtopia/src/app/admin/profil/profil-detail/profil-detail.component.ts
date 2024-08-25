import { Component, Input, OnInit } from '@angular/core';
import { DroitPossible, Profil } from '../profil';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfilService } from '../profil.service';
import { ActivatedRoute } from '@angular/router';
import { Section } from 'src/app/interfaces/section';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profil-detail',
  templateUrl: './profil-detail.component.html',
  styleUrls: ['./profil-detail.component.css']
})
export class ProfilDetailComponent implements OnInit {

  @Input() profil!: Profil;
  updateProfilForm: FormGroup;
  enumSections: typeof Section = Section;
  enumDroits: typeof DroitPossible = DroitPossible;
  nbrDeSection = Object.keys(Section).length;

  constructor(private fb: FormBuilder,
    private profilService: ProfilService,
    private route: ActivatedRoute,
    private location: Location) {

    this.updateProfilForm = this.fb.group({});

    Object.keys(Section).forEach(section => {
      this.updateProfilForm.addControl(section, this.fb.control('', Validators.maxLength(this.nbrDeSection)));
    });

  }

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.profilService.get(id)
      .subscribe(resultat => {
        this.profil = resultat;
        this.InitialiseFormWithData(resultat.tableauDroits);
      })
  }

  modifierProfil(): void {
    if (this.updateProfilForm.valid) {
      //Pour chaque section du profil
      Object.keys(Section).forEach(section => {

        let droitsFormValue = this.updateProfilForm.get(section)?.value.join('');

        // Trouvez l'objet "Droit" correspondant à la section dans `tableauDroits`
        const droitExist = this.profil.tableauDroits.find(droit => droit.section === section);

        // MAJ du champ "droits" ou ajoutez une nouvelle entrée si elle n'existe pas
        if (droitExist) {
          droitExist.droits = droitsFormValue;
        } else {
          // Si la section n'existe pas dans `tableauDroits`, on peut l'ajouter (pour les nouvelles)
          this.profil.tableauDroits.push({ section: section, droits: droitsFormValue });
        }
      });
      this.profil.commentaire = this.updateProfilForm.get('commentaire')?.value;
      this.profilService.update(this.profil).subscribe();
    }
  }

  initializeForm(): void {
    this.updateProfilForm = this.fb.group({});
    this.updateProfilForm.addControl("commentaire", this.fb.control([]));
    Object.keys(Section).forEach(section => {
      const controlName = Section[section as keyof typeof Section];
      this.updateProfilForm.addControl(controlName, this.fb.control([])); // Initialise avec des valeurs vides (necessaire pour les profil avec des sections sans droits)
    });
  }

  InitialiseFormWithData(data: any): void {
    let objectValue: { [key: string]: any } = {};

    Object.keys(Section).forEach(section => {
      const controlName = Section[section as keyof typeof Section];
      let droitsSection = data.find((droit: { section: string }) => droit.section === controlName)?.droits;

      if (droitsSection?.length > 0) {
        const droitsTableau = droitsSection.split('');
        droitsSection = droitsTableau
      }

      objectValue[controlName] = droitsSection || [''];
    });
    objectValue['commentaire'] = this.profil.commentaire
    this.updateProfilForm.setValue(objectValue);
  }

  goBack(): void {
    this.location.back();
  }

}
