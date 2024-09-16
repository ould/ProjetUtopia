import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Membre } from '../models/membre';
import { FamilleService } from '../famille.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-membre',
  templateUrl: './membre.component.html',
  styleUrls: ['./membre.component.css']
})
export class MembreComponent implements OnInit {
  @Input() membresInput: Membre[] = [];
  @Input() modificationEnCours: boolean = true;
  @Input() familleForm!: FormGroup;
  membreForm:FormGroup;

  currentPersonneIndex: number = 0;
  situations!: string[];
  procedures!: string[];
  nationalites!: string[];

  ngOnInit(): void {
    this.familleService.getReferentielByNom("Procedure").subscribe(
      data => {
        this.procedures = data
      }
    )

    this.familleService.getReferentielByNom("Pays").subscribe(
      data => {
        this.nationalites = data
      }
    )
    this.loadCurrentMembre();
    this.familleForm.addControl("membre", this.membreForm.controls)
  }

  constructor(
    private fb: FormBuilder,
    private familleService: FamilleService
  ) {
    this.membreForm = this.fb.group({
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        ddn: ['', Validators.required],
        procedure: [''],
        telephone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
        nationalite: ['']
      });
  }

  get currentMember() {
    return this.membresInput[this.currentPersonneIndex];
  }

  loadCurrentMembre(): void {
    if (this.membresInput[this.currentPersonneIndex]) {
      //this.membresForm.patchValue(this.membresInput[this.currentPersonneIndex]);
    }
  }

  ajouterPersonne() {
    this.membresInput.push({ nom: '' });
    this.currentPersonneIndex
      = this.membresInput.length - 1;
    this.loadCurrentMembre();
  }

  supprimerPersonne() {
    if (this.membresInput.length > 0) {
      this.currentMember.nom = "Suppression"
      // Supprimer la personne actuelle de la liste
      this.membresInput.splice(this.currentPersonneIndex, 1);

      // Gérer l'index après la suppression
      if (this.currentPersonneIndex >= this.membresInput.length) {
        this.currentPersonneIndex = this.membresInput.length - 1;
      }

      // Si la liste est vide, réinitialiser l'index
      if (this.membresInput.length === 0) {
        this.currentPersonneIndex = 0;
      }
      this.loadCurrentMembre();
    }
  }

  //#region defilement membres

  startX: number | null = null;
  deltaX: number = 0;
  touchThreshold: number = 50;

  @HostListener('mousedown', ['$event']) @HostListener('touchstart', ['$event']) onStart(event: MouseEvent | TouchEvent) { const e = event as MouseEvent | TouchEvent; this.startX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX; this.deltaX = 0; }
  @HostListener('mousemove', ['$event']) @HostListener('touchmove', ['$event']) onMove(event: MouseEvent | TouchEvent) {
    if (this.startX === null) return;
    const e = event as MouseEvent | TouchEvent;
    this.deltaX = e instanceof MouseEvent ? e.clientX - this.startX : e.touches[0].clientX - this.startX;
  }

  @HostListener('mouseup', ['$event']) @HostListener('touchend', ['$event']) onEnd(event: MouseEvent | TouchEvent) {
    if (Math.abs(this.deltaX) > this.touchThreshold) { if (this.deltaX < 0) { this.nextPersonne(); } else { this.prevPersonne(); } }
    this.resetTouch();
  }

  private resetTouch() { this.startX = null; this.deltaX = 0; }

  prevPersonne() { if (this.currentPersonneIndex > 0) { this.currentPersonneIndex--; } }

  nextPersonne() { if (this.currentPersonneIndex < this.membresInput.length - 1) { this.currentPersonneIndex++; } }
  //#endregion
}