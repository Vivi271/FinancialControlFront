import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  apiUri = '/api/usuarios'; // Cambiar la URI a la de usuarios

  constructor(private http: HttpClient) { }

  getAllUsuariosData(): Observable<any> {
    return this.http.get(this.apiUri, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getOneUsuario(id: any): Observable<any> {
    return this.http.get<any>(this.apiUri + '/' + id);
  }

  newUsuario(data: any): Observable<any> {
    return this.http.post<any>(this.apiUri, data);
  }

  updateUsuario(token: any , id: any, data: any): Observable<any> {
    console.log(data);
    return this.http.put<any>(
      this.apiUri + '/' + id,
      data,
      { headers: {
        'Content-Type': 'application/json',
        accessToken: `${token}`
      } });
  }

  deleteUsuario(token: any, id: any) {
    return this.http.delete<any>(
      this.apiUri + "/" + id,
      { headers: {
        'Content-Type': 'application/json',
        accessToken: `${token}`
      } })
  }
}
