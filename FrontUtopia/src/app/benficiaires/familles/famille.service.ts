import { Injectable } from '@angular/core';
import { Famille } from './famille';
import { Observable, of } from 'rxjs';


import { FamillesMock } from './mock-familles';

@Injectable({
  providedIn: 'root'
})
export class FamilleService {

  searchFamilles(term: string): Observable<Famille[]> { //TODO : TOP 10 only, order by date desc
  if (!term.trim()) {
    // if not search term, return empty array.
    return of([]);
  }
  const famillesResult = FamillesMock.filter(h => h.name.startsWith(term))!;
  return of(famillesResult);
}

  constructor() { }
}
