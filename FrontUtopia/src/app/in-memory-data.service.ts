import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Famille } from './interfaces/famille';
import { Personne } from './interfaces/Personne';
import { Login } from './interfaces/login';

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
      { id: 1 ,nomFamille:'familleUne', personnes: identiteMock, composition: 'Couple', nationalite : 'france', commentaire :'test test etc' },
      { id: 2, nomFamille:'FamilleDeux', personnes: identiteMock, composition: 'Couple', nationalite : 'france', commentaire :'test test etc' },
    ];


    const loggedIn: Login[] =  [
      {id: 1, statut: false}
    ]

    return {familles, loggedIn};
  }
  

  
}