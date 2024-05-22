import { Component, Input } from '@angular/core';
import { Personne } from '../interfaces/Personne';

@Component({
  selector: 'app-personne',
  templateUrl: './personne.component.html',
  styleUrls: ['./personne.component.css']
})
export class PersonneComponent {

  @Input() personnesInput!: Personne[];
  @Input() lectureSeuleInput!: boolean;
  @Input() ActiveInput!: Boolean;
  currentPersonneIndex: number = 0; // Indice de la personne actuelle

  get currentPersonne(): Personne {
    return this.personnesInput[this.currentPersonneIndex];
  }

  prevPersonne(): void {
    if (this.currentPersonneIndex > 0) {
      this.currentPersonneIndex--;
    }
  }

  nextPersonne(): void {
    if (this.currentPersonneIndex < this.personnesInput.length - 1) {
      this.currentPersonneIndex++;
    }
  }

  isFirstPersonne(): boolean {
    return this.currentPersonneIndex === 0;
  }

  isLastPersonne(): boolean {
    return this.currentPersonneIndex === this.personnesInput.length - 1;
  }

  ajouterPersonne(): void {
  }

}
