import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilisateurService } from 'src/app/autres-services/utilisateur/utilisateur.service';
import { User } from 'src/app/interfaces/user';
import { Location } from '@angular/common';
import { Antenne } from 'src/app/interfaces/antenne';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AntenneService } from 'src/app/autres-services/antenne/antenne.service';
import { GroupeService } from 'src/app/autres-services/groupe/groupe.service';
import { Groupe } from 'src/app/interfaces/groupe';
import { Droit } from 'src/app/interfaces/droit';
import { DroitService } from 'src/app/autres-services/droits/droit.service';

@Component({
  selector: 'app-compte-detail',
  templateUrl: './compte-detail.component.html',
  styleUrls: ['./compte-detail.component.css']
})
export class CompteDetailComponent implements OnInit {

  @Input() utilisateur!: User;
  updateUserForm: FormGroup;
  antennes: Antenne[] = []
  groupes: Groupe[] = []
  droits: Droit[] = []

  constructor(private fb: FormBuilder,
    private utilisateurService: UtilisateurService,
    private antenneService: AntenneService,
    private groupService: GroupeService,
    private droitService: DroitService,
    private route: ActivatedRoute,
    private location: Location) {

    this.updateUserForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      antennes: ['', [Validators.required]],
      groupes: ['', [Validators.required]],
      droits: ['', [Validators.required]]
    });

  }

  ngOnInit(): void {
    this.antenneService.getAllAntennes().subscribe(
      data => {
        this.antennes = data
      }
    );
    this.groupService.getAllGroupes().subscribe(
      data => {
        this.groupes = data
      }
    );
    this.droitService.getAllDroits().subscribe(
      data => {
        this.droits = data
      }
    );
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.utilisateurService.getUser(id)
      .subscribe(user => {
        this.utilisateur = user;
        this.InitialiseFromWithData();
      })

  }

  modifierUtilisateur(): void {
    if (this.updateUserForm.valid) {
      this.utilisateur.groupes = this.updateUserForm.get('groupes')?.value;
      this.utilisateur.droits = this.updateUserForm.get('droits')?.value;
      this.utilisateur.antennes = this.updateUserForm.get('antennes')?.value;
      this.utilisateur.nom = this.updateUserForm.get('nom')?.value;
      this.utilisateur.prenom = this.updateUserForm.get('prenom')?.value;
      this.utilisateur.email = this.updateUserForm.get('email')?.value;

      this.utilisateurService.updateUser(this.utilisateur).subscribe({
        
      });
    }
  }

  InitialiseFromWithData(): void {
    this.updateUserForm.setValue({
      nom: this.utilisateur.nom,
      prenom: this.utilisateur.prenom,
      email: this.utilisateur.email,
      antennes: this.utilisateur.antennes,
      groupes: this.utilisateur.groupes,
      droits: this.utilisateur.droits,
    })
  }

  goBack(): void {
    this.location.back();
  }
}
