import { Ciudad } from "./ciudad";
import { Empresario } from "./empresario";
import { sectorempresarial } from "./sectorEmpresarial";

export class Empresa {
    id?: number;
    'empresario': String;
    'ciudad': Ciudad;
    'sectorempresarial': sectorempresarial;
    'ruc': string;
    'nombre': string;
    'tipoEmpresa': string;
    'razonSocial': string;
    'area': string;
    'ubicacion': string;
    'sitioweb': string;
    'estado'?:boolean;

}
export class Empresa2 {
    id?: number;
    'empresario': Empresario; 
    'ciudad': Ciudad;
    'sectorEmpresarial': sectorempresarial; 
    'ruc': string;
    'nombre': string;
    'tipoEmpresa': string;
    'razonSocial': string;
    'area': string;
    'ubicacion': string;
    'sitioWeb': string; 
}

