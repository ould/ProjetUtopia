import { Component } from '@angular/core';

@Component({
    selector: 'app-reporting',
    templateUrl: './reporting.component.html',
    styleUrls: ['./reporting.component.css'],
    standalone: false
})
export class ReportingComponent {

tableauBase: string[] = ["Familles","Demandes"]
phrase = "Vous voulez un rapport concernant : "


}
