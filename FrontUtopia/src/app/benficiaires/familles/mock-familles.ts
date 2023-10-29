import { Famille } from './famille';
import { Personne } from 'src/app/interfaces/Personne';


const identiteMock: Personne[] = [
  {nom : 'nom1', prenom : 'prenom1', telephone: '0123456789'},
  {nom : 'nom2', prenom : 'prenom2', telephone: '0123456789'}
] 



export const FamillesMock: Famille[] = [
  { id: 2, nomFamille:'familleUne', personnes: identiteMock  },
  { id: 3, nomFamille:'familleDeux', personnes: identiteMock }
];

