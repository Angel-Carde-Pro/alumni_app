import { Injectable } from '@angular/core';
import { MAIN_ROUTE } from './MAIN_ROUTE';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../model/empresa';
import { Empresario } from '../model/empresario';
import { Empresa2 } from '../model/empresa';
import { EmpresaDTO } from '../model/DTO/EmpresaDTO';
@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  urlEndPoint = MAIN_ROUTE.API_ENDPOINT + '/empresas';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.urlEndPoint);
  }

  getEmpresasbyUser(nombre:String): Observable<Empresa[]> {
    const url = `${this.urlEndPoint}/by-usuario/${nombre}`;
    return this.http.get<Empresa[]>(url);
  }

  createEmpresa(empresa: EmpresaDTO): Observable<EmpresaDTO> {
    return this.http.post<EmpresaDTO>(this.urlEndPoint, empresa, { headers: this.httpHeaders })
  }

  getEmpresaById(id: any): Observable<Empresa2> {
    return this.http.get<Empresa2>(`${this.urlEndPoint}/${id}`)
  }

  getCompanyById(id: any): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.urlEndPoint}/${id}`)
  }

  updateEmpresa(id: number, empresa: Empresa): Observable<Empresa> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.put<Empresa>(url, empresa, { headers: this.httpHeaders });
  }

  updatePdfRuc(id: number, pdfRuc: string): Observable<Empresa> {
    const url = `${this.urlEndPoint}/pdf-ruc/${id}/${pdfRuc}`;
    return this.http.put<Empresa>(url, { headers: this.httpHeaders });
  }

  getEmpresarioByUsuarioId(id: any): Observable<Empresario> {
    return this.http.get<Empresario>(`${this.urlEndPoint}/usuario/${id}`)
  }

  deleteEmpresa(id: number): Observable<string> {
    return this.http.delete(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders, responseType: 'text' });
  }
  
  
  
  getEmpresaSinOfertasLab(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.urlEndPoint}/sin-oferta-laboral`);
  }
}
