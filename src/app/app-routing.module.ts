import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutBaseComponent } from './layout/layout-client/layout-base.component';
import { LayoutSystemComponent } from './layout/layout-system/layout-system.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { GraduadosListComponent } from './pages/alumni/graduados-list/graduados-list.component';
import { UsuariosListsComponent } from './usuarios-lists/usuarios-lists.component';
import { PycListComponent } from './pyc-list/pyc-list.component';
import { ParametrosPreguntasComponent } from './pages/alumni/parametros-preguntas/parametros-preguntas.component';

const routes: Routes = [
  { path: 'graduados-list', component: GraduadosListComponent },
  { path: 'usuarios-list', component: UsuariosListsComponent },
  { path: 'pyc-list', component: PycListComponent },
  { path: 'para', component: ParametrosPreguntasComponent },
  
  {
    path: 'account',
    redirectTo: 'account/login',
    pathMatch: 'full'
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
  },
  {
    path: 'inicio', component: LayoutBaseComponent,
    children: [
      { path: '', loadChildren: () => import('./pages/start/start.module').then((m) => m.StartModule) }
    ]
  },
  {
    path: 'system', component: LayoutSystemComponent,
    children: [
      { path: 'alumni', loadChildren: () => import('./pages/alumni/alumni.module').then((m) => m.AlumniModule) },
      { path: 'admin', loadChildren: () => import('./pages/admin/admin.module').then((m) => m.AdminModule) },
      { path: 'company', loadChildren: () => import('./pages/company/company.module').then((m) => m.CompanyModule) }
    ], // Steve: Revisar esto: canActivate: [AuthGuard]
  },

  // Ruta para manejar errores 404
  { path: '404', component: NotFoundComponent },

  // Ruta inicial
  { path: '**', redirectTo: 'inicio', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
