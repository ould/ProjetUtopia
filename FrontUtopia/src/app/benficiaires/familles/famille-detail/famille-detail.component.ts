import { Component, Input  } from '@angular/core';
import { Famille } from '../famille';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-famille-detail',
  templateUrl: './famille-detail.component.html',
  styleUrls: ['./famille-detail.component.css']
})
export class FamilleDetailComponent {

  @Input() famille?: Famille;

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {}

}
