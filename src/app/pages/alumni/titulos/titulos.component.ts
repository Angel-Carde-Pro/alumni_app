import { Component, Renderer2, ViewChild } from '@angular/core';
import { AlertsService } from '../../../data/Alerts.service';
import { DataTablesService } from '../../../data/DataTables.service';
import { FiltersService } from '../../../data/Filters.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { GraduadoService } from '../../../data/service/graduado.service';
import { Titulo } from '../../../data/model/titulo';
import { TituloService } from '../../../data/service/titulo.service';
import { CarreraService } from '../../../data/service/carrera.service';
import { Carrera } from '../../../data/model/carrera';
import { Graduado3 } from '../../../data/model/graduado';
@Component({
  selector: 'app-titulos',
  templateUrl: './titulos.component.html',
  styleUrls: ['./titulos.component.css']
})
export class TitulosComponent {

  // =====================================================
  //*               DATA TABLE Y FILTROS
  // =======================================================

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  initializeTable: boolean = true;
  dtoptions: DataTables.Settings = {};
  public carrerasList: Carrera[] = [];

  // =====================================================
  //*                   VALIDACIONES
  // =======================================================

  @ViewChild('myModalClose') modalClose: any;

  @ViewChild('codeModal') codeModal!: any;

  titulosList: Titulo[] = [];

  idEdit: number = 0;

  editarClicked = false;

  validateForm: FormGroup;
  protected name: string | null = localStorage.getItem('name');

  // =====================================================
  //*                   CONSTURCTOR
  // =======================================================

  constructor(
    private fb: FormBuilder,
    private tituloService: TituloService,
    private alertService: AlertsService,
    private carrerasService: CarreraService,
    public dtService: DataTablesService,
    public filterService: FiltersService,
    private renderer: Renderer2,
    private usuarioGraduado: GraduadoService
  ) {
    this.validateForm = this.fb.group({
      nombre_titulo: ['', Validators.required],
      tipo: ['', Validators.required],
      num_registro: ['', Validators.required],
      fecha_emision: ['', Validators.required],
      fecha_registro: ['', Validators.required],
      nivel: ['', Validators.required],
      institucion: ['', Validators.required],
      nombrecarrera: ['', Validators.required]
    });
  }

  // Note: Desuscribirse del evento para evitar fugas de memoria
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // Note: Cargar la tabla con los datos despues de que la vista se haya inicializado
  ngOnInit(): void {
    const columnTitles = ['#', 'Título', 'Tipo', 'Nivel', 'Institución', 'Carrera', 'Fecha Emisión', 'Fecha Registro', '# Registro'];
    this.dtoptions = this.dtService.setupDtOptions(columnTitles, 'Buscar titulos...');

    // Para inicializar los dropdowns de los filtros de la tabla.
    this.filterService.initializeDropdowns('filterTable', columnTitles);
    this.obtenerCarreras();
    this.obtenerIDGraduado();
    this.loadData();
   
  }
 
  
  ngAfterViewInit(): void {
    this.filterService.setDtElement(this.dtElement);
  }
  loadData() {
    this.tituloService.get().subscribe(
      result => {
        this.titulosList = [];
        this.titulosList = result;
        

        this.titulosList = result.filter(resultData => resultData.idGraduado === this.numeroUndefinido);

        if (this.initializeTable) {
          this.dtTrigger.next(null);
          this.initializeTable = false;
        } else {
          this.dtService.rerender(this.dtElement, this.dtTrigger);
        }
      },
      (error: any) => console.error(error)
    );
  }

  // NOTE: CRUD EVENTS
  onRegistrarClick(): void {
    this.validateForm.reset();

    this.alertService.resetInputsValidations(this.renderer);
    this.filterService.selectFirstItem('careersList');

    this.editarClicked = false;
  }

  onEditarClick(id: number | undefined = 0): void {
    this.editarClicked = true;

    this.validateForm.reset();

    const dataToEdit = this.titulosList.find(item => item.id === id);

    if (dataToEdit) {
      this.validateForm.patchValue({
        nombreTitulo: dataToEdit.nombreTitulo,
        tipo: dataToEdit.tipo,
        numRegistro: dataToEdit.numRegistro,
        fechaEmision: dataToEdit.fechaEmision,
        fechaRegistro: dataToEdit.fechaRegistro,
        nivel: dataToEdit.nivel,
        institucion: dataToEdit.institucion
      });

      this.filterService.selectItemByName('careersList', dataToEdit.nombreCarrera);
    } else {
      console.error(`Elemento con id ${id} no encontrado en la lista.`);
    }

    this.alertService.resetInputsValidations(this.renderer);
    this.idEdit = id;
  }

  onSubmit() {
    if (!this.validateForm.valid) {
      this.alertService.showInputsValidations(this.renderer);
      return;
    }
    if (this.editarClicked) {
      this.onUpdateClick();
    } else {
      this.createNewData();
    }
  }

  obtenerDatosFormulario(): any {
    // Buscar en la lista de carreras para encontrar el id correspondiente al nombre seleccionado
    // const carreraSeleccionada = this.carrerasList.find(carrera => carrera.nombre === this.validateForm.value.nombrecarrera[0].item_text);
    return {
      nombre_titulo: this.validateForm.value.nombre_titulo,
      tipo: this.validateForm.value.tipo,
      num_registro: this.validateForm.value.num_registro.toString(),
      fecha_emision: this.validateForm.value.fecha_emision,
      fecha_registro: this.validateForm.value.fecha_registro,
      nivel: this.validateForm.value.nivel,
      institucion: this.validateForm.value.institucion,
      nombrecarrera: this.validateForm.value.nombrecarrera[0].item_text,
      idgraduado: this.numeroUndefinido
    };
  }


  createNewData() {
    this.alertService.mostrarAlertaCargando('Guardando...');
    console.log("DATOS: " + this.obtenerDatosFormulario());
    this.tituloService.create(this.obtenerDatosFormulario()).subscribe(
      result => {
        this.alertService.mostrarSweetAlert(true, 'Creado correctamente.', this.modalClose);
        this.loadData();
      },
      error => {
        this.alertService.mostrarSweetAlert(false, 'Error al crear.');
        console.error('Error al crear:', error);
      }
    );
  }

  onUpdateClick() {
    this.alertService.mostrarAlertaCargando('Actualizando...');
    console.log("DATOS: " + this.obtenerDatosFormulario());
    this.tituloService.update(this.idEdit, this.obtenerDatosFormulario()).subscribe(
      result => {
        this.alertService.mostrarSweetAlert(true, 'Actualizado correctamente.', this.modalClose);
        this.loadData();
      },
      error => {
        this.alertService.mostrarSweetAlert(false, 'Error al actualizar.');
      }
    );
  }

  onDeleteClick(id: number | undefined = 0) {
    this.alertService.mostrarAlertaCargando('Eliminando...');

    this.tituloService.delete(id).subscribe(
      () => {
        this.alertService.mostrarSweetAlert(true, 'Se ha eliminado correctamente.');

        this.loadData();
      },
      error => {
        this.alertService.mostrarSweetAlert(false, 'Error al eliminar.');
      }
    );
  }
  public numeroUndefinido?: number;
  obtenerIDGraduado(): void {
    console.log("usuario:", this.name);

    this.usuarioGraduado.getGraduadoByUsuario(this.name).subscribe(
        (graduado: Graduado3 | null) => {
            console.log("Id de graduado:", graduado?.id);
            if (graduado && graduado.id) {
                this.numeroUndefinido = graduado.id;
            }
            console.log("Id de graduado retorna:", this.numeroUndefinido);
        },
        (error: any) => {
            console.error(error);
        }
    );
}
  
  
  obtenerCarreras() {
    this.carrerasService.getCarreras().subscribe(
      carreras => {
        this.carrerasList = carreras;

        // Para inicializar los dropdowns de las diferentes carreras.
        this.filterService.initializeDropdowns('careersList', this.carrerasList.map(carrera => carrera.nombre), true);
      },
      (error: any) => console.error(error)
    );
  }
}