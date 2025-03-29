import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ErreurService } from '../erreur/erreur.service';
import { LogsService } from 'src/app/admin/gestion-logs/logs.service';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {


  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      this.log(`${operation} failed: ${error.message} ${error?.error?.error?.message}`, operation);
      
      this.erreurService.setErreur("Erreur : Veuillez contacter votre administrateur.");

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public log(message: string, operation:string) {
    if (this.authService.isLoggedIn()) this.logService.log(message, "Erreur", operation).subscribe()
    else this.logService.logPublic(message, "Erreur", operation).subscribe()
  }


  constructor(private erreurService: ErreurService,
    private logService: LogsService,
    private authService: AuthService,
  ) { }
}
