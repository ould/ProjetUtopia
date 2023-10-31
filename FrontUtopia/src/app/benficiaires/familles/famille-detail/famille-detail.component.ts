import { Component, Input } from '@angular/core';
import { Famille } from '../famille';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FamilleService } from '../famille.service';


@Component({
  selector: 'app-famille-detail',
  templateUrl: './famille-detail.component.html',
  styleUrls: ['./famille-detail.component.css']
})
export class FamilleDetailComponent {


  @Input() familleInput!: Famille;

  lectureSeule = true;

  ngOnInit(): void {
    this.getFamille();
  }

  getFamille(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.familleService.getFamille(id)
      .subscribe(famille => this.familleInput = famille);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.lectureSeule = true
    // if (this.famille) {
    //   this.familleService.updatefamille(this.famille)
    //     .subscribe(() => this.goBack());
    // }
  }

  change(): void {
    this.lectureSeule = false
  }




  constructor(
    private route: ActivatedRoute,
    private familleService: FamilleService,
    private location: Location
  ) { }
}
