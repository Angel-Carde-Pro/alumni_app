import { Injectable } from '@angular/core';
import { MAIN_ROUTE } from './MAIN_ROUTE';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ofertaLaboral } from '../model/ofertaLaboral';
import { ofertaLaboralDTO } from '../model/DTO/ofertaLaboralDTO';
import { Observable } from 'rxjs';
import { Graduado } from '../model/graduado';
import { contratacion } from '../model/contratacion';

@Injectable({
  providedIn: 'root'
})
export class OfertalaboralService {

  urlEndPoint = MAIN_ROUTE.API_ENDPOINT + '/ofertas-laborales';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getGraduadosByOfertaLaboral(id: number): Observable<Graduado[]>{

    return this.http.get<Graduado[]>(`${this.urlEndPoint}/graduados/${id}`)
  }
  getGraduadosContradatosByOfertaLaboral(id: number): Observable<contratacion[]>{

    return this.http.get<contratacion[]>(`${this.urlEndPoint}/ofertaLaboral/${id}`)
  }
  deleteGraduadoContratado(id: number): Observable<any> {
    return this.http.delete(`${this.urlEndPoint}/contrataciones/${id}`);
  }

  OfertasLaborales(name:string): Observable<ofertaLaboralDTO[]> {
    return this.http.get<ofertaLaboralDTO[]>(`${this.urlEndPoint}/empresario/${name}`);
  }
  getOfertasLaborales(): Observable<ofertaLaboralDTO[]> {
    return this.http.get<ofertaLaboralDTO[]>(`${this.urlEndPoint}`);
  }
  getOfertasLaboralesByEmpresario(name: string): Observable<ofertaLaboralDTO[]> {
    return this.http.get<ofertaLaboralDTO[]>(`${this.urlEndPoint}/usuario/${name}`);
  }
  
  getOfertasLaboralesByNameEmpresario(name: string): Observable<ofertaLaboralDTO[]> {
    return this.http.get<ofertaLaboralDTO[]>(`${this.urlEndPoint}/empresario/${name}`);
  }

  createOfertaLaboral(oferta: ofertaLaboral): Observable<ofertaLaboral> {
    return this.http.post<ofertaLaboral>(this.urlEndPoint, oferta, { headers: this.httpHeaders })
  }

  getOfertaLaboralById(id: number): Observable<ofertaLaboral> {
    return this.http.get<ofertaLaboral>(`${this.urlEndPoint}/${id}`)
  }

  getOfertaLaboralWithPostulateByGraduateId(id:number): Observable<ofertaLaboralDTO[]> {
    return this.http.get<ofertaLaboralDTO[]>(`${this.urlEndPoint}/ofertas-sin-postular/${id}`);
  }

  getOfertaLaboralByIdToDTO(id: number): Observable<ofertaLaboralDTO> {
    return this.http.get<ofertaLaboralDTO>(`${this.urlEndPoint}/dto/${id}`)
  }

  updateOfertaLaboral(id: number, ofertaLaboralDTO: ofertaLaboralDTO): Observable<any> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.put(url, ofertaLaboralDTO);
      
  }

  selectContratados(id: number,data: Array<any>): Observable<any> {
    const url = `${this.urlEndPoint}/seleccionar-contratados/${id}`;

    return this.http.post(url, data);
  }


  deleteOfertabyID  (id: number): Observable<any> {
    return this.http.delete(`${this.urlEndPoint}/${id}`);
  }
}
