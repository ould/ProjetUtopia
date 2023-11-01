import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Famille } from './interfaces/famille';
import { Personne } from './interfaces/Personne';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const identiteMock: Personne[] = [
      {nom : 'nom1', prenom : 'prenom1', telephone: '0123456789', DDN: new Date(2023, 5, 14).toDateString(), situation: 'dublin'},
      {nom : 'nom2', prenom : 'prenom2', telephone: '0123456789', DDN: new Date(2022, 5, 14).toDateString(), situation: 'deboute'}
    ] 
    const familles: Famille[] = [
      { id: 2, nomFamille:'familleUne', personnes: identiteMock, composition: 'Couple', nationalite : 'france', commentaire :'test test etc' },
      { id: 3, nomFamille:'FamilleDeux', personnes: identiteMock, composition: 'Couple', nationalite : 'france', commentaire :'test test etc' },
    ];


    const loggedIn = false;


    return {familles, loggedIn};
  }
  

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(famille: Famille[]): number {
    return famille.length > 0 ? Math.max(...famille.map(fam => fam.id)) + 1 : 11;
  }
}