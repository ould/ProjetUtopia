import { Famille } from '../../interfaces/famille';
import { Personne } from 'src/app/interfaces/Personne';


const identiteMock: Personne[] = [
  {nom : 'nom1', prenom : 'prenom1', telephone: '0123456789', DDN: new Date(2023, 5, 14).toDateString(), situation: 'dublin'},
  {nom : 'nom2', prenom : 'prenom2', telephone: '0123456789', DDN: new Date(2022, 5, 14).toDateString(), situation: 'deboute'}
] 



export const FamillesMock: Famille[] = [
  { id: 2, nomFamille:'familleUne', personnes: identiteMock, composition: 'Couple', nationalite : 'france', commentaire :'test test etc' }
];

