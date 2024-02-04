import { Injectable } from '@angular/core';
import { MAIN_ROUTE } from './MAIN_ROUTE';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Graduado } from '../model/graduado';
import { Graduado3 } from '../model/graduado';
import { map } from 'rxjs/operators';
import { ofertaLaboral } from '../model/ofertaLaboral';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { GraduadoDTO } from '../model/DTO/GraduadoDTO';

@Injectable({
  providedIn: 'root'
})
export class GraduadoService {

  urlEndPoint = MAIN_ROUTE.API_ENDPOINT + '/graduados';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getGraduados(): Observable<Graduado[]> {
    return this.http.get<Graduado[]>(this.urlEndPoint);
  }

  createGraduado(graduado: Graduado): Observable<Graduado> {
    return this.http.post<Graduado>(this.urlEndPoint, graduado, { headers: this.httpHeaders })
  }

  getGraduadoById(id: any): Observable<Graduado> {
    return this.http.get<Graduado>(`${this.urlEndPoint}/${id}`)
  }
  //llenado de informacion 
  getGraduados2(): Observable<Graduado3[]> {
    return this.http.get<Graduado3[]>(this.urlEndPoint);
  }

  createGraduado2(graduado2: Graduado3): Observable<Graduado3> {
    return this.http.post<Graduado3>(this.urlEndPoint, graduado2, { headers: this.httpHeaders })
  }


  checkGraduadoExists(nombre: string): Observable<boolean> {
    return this.getGraduados2().pipe(
      tap(graduados => console.log('Administradores obtenidos:', graduados)),
      map(graduados => {
        const exists = graduados.some(gradu => 
          gradu.usuario && gradu.usuario && 
          gradu.usuario.toLowerCase() === nombre.toLowerCase()
        );
        console.log(`¿Existe administrador con nombre ${nombre}? ${exists}`);
        return exists;
      }),
      catchError(error => {
        console.error('Error al verificar la existencia del administrador:', error);
        return of(false); // Devolver false en caso de error
      })
    );
  }
  getGraduadoByUsuario(usuario: string): Observable<Graduado3 | null> {
    return this.http.get<Graduado3[]>(this.urlEndPoint).pipe(
      map(graduados => graduados.find(graduado => graduado.usuario === usuario) || null)
    );
  }
  
  updateOfferInGraduado(graduado: GraduadoDTO, idGraduado:number): Observable<GraduadoDTO> {
    return this.http.put<GraduadoDTO>(`${this.urlEndPoint}/postulaciones/${idGraduado}`, graduado, {headers: this.httpHeaders})
  }

  cancelOfferInGraduado(graduado: GraduadoDTO, idGraduado: number): Observable<GraduadoDTO> {
    return this.http.put<GraduadoDTO>(`${this.urlEndPoint}/cancel-postulaciones/${idGraduado}`, graduado, {headers: this.httpHeaders})
  } 

  getOfertasLaboralesByUsername(username: string): Observable<ofertaLaboral[]> {
    return this.http.get<ofertaLaboral[]>(`${this.urlEndPoint}/user/${username}`);
  }

  getGraduadoByUsuarioId(id: any): Observable<GraduadoDTO>{
    return this.http.get<GraduadoDTO>(`${this.urlEndPoint}/usuario/${id}`)
  }

  getGraduadosWithOutOferta(): Observable<Graduado[]> {
    return this.http.get<Graduado[]>(`${this.urlEndPoint}/without-oferta`);
  }
  searchGraduadosByUsuario(usuario: string): Observable<Graduado3[]> {
    return this.http.get<Graduado3[]>(this.urlEndPoint).pipe(
      map(graduados => {
        console.log('Nombres de usuario en la lista:', graduados.map(graduado => graduado.usuario));
        return graduados.filter(graduado => graduado.usuario.toLowerCase().includes(usuario.toLowerCase()));
      })
    );
  }
}
