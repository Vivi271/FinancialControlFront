import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {
  apiUri = '/api/ingresos'; // Cambiar la URI a la de ingresos
  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  getAllIngresosData(): Observable<any> {
    return this.http.get(this.apiUri, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getOneIngreso(id: any): Observable<any> {
    return this.http.get<any>(this.apiUri + '/' + id);
  }

  newIngreso(data: any): Observable<any> {
    return this.http.post<any>(
      this.apiUri,
      data,
      {headers: this.httpOptions});
}

  updateIngreso(id: any, data: any): Observable<any> {
    console.log(data);
    return this.http.put<any>(this.apiUri + '/' + id, data);
  }

  deleteIngreso(id: any) {
    return this.http.delete<any>(this.apiUri + '/' + id);
  }
}
