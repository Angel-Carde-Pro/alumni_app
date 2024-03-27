import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageKeys, clearLocalStorage, getRole, getToken, getTokenTimeOut } from '../../interceptors/local-storage-manager';

@Injectable({
  providedIn: 'root'
})
export class sessionGuardGuard {
  constructor(private router: Router) {}

  canActivate() {
    const token = getToken(LocalStorageKeys.TOKEN);

    if (token) {

      if ( getTokenTimeOut(token) ) {
        Swal.fire({
          icon: 'info',
          title: '¡Tu sesión activa ha expirado!',
          text: 'Por favor, inicia sesión nuevamente',
        });
        clearLocalStorage();

        return true;
      } else if (getRole(token) === 'ROLE_GRADUADO') {
        this.router.navigate(['/system/alumni/dashboard']);
        Swal.fire({
          icon: 'info',
          title: 'Ya tiene una sesión activa',
          text: 'Se redirigirá a la página principal del sistema',
        });
        return false;
      } else if (getRole(token) === 'ROLE_EMPRESARIO') {
        this.router.navigate(['/system/company/dashboard']);
        Swal.fire({
          icon: 'info',
          title: 'Ya tiene una sesión activa',
          text: 'Se redirigirá a la página principal del sistema',
        });
        return false;
      } else if (getRole(token) === 'ROLE_ADMINISTRADOR') {
        this.router.navigate(['/system/admin/dashboard']);
        Swal.fire({
          icon: 'info',
          title: 'Ya tiene una sesión activa',
          text: 'Se redirigirá a la página principal del sistema',
        });
        return false;
      }
    }

    return true;
  }
}