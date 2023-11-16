import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-requete-detail',
  templateUrl: './requete-detail.component.html',
  styleUrls: ['./requete-detail.component.css']
})
export class RequeteDetailComponent {

  @Input() tableauInput!: string[];

next!:string[];

selectReporting(indexReporting: string):void{
  if (indexReporting == "Familles"){
    this.next = ["Nom", "prenom"]
  }

  else if (indexReporting == "Demandes"){
    this.next = ["Date demandée", "famille"]
  }
}

}
