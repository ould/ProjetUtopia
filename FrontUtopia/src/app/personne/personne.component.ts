import { Component, Input } from '@angular/core';
import { Personne } from '../interfaces/Personne';

@Component({
  selector: 'app-personne',
  templateUrl: './personne.component.html',
  styleUrls: ['./personne.component.css']
})
export class PersonneComponent {

  @Input() personneInput!: Personne;
  @Input() lectureSeuleInput!: Boolean;
  @Input() ActiveInput!: Boolean;



}
