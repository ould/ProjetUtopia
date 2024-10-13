import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErreurService {
  private messageErreur = new BehaviorSubject<string | null>(null);

  setErreur(message: string): void {
    this.messageErreur.next(message);
  }

  clearErreur(): void {
    this.messageErreur.next(null);
  }

  getErreur(): Observable<string | null> {
    return this.messageErreur.asObservable();
  }
}
