import { Injectable, OnInit } from '@angular/core';
import { Antenne } from './interfaces/antenne';
import { UtilisateurService } from './autres-services/utilisateur/utilisateur.service';

@Injectable({
  providedIn: 'root',
})
export class VariablesGlobales implements OnInit {
    antenneActuelle?:Antenne 



    ngOnInit(): void {
        this.utilisateurService.getAntenneDefaut().subscribe(
            data => {
                this.antenneActuelle = data
                console.log(this.antenneActuelle)
              }
        )
    }
    constructor(public utilisateurService: UtilisateurService) { }

}