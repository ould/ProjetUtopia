import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ErreurService } from '../erreur/erreur.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {


  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      this.erreurService.setErreur("Erreur : " + error.error.error.message);

      // TODO: better job of transforming error for uti consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public log(message: string) {
    console.log(message);
  }

  
  constructor(private erreurService: ErreurService) { }
}
