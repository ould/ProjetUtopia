import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ErreurService } from '../erreur/erreur.service';
import { LogsService } from 'src/app/admin/gestion-logs/logs.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {


  public handleError<T>(operation = 'operation', publique = false, result?: T) {
    return (error: any): Observable<T> => {

      this.log(`${operation} failed: ${error.message} ${error?.error?.error?.message}`, publique, operation);
      
      this.erreurService.setErreur("Erreur : Veuillez contacter votre administrateur.");

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public log(message: string, publique: boolean, operation:string) {
    if (publique) this.logService.logPublic(message, "Erreur", operation).subscribe()
    else this.logService.log(message, "Erreur", operation).subscribe()
  }


  constructor(private erreurService: ErreurService,
    private logService: LogsService
  ) { }
}
