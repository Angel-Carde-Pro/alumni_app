import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import{LoginComponent} from './login/login.component';
import { FormpreguntaasComponent } from './formpreguntaas/formpreguntaas.component';
import { RegisterComponent } from './register/register.component';
import { PerfiluserComponent } from './perfiluser/perfiluser.component';
import { PostulacionesComponent } from './pages/postulaciones/postulaciones.component';
import { VisualizarcvComponent } from './visualizarcv/visualizarcv.component';
import { DetallescandidatoComponent } from './detallescandidato/detallescandidato.component';
import { ParametrospreguntasComponent } from './parametrospreguntas/parametrospreguntas.component';
import { GraficosComponent } from './graficos/graficos.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {path: 'login',component: LoginComponent},
  { path: 'preguntas', component: FormpreguntaasComponent},
  {path: 'register',component: RegisterComponent},
  {path: 'perfil-usuario',component: PerfiluserComponent},
  {path:'postulaciones',component:PostulacionesComponent},
  {path: 'curriculum',component:VisualizarcvComponent},
  {path: 'candidato-details',component:DetallescandidatoComponent},
  {path:'parametros-preguntas', component:ParametrospreguntasComponent},
  {path:'graficos', component:GraficosComponent},
  
 // { path: 'register-provincias', component: RegistroProvinciasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
