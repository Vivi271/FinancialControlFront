import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CostosService {
  apiUri = '/api/costos'; // Cambiar la URI a la de costos

  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  getAllCostosData(): Observable<any> {
    return this.http.get(this.apiUri, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getOneCosto(id: any): Observable<any> {
    return this.http.get<any>(this.apiUri + '/' + id);
  }

  newCosto(data: any, token: any): Observable<any> {
    return this.http.post<any>(
      this.apiUri,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          accessToken: `${token}`
        }
      });
    }

  updateCosto(token: any ,id: any, data: any): Observable<any> {
    console.log(data);
    return this.http.put<any>(
      this.apiUri + '/' + id,
      data,
      { headers: {
        'Content-Type': 'application/json',
        accessToken: `${token}`
      } });
  }

  deleteCosto(id: any) {
    return this.http.delete<any>(this.apiUri + '/' + id);
  }

  getOneAnimal(id: any): Observable<any> {
    return this.http.get<any>(
      this.apiUri + '/' + id,
      { headers: this.httpOptions });
  }


}
