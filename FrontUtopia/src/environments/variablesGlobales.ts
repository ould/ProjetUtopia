import { Injectable, OnInit } from '@angular/core';
import { Antenne } from '../app/interfaces/antenne';
import { UtilisateurService } from '../app/autres-services/utilisateur/utilisateur.service';

@Injectable({
  providedIn: 'root',
})
export class VariablesGlobales implements OnInit {
    antenneActuelle?:Antenne 



    ngOnInit(): void {
        this.utilisateurService.getAntenneDefaut().subscribe(
            data => {
                this.antenneActuelle = data
              }
        )
    }
    constructor(public utilisateurService: UtilisateurService) { }

}