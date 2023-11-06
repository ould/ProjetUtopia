import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Famille } from './interfaces/famille';
import { Personne } from './interfaces/Personne';
import { Login } from './interfaces/login';
import { Message } from './interfaces/message';
import { Chat } from './interfaces/chat';

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

    const Messages: Message[] = [
      {id:0, nomPersonne: 'bene1', message: 'message bene1'},
      {id:0, nomPersonne: 'bene2', message: 'message bene2'}
    ]

    const chats:Chat[] = [
      {id:1, nomChat:'MAB 12/01', messages:Messages},
      {id:1, nomChat:' Benevole MNA 12/01', messages:Messages}
    ]



    return {familles, loggedIn, chats};
  }
  

  
}