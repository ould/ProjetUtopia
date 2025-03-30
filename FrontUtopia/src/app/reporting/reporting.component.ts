import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-reporting',
    templateUrl: './reporting.component.html',
    styleUrls: ['./reporting.component.css'],
    standalone: false
})
export class ReportingComponent {

tableauBase: string[] = ["Familles","Demandes"]
phrase = "Vous voulez un rapport concernant : "

navigateToForm(formName: string): void {
    const baseUrl = '/forms/';
    switch (formName) {
        case 'maraude':
            this.router.navigateByUrl("/form-maraude")
            break;
        default:
            console.error(`Unknown form: ${formName}`);
    }
}


constructor(private router: Router) { }

}
