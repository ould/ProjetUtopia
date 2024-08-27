import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  private apiUrl = "";

  constructor(private http: HttpClient) {}

  getMissions(): Observable<any> {
    //return this.http.get<any>(this.apiUrl);
    let date=new Date();
    let today =  `${date.getFullYear()}-${('0' + (date.getMonth() +1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    console.log(today)
    const ee = {
      "missions": [
        {
          "date": today,
          "time": "09:00",
          "actionType": "Distribution de repas",
          "min": 2,
          "max": 5
        },
        {
          "date": today,
          "time": "14:00",
          "actionType": "Collecte de vêtements",
          "min": 3,
          "max": 10
        },
        {
          "date": "2024-09-02",
          "time": "20:00",
          "actionType": "Maraude",
          "min": 1,
          "max": 4
        }
      ]
    }

    return of(ee)
  }
}
