import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Antenne } from 'src/app/interfaces/antenne';

@Injectable({
  providedIn: 'root'
})
export class AntenneService {

  private userUrl = environment.apiUrl + 'antenne';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };



  getAntenne(id: string): Observable<Antenne>{
    return this.http.get<Antenne>(this.userUrl + "/" +id ).pipe()
  }

  getAllAntennes(): Observable<Antenne[]>{
    return this.http.get<Antenne[]>(this.userUrl + "/getAll")
  }

  addAntenne(user: Antenne): Observable<Antenne> {
    return this.http.post<Antenne>(this.userUrl, user, this.httpOptions).pipe(
      catchError(this.handleError<any>('addUser'))
    );
  }

  updateAntenne(user:Antenne): Observable<Antenne> {
    return this.http.put<Antenne>(this.userUrl, user, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateAntenne'))
    );
  }

  deleteAntenne(id: string): Observable<Antenne> {
    const url = `${this.userUrl}/${id}`;
    return this.http.delete<Antenne>(url, this.httpOptions).pipe(
      catchError(this.handleError<any>('deleteAntenne'))
    );
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
