import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, firstValueFrom, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InitialisationService {


  private initialiseUrl = environment.apiUrl + 'initialise';


  initialise(): Observable<Boolean> {
    console.log("Initialise")
    const url = `${this.initialiseUrl}/initialiseTout`;
    return this.http.get<Boolean>(url).pipe();
  }

  estInitialise(): Observable<Boolean> {
    const url = `${this.initialiseUrl}/exist`;
    return this.http.get<Boolean>(url).pipe();
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message);
  }

  constructor(
    private http: HttpClient) { }
}
