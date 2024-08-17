import { Component, Input } from '@angular/core';
import { Membre } from '../models/membre';
@Component({
  selector: 'app-membre',
  templateUrl: './membre.component.html',
  styleUrls: ['./membre.component.css']
})
export class MembreComponent {
  @Input() membresInput!: Membre[];
  @Input() lectureSeuleInput!: boolean;
  @Input() ActiveInput!: Boolean;
  currentPersonneIndex: number = 0; // Indice de la personne actuelle

  get currentPersonne(): Membre {
    return this.membresInput[this.currentPersonneIndex];
  }

  prevPersonne(): void {
    if (this.currentPersonneIndex > 0) {
      this.currentPersonneIndex--;
    }
  }

  nextPersonne(): void {
    if (this.currentPersonneIndex < this.membresInput.length - 1) {
      this.currentPersonneIndex++;
    }
  }

  isFirstPersonne(): boolean {
    return this.currentPersonneIndex === 0;
  }

  isLastPersonne(): boolean {
    return this.currentPersonneIndex === this.membresInput.length - 1;
  }

  ajouterPersonne(): void {
  }
}
