import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Type } from '../../interfaces/type';

@Injectable({
  providedIn: 'root'
})
export class TypePersonneService {

   
  private TypeUrl = environment.apiUrl + 'personneType';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };


  getPersonneType(): Observable<Type>{
    return this.http.post<Type>(this.TypeUrl + "/getpersonnetype","", this.httpOptions).pipe()
  }

  getAllType(): Observable<any>{
    return this.http.post<Type[]>(this.TypeUrl + "/getAllTypes","", this.httpOptions)
  }

  addType(nomType: string): Observable<Type> {
    const nomTypeVar = {nom : nomType}
    return this.http.post<Type>(this.TypeUrl, nomTypeVar, this.httpOptions).pipe(
      catchError(this.handleError<any>('addType'))
    );
  }

  updateType(Type: Type): Observable<Type> {
    return this.http.put<Type>(this.TypeUrl, Type, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateType'))
    );
  }

  deleteType(id: string): Observable<Type> {
    const url = `${this.TypeUrl}/${id}`;
    return this.http.delete<Type>(url, this.httpOptions).pipe(
      catchError(this.handleError<any>('deleteType'))
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
    private http: HttpClient
  ) { }
}
