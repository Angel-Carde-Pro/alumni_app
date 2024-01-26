import { Component, OnInit } from '@angular/core';
import { sectorempresarial } from '../../../Models/sectorEmpresarial';
import { SectorEmpresarialService } from '../../../service/sectorempresarial.service';
import { timeInterval } from 'rxjs';

@Component({
  selector: 'app-sector-empresarial',
  templateUrl: './sector-empresarial.component.html',
  styleUrl: './sector-empresarial.component.css'
})
export class SectorEmpresarialComponent implements OnInit {
  sectoresEmpresariales: sectorempresarial[] = [];
  nuevoSector: sectorempresarial = { nombre: '', descripcion: '' }; // Asegúrate de tener las propiedades correctas según tu modelo
  nuevoSectorCarga: sectorempresarial = { id:0 ,nombre: '', descripcion: '' }; // Asegúrate de tener las propiedades correctas según tu modelo
  nuevoSectorEdit: sectorempresarial = { id:0 ,nombre: '', descripcion: '' }; // Asegúrate de tener las propiedades correctas según tu modelo

  modoedicion: boolean = false;

  constructor(private sectorService: SectorEmpresarialService) { }

  ngOnInit(): void {
    this.cargarSectoresEmpresariales();
  }

  cargarSectoresEmpresariales() {
    this.sectorService.getSectoresEmpresariales().subscribe(
      sectores => this.sectoresEmpresariales = sectores,
      error => console.error(error)
    );
  }

  crearSectorEmpresarial() {
    this.modoedicion = false;
    this.sectorService.createSectorEmpresarial(this.nuevoSector).subscribe(
      sector => {
        console.log('Sector creado exitosamente:', sector);
        this.cargarSectoresEmpresariales(); // Recargar la lista después de crear
      },
      error => console.error('Error al crear sector:', error)
    );
  }

  abrirModalEditar(sector: sectorempresarial) {
    this.modoedicion = true;
    // Copia el objeto para evitar modificar el original
    this.nuevoSectorCarga = { ...sector };
  }
  abrirModalCrear() {
    this.modoedicion = false;
    // Copia el objeto para evitar modificar el original
  }


  editarSectorEmpresarial() {
    const id = this.nuevoSectorCarga.id; // Asegúrate de tener la propiedad 'id' en tu modelo
    if (id !== undefined) {
      this.sectorService.updateSectorEmpresarial(id, this.nuevoSectorCarga).subscribe(
        sectorActualizado => {
          console.log('Sector actualizado exitosamente:', sectorActualizado);
          // Puedes cerrar el modal u realizar otras acciones después de la actualización
          this.cargarSectoresEmpresariales();
          // También puedes reiniciar el objeto sectorParaEditar si es necesario
        },
        error => console.error('Error al actualizar sector:', error)
      );
    } else {
      console.error('Error: El ID del sector es undefined.');
    }
  }
}
