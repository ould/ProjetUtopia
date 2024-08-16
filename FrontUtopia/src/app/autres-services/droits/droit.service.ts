import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Droit } from 'src/app/interfaces/droit';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DroitService {

  
  
  private droitUrl = environment.apiUrl + 'droit';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };

// TODO passer tout ça sur le USER
  getUserDroits(): Observable<Droit>{
    return this.http.post<Droit>(this.droitUrl + "/getUserDroits","", this.httpOptions).pipe(
      catchError(this.handleError<any>('getUserDroits'))
    )
  }

  getAll(): Observable<any>{
    return this.http.post<Droit[]>(this.droitUrl + "/getAll","", this.httpOptions).pipe(
      catchError(this.handleError<any>('getAllDroits'))
    )
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
    private http: HttpClient
  ) { }
}
