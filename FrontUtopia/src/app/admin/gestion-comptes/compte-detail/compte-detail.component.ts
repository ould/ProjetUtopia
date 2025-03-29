import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilisateurService } from 'src/app/autres-services/utilisateur/utilisateur.service';
import { Location } from '@angular/common';
import { Antenne } from 'src/app/gestionApp/interfaces/antenne';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AntenneService } from 'src/app/autres-services/antenne/antenne.service';
import { Utilisateur } from 'src/app/autres-services/utilisateur/utilisateur';
import { Profil } from '../../gestion-profil/profil';
import { ProfilService } from '../../gestion-profil/profil.service';

@Component({
  selector: 'app-compte-detail',
  templateUrl: './compte-detail.component.html',
  styleUrls: ['./compte-detail.component.css']
})
export class CompteDetailComponent implements OnInit {

  @Input() utilisateur!: Utilisateur;
  updateUtilisateurForm: FormGroup;
  antennes: Antenne[] = [];
  profils: Profil[] = []

  constructor(private fb: FormBuilder,
    private utilisateurService: UtilisateurService,
    private antenneService: AntenneService,
    private profilService: ProfilService,
    private route: ActivatedRoute,
    private location: Location) {

    this.updateUtilisateurForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      antennes: ['', [Validators.required]],
      profil: ['', [Validators.required]]
    });

  }

  ngOnInit(): void {
    this.antenneService.getAll().subscribe(
      data => {
        this.antennes = data
      }
    );
    this.profilService.getAll().subscribe(
      data => {
        this.profils = data
      }
    );
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.utilisateurService.getUtilisateur(id)
      .subscribe(utilisateur => {
        this.utilisateur = utilisateur;
        this.InitialiseFromWithData();
      })

  }

  modifierUtilisateur(): void {
    if (this.updateUtilisateurForm.valid) {
      this.utilisateur.nom = this.updateUtilisateurForm.get('nom')?.value;
      this.utilisateur.prenom = this.updateUtilisateurForm.get('prenom')?.value;
      this.utilisateur.email = this.updateUtilisateurForm.get('email')?.value;
      this.utilisateur.antennes = this.updateUtilisateurForm.get('antennes')?.value;
      this.utilisateur.profilId = this.updateUtilisateurForm.get('profil')?.value;

      this.utilisateurService.updateUtilisateur(this.utilisateur).subscribe({
        next: (response) => {
          this.location.back();
        },
        error: (err) => {
          alert('Une erreur est survenue lors de la mise à jour de l\'utilisateur.');
        }
      });
    }
  }

  InitialiseFromWithData(): void {
    this.updateUtilisateurForm.setValue({
      nom: this.utilisateur.nom,
      prenom: this.utilisateur.prenom,
      email: this.utilisateur.email,
      antennes: this.utilisateur.antennes,
      profil: this.utilisateur.profilId
    })
  }

  goBack(): void {
    this.location.back();
  }
}
