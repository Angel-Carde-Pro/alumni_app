import { Injectable } from '@angular/core';
import { MAIN_ROUTE } from './MAIN_ROUTE';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Experiencia } from '../model/experiencia';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaService {

  urlEndPoint = MAIN_ROUTE.API_ENDPOINT + '/experiencias';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getExperiencias(): Observable<Experiencia[]> {
    return this.http.get<Experiencia[]>(this.urlEndPoint);
  }

  createExperiencia(experience: Experiencia): Observable<Experiencia> {
    return this.http.post<Experiencia>(`${this.urlEndPoint}/create`, experience, { headers: this.httpHeaders })
  }
  

  getExperienciaById(id: any): Observable<Experiencia> {
    return this.http.get<Experiencia>(`${this.urlEndPoint}/${id}`)
  }

  updateExperiencia(id: any, experiencia: Experiencia): Observable<Experiencia> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.put<Experiencia>(url, experiencia, { headers: this.httpHeaders });
  }

  deleteExperiencia(id: any): Observable<void> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.delete<void>(url, { headers: this.httpHeaders });
  }
}
