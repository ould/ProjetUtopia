import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Antenne } from 'src/app/interfaces/antenne';
import { User } from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {


  private userUrl = environment.apiUrl + 'user';
  private selfUserUrl = environment.apiUrl + 'selfUser';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };



  getUser(id: string): Observable<User>{
    return this.http.get<User>(this.userUrl + "/" +id ).pipe()
  }

  getAllUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.userUrl + "/getAllUsers")
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.userUrl, user, this.httpOptions).pipe(
      catchError(this.handleError<any>('addUser'))
    );
  }

  updateUser(user:User): Observable<User> {
    return this.http.put<User>(this.userUrl, user, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateUser'))
    );
  }

  deleteUser(id: string): Observable<User> {
    const url = `${this.userUrl}/${id}`;
    return this.http.delete<User>(url, this.httpOptions).pipe(
      catchError(this.handleError<any>('deleteUser'))
    );
  }

  isGroup(nomGroupeAVerifier: string): Observable<Boolean> {
    const url = `${this.userUrl}/isGroupe/${nomGroupeAVerifier}`;
    return this.http.get<Boolean>(url).pipe();
  }

  getAntennes(): Observable<Antenne[]> {
    const url = `${this.selfUserUrl}/antennes/`;
    return this.http.get<Antenne[]>(url).pipe();
  }

  getAntenneDefaut(): Observable<Antenne> {
    const url = `${this.selfUserUrl}/antenneDefaut/`;
    return this.http.get<Antenne>(url).pipe();
  }

  changeAntenneDefaut(nouvelleAntenne:Antenne): Observable<Antenne> {
    return this.http.post<Antenne>(`${this.selfUserUrl}/antenneDefaut/`, nouvelleAntenne, this.httpOptions).pipe(
      catchError(this.handleError<any>('changeAntenneDefaut'))
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
