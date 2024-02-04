import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Experiencia } from '../../../data/model/experiencia';
import { ExperienciaService } from '../../../data/service/experiencia.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { InputsValidations } from '../../../components/Validations/InputsValidations';

@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css', '../../../../assets/prefabs/headers.css']
})
export class ExperienciaComponent {
  public cedula: string = '';

  experiencia: Experiencia = { cedulaGraduado: '', cargo: '', duracion: '', institucionNombre: '', actividad: '', area_trabajo: '' };
  experienciaCarga: Experiencia = { id: 0, cedulaGraduado: '', cargo: '', duracion: '', institucionNombre: '', actividad: '', area_trabajo: '' };
  experienciaList: Experiencia[] = [];
  editarClicked = false;

  dtoptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  mensajeMostrado = false;
  idEdit: number = 0;

  @Output() onClose: EventEmitter<string> = new EventEmitter();

  constructor(public bsModalRef: BsModalRef, private experienciaService: ExperienciaService) { }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit(): void {
    this.obtenerCedula();
    this.loadExperiencias();
  }

  setupDtOptions() {
    this.dtoptions = {
      pagingType: 'full_numbers',
      searching: true,
      lengthChange: true,
      language: {
        search: 'Buscar:',
        searchPlaceholder: 'Buscar experiencia...',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
        infoEmpty: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
        paginate: {
          first: 'Primera',
          last: 'Última',
          next: 'Siguiente',
          previous: 'Anterior',
        },
        lengthMenu: 'Mostrar _MENU_ registros por página',
        zeroRecords: 'No se encontraron registros coincidentes'
      },
      lengthMenu: [10, 25, 50]
    };
  }

  // NOTE: MOSTRAR LISTA DE EXPERIENCIAS

  loadExperiencias() {
    this.experienciaService.getExperiencias().subscribe(
      experiencia => {
        this.experienciaList = experiencia;
      },
      (error: any) => console.error(error),
      () => this.dtTrigger.next(null)
    );
  }


  // NOTE: CRUD EVENTS
  onRegistrarClick(): void {
    this.editarClicked = false;
  }

  onSubmit() {
    if (this.editarClicked) {
      this.onUpdateClick(); // Lógica de actualización
    } else {
      this.createExperiencia(); // Lógica de creación
    }
  }

  createExperiencia() {
    this.experiencia.cedulaGraduado = this.cedula;
    console.log('Cedula:', this.cedula);
    this.editarClicked = false;

    this.experienciaService.createExperiencia(this.experiencia).subscribe(
      experiencia => {
        console.log('Experiencia creada exitosamente:', experiencia);
        this.loadExperiencias();
        this.mostrarSweetAlert(true, 'La experiencia se ha guardado exitosamente.');
        this.mensajeMostrado = true;
      },
      error => {
        console.error('Error al crear la experiencia:', error);
        // Muestra un mensaje de error en la interfaz de usuario
        this.mostrarSweetAlert(false, 'Hubo un error al intentar guardar la experiencia. Por favor, verifica los detalles e intenta nuevamente.');
      }
    );
  }

  onEditarClick(id: number | undefined = 0): void {
    this.editarClicked = true;
    this.experienciaService.getExperienciaById(id).subscribe(
      exp => {
        this.experienciaCarga = exp;
        console.log('ID de la experiencia:', this.experienciaCarga.institucionNombre);
      },
      error => console.error(error)
    )

    this.idEdit = id;
  }

  onUpdateClick() {
    this.experienciaCarga.cedulaGraduado = this.cedula;

    this.experienciaService.updateExperiencia(this.idEdit, this.experienciaCarga).subscribe(
      expActualizado => {
        console.log('Experiencia actualizada exitosamente:', expActualizado);
        this.mostrarSweetAlert(true, 'La experiencia se ha actualizado exitosamente.');
        this.loadExperiencias();
      },
      error => {
        console.error('Error al actualizar la experiencia:', error);
        this.mostrarSweetAlert(false, 'Error al actualizar la experiencia.');
      }
    );
  }

  onDeleteClick(id: number | undefined = 0) {
    this.experienciaService.deleteExperiencia(id).subscribe(
      () => {
        console.log('Experiencia eliminada exitosamente');
        this.mostrarSweetAlert(true, 'La experiencia se ha eliminado exitosamente.');
        this.loadExperiencias();
      },
      error => {
        console.error('Error al eliminar la experiencia:', error);
        this.mostrarSweetAlert(false, 'Error al eliminar la experiencia.');
      }
    );
  }

  // NOTE: VALIDACIONES

  validarNumero(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  allowOnlyLetters(event: KeyboardEvent): void {
    const inputChar = String.fromCharCode(event.charCode);
    const lettersRegex = /^[a-zA-Z]+$/;

    if (!lettersRegex.test(inputChar)) {
      event.preventDefault();
    }
  }

  allowOnlyNumbers(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  mostrarSweetAlert(esExitoso: boolean, mensaje: string) {
    const titulo = esExitoso ? 'Completado exitosamente' : 'Se ha producido un error';

    Swal.fire({
      icon: esExitoso ? 'success' : 'error',
      title: titulo,
      text: mensaje,
      allowOutsideClick: !esExitoso,
    }).then((result) => {
      if (esExitoso || result.isConfirmed) {
        this.onClose.emit(esExitoso ? 'guardadoExitoso' : 'errorGuardado');
        this.bsModalRef.hide();
      }
    });
  }

  obtenerCedula() {
    const userDataString = localStorage.getItem('user_data');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      this.cedula = userData.persona.cedula;
    }
  }

  cerrarModal() {
    if (this.mensajeMostrado) {
      this.bsModalRef.hide();
    } else {
      console.log('Espera a que se muestre el mensaje antes de cerrar la modal.');
    }
  }
}