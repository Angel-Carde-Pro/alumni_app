import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MAIN_ROUTE } from './MAIN_ROUTE';
import { Observable } from 'rxjs';
import { Carrera } from '../model/carrera';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  urlEndPoint = MAIN_ROUTE.API_ENDPOINT + '/carreras';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(this.urlEndPoint);
  }

  createCarrera(carrera: Carrera): Observable<Carrera> {
    return this.http.post<Carrera>(this.urlEndPoint, carrera, { headers: this.httpHeaders })
  }

  getCarreraById(id: any): Observable<Carrera> {
    return this.http.get<Carrera>(`${this.urlEndPoint}/${id}`)
  }

  updateCarrera(id: number, carrera: Carrera): Observable<Carrera> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.put<Carrera>(url, carrera, { headers: this.httpHeaders });
  }
  getCarrerasNombres(): Observable<string[]> {
    return this.http.get<Carrera[]>(this.urlEndPoint).pipe(
      map(carreras => carreras.map(carrera => carrera.nombre))
    );
  }
}