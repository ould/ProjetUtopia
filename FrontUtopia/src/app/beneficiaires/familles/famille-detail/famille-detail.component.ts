import { Component, Input, OnInit } from '@angular/core';
import { Famille } from '../models/famille';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, formatDate, Location } from '@angular/common';
import { FamilleService } from '../famille.service';
import { Membre } from '../models/membre';
import { forkJoin, switchMap } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-famille-detail',
  templateUrl: './famille-detail.component.html',
  styleUrls: ['./famille-detail.component.css'],
  providers: [DatePipe]
})
export class FamilleDetailComponent implements OnInit {

  @Input() familleInput!: Famille;
  membresFamille: Membre[] = [];
  modificationEnCours: boolean = false;
  showMembres: boolean = false;  // Par défaut, la section membres est cachée
  familleForm: FormGroup;
  formulaireInvalide: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private familleService: FamilleService,
    private location: Location,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) {
    this.familleForm = this.fb.group({
      nom: [''],
      composition: ['', Validators.required],
      commentaire: ['', Validators.required]
    });
  }

  InitialiseFromWithData(): void {
    this.familleForm.patchValue({
      nom: this.familleInput.nom,
      composition: this.familleInput.composition,
      commentaire: this.familleInput.commentaire
    });
  }

  ngOnInit(): void {
    const idFamille = this.route.snapshot.paramMap.get('id');
    if (idFamille) {
      this.getFamille(idFamille);
    } else {
      this.initNouvelleFamille();
    }
  }

  private initNouvelleFamille(): void {
    this.familleInput = { nom: "", beneficiairesId: [] };
    this.membresFamille.push({ nom: '' });
    this.modificationEnCours = true;
  }

  private getFamille(idFamille: string): void {
    this.familleService.getFamille(idFamille)
      .subscribe(famille => {
        this.familleInput = famille;
        this.InitialiseFromWithData();
        this.loadMembres(famille.beneficiairesId);
      });
  }

  basculerAffichageMembres() {
    this.showMembres = !this.showMembres;  // Bascule l'état d'affichage
  }

  goBack(): void {
    if (this.modificationEnCours) {
      if (confirm("Des modifications non sauvegardées seront perdues. Voulez-vous vraiment revenir en arrière ?")) {
        this.location.back();
      }
    } else {
      this.location.back();
    }
  }

  saveOrUpdate(isUpdate: boolean): void {
    if (this.familleForm.invalid) {
      this.formulaireInvalide = true;
      return;
    }

    // Enregistrer ou mettre à jour les membres
    this.familleService.saveOrUpdateMembres(this.membresFamille)
      .subscribe(ids => {
        if (ids) {
          // Filtrer les valeurs undefined
          const validIds = ids.filter((id): id is string => id !== undefined);

          this.familleInput.beneficiairesId = validIds;
          this.familleInput.nom = this.membresFamille[0].nom + " - " + this.datePipe.transform(new Date(), 'dd/MM/yyyy')?.substring(0, 5);;

          // Déterminer l'opération sur la famille
          const familleOperation = isUpdate ?
            this.familleService.updateFamille(this.familleInput) :
            this.familleService.addFamille(this.familleInput);

          familleOperation.subscribe(familleId => {
            if (!isUpdate) {
              this.familleInput._id = familleId;
            }
            this.updateMembresParentId(ids);
            this.modificationEnCours = false; // Fin des modifications
          });
        }
      });
  }

  private loadMembres(membreIds: string[]): void {
    this.familleService.getMembres(membreIds)
      .subscribe(membres => {
        this.membresFamille = membres;
      });
  }

  private updateMembresParentId(membresIds: string[]): void {
    this.familleService.getMembres(membresIds).pipe(
      switchMap(membres => {
        this.membresFamille = membres;
        // Met à jour chaque membre avec le parentId
        const updateRequests = membres.map(membre => {
          membre.parentId = this.familleInput._id;
          return this.familleService.updateMembre(membre);
        });
        // Utilise forkJoin pour attendre que toutes les mises à jour soient terminées
        return forkJoin(updateRequests);
      })
    ).subscribe(() => {
      // Optionnel : Actions après la mise à jour de tous les membres
    });
  }
}
