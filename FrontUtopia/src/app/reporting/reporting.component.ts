import { Component } from '@angular/core';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent {

tableauBase: string[] = ["Familles","Demandes"]
phrase = "Vous voulez un rapport concernant : "


}
