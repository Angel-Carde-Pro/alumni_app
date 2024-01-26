import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OfertasLaboralesComponent } from './ofertas-laborales/ofertas-laborales.component';
import { CrudEmpresasComponent } from './crud-empresas/crud-empresas.component';
import { EmpresasComponent } from './empresas/empresas.component';

const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'postulaciones_form', component: OfertasLaboralesComponent },
    { path: 'empresas', component: CrudEmpresasComponent },
    { path: 'crud', component: EmpresasComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CompanyRoutingModule { }