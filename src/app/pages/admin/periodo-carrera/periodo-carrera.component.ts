import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PeriodoService } from '../../../data/service/periodo.service';
import { CarreraService } from '../../../data/service/carrera.service';
import { Periodo } from '../../../data/model/periodo';
import { Carrera } from '../../../data/model/carrera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-periodo-carrera',
  templateUrl: './periodo-carrera.component.html',
  styleUrl: './periodo-carrera.component.css'
})
export class PeriodoCarreraComponent implements OnInit {

  @ViewChild('searchInput') searchInput!: ElementRef;

  ngOnInit(): void {
    this.getAllPeriods();
    this.getAllCareers();
    this.inicializateDropDown();
  }

  inicializateDropDown(): void {
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'nombre',
      selectAllText: 'Seleccionar Todo',
      unSelectAllText: "Quitar Todo",
      itemsShowLimit: 6,
      allowSearchFilter: this.ShowFilter
    };
  }
  registerPeriodForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private periodService: PeriodoService,
    private careerService: CarreraService) {

    this.registerPeriodForm = formBuilder.group({
      nombrePeriodo: ['', Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      carreras: [[Carrera], Validators.required],
      city: [this.selectedItems]
    });
  }

  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  selectedItems: Carrera[] = [];
  dropdownSettings: any = {};
  periodList: Periodo[] = [];
  careerList: Carrera[] = [];
  period: Periodo = new Periodo();
  newPeriod: Periodo = new Periodo();
  editMode: boolean = false;

  originalCareerList: Carrera[] = [];
  originalPeriodList: Periodo[] = [];

  getAllPeriods(): void {
    this.periodService.getPeriodos().subscribe(data => {
      this.periodList = data;
    });
  }

  getCareerNames(carreras: Carrera[]): string {
    return carreras.map(carrera => carrera.nombre).join(' | ');
  }

  getAllCareers(): void {
    this.careerService.getCarreras().subscribe(data => {
      this.careerList = data;
    });
  }
 
  ngAfterViewInit(): void {
    this.searchInput.nativeElement.addEventListener('input', () => {
      const filterText = this.searchInput.nativeElement.value;
      this.filterPeriods(filterText);
      this.filterCareers(filterText);
    });
  }

  filterPeriods(filterText: string): void {
    if (!filterText.trim()) {
      this.getAllPeriods();
    } else {
      this.periodList = this.filteredPeriodList(filterText);
    }
  }
  
  filteredPeriodList(filterText: string): Periodo[] {
    return this.periodList.filter(period =>
      period.nombre.toLowerCase().includes(filterText.toLowerCase())
    );
  }

  filterCareers(filterText: string): void {
    if (!filterText.trim()) {
      this.getAllCareers();
    } else {
      this.careerList = this.filteredList(filterText);
    }
  }

  filteredList(filterText: string): Carrera[] {
    return this.careerList.filter(career =>
      career.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
      career.descripcion.toLowerCase().includes(filterText.toLowerCase())
    );
  }

  createPeriod(): void {
    this.editMode = false;
    if (this.registerPeriodForm.valid) {
      const formData = this.registerPeriodForm.value;
      this.period = {
        nombre: formData.nombrePeriodo,
        estado: true,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        carreras: formData.carreras
      }
      this.periodService.createPeriodo(this.period).subscribe(response => {
        this.getAllPeriods();
        Swal.fire({
          icon: 'success',
          text: 'Período creado'
        });
        this.registerPeriodForm.reset();
        this.closeModal();
      })
    }
  }

  catchPeriod(period: Periodo): void {
    this.editMode = true;
    if (period) {
      const periodEdit: Periodo = { ...period };

      this.registerPeriodForm.patchValue({
        nombrePeriodo: periodEdit.nombre,
        fecha_inicio: periodEdit.fecha_inicio,
        fecha_fin: periodEdit.fecha_fin,
        carreras: periodEdit.carreras
      });
      this.newPeriod = period;
    }
  }

  UpdatePeriod(): void {
    const id = this.newPeriod.id;
    if (id !== undefined) {
      const formData = this.registerPeriodForm.value;

      const periodEdit = {
        id: id,
        nombre: formData.nombrePeriodo,
        estado: this.newPeriod.estado,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        carreras: formData.carreras
      };
      this.editPeriodEndPoint(id, periodEdit);
    } else {
      console.error('Fatal Error: No se proporcionó un ID válido.');
    }
  }

  editPeriodEndPoint(id: any, period: Periodo) {
    this.periodService.updatePeriod(id, period).subscribe(updatedPeriod => {
      const index = this.periodList.findIndex(u => u.id === updatedPeriod.id);
      this.getAllPeriods();
      if (index !== -1) {
        this.periodList[index] = updatedPeriod;
      }
      Swal.fire({
        icon: 'success',
        text: 'Período actualizado'
      });
      this.registerPeriodForm.reset();
      this.closeModal();
    });
  }

  updateStatePeriod(id: any, period: Periodo): void {
    this.periodService.updatePeriod(id, period).subscribe(updatedPeriodState => {
      const index = this.periodList.findIndex(u => u.id === updatedPeriodState.id);
      this.getAllPeriods();
      if (index !== -1) {
        this.periodList[index] = updatedPeriodState;
      }
    });
  }

  toggleSwitch(periodState: Periodo): void {
    periodState.estado = !periodState.estado;
    this.updateStatePeriod(periodState.id, periodState);
  }

  toogleShowFilter() {
    this.ShowFilter = !this.ShowFilter;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
  }

  handleLimitSelection() {
    if (this.limitSelection) {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
    } else {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
    }
  }

  closeModal() {
    const cancelButton = document.getElementById('close-button') as HTMLElement;
    if (cancelButton) {
      cancelButton.click();
    }
  }

}
