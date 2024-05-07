import { Component, EventEmitter, Output } from '@angular/core';
import { Graduado, Graduado1 } from '../../../data/model/graduado';
import { Subject } from 'rxjs';
import { GraduadoService } from '../../../data/service/graduado.service';
import { Usuario } from '../../../data/model/usuario';
import { Ciudad } from '../../../data/model/ciudad';
import { Rol } from '../../../data/model/rol';
import { Persona } from '../../../data/model/persona';
import { Provincia } from '../../../data/model/provincia';
import { UserService } from '../../../data/service/UserService';
import { CarreraService } from '../../../data/service/carrera.service';
import { Observable } from 'rxjs';

interface SelectionMap {
  [key: string]: boolean;
}

@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.component.html',
  styleUrls: ['comunidad.component.css']
})
export class ComunidadComponent {
  selectedGraduado: any;
  selectedCareer: string = '';
  public careerNames!: Observable<string[]>;
  public urlImage: string = '';
  public rutaimagen: string = '';
  public graduadoid: number = 0;
  public idstring: string = '';
  public nombres: string = '';
  public apellidos: string = '';
  edad: number = 0;
  fechaNacimiento: string = "";

  filteredGraduadosList: Graduado1[] = [];
  suggestions: Graduado1[] = [];
  searchTerm: string = '';
  resultadoNumber: number = 0;
  selectedCareersMap: SelectionMap = {};

  careerNameList: any[] = [];
  careerNameLists: { [idGraduado: number]: string[] } = {};

  graduado: Graduado1 = { id: 0, usuario: new Usuario(), ciudad: new Ciudad(), anioGraduacion: new Date(), emailPersonal: '', estadoCivil: '', rutaPdf: '', urlPdf: '' };

  graduadosList: Graduado1[] = [];

  public isTable: boolean = false;
  public filtersVisible: boolean = false;
  filtroFechaGraduacion: Date | null = null;

  constructor(
    private graduadoService: GraduadoService,
    private userservice: UserService,
    private carreraService: CarreraService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.getCareerNames3();
  }

  loadData() {
    const userId = localStorage.getItem('user_id');
    this.graduadoService.getGraduadosNotIn(userId ? parseInt(userId) : 0).subscribe(
      (result) => {
        this.graduadosList = result;
        this.filteredGraduadosList = result;
        this.incrementarResultado(result.length);
        this.graduadosList.forEach((graduado) => {
          this.getCareerName(graduado.id);
        });
      },
    );
  }

  incrementarResultado(valorFinal: number) {
    const interval = setInterval(() => {
      if (this.resultadoNumber < valorFinal) {
        this.resultadoNumber += 2;
      } else {
        clearInterval(interval);
      }
    }, 60);
  }

  openFilters(): void {
    this.filtersVisible = !this.filtersVisible;
    const filtersToggle = document.querySelector('.filters-toggle');

    if (filtersToggle) {
      filtersToggle.classList.toggle('is-open');
      filtersToggle.classList.remove('active');
    }
  }

  openSelectedFilters(): void {
    const filtersToggle = document.querySelector('.ui-dropdown__content');

    if (filtersToggle) {
      filtersToggle.classList.toggle('active');
    }
  }

  toggleModeView(state: boolean): void {
    this.isTable = state;
  }

  onSearchInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.searchTerm = inputValue;
    this.updateFilteredGraduadosList();
    this.updateSuggestions();
  }

  updateSuggestions(): void {
    if (this.searchTerm.trim() !== '') {
      this.suggestions = this.filteredGraduadosList.slice(0, 5);
    } else {
      this.suggestions = [];
    }
  }

  selectSuggestion(suggestion: Graduado1): void {
    // Asigna la sugerencia seleccionada al término de búsqueda
    this.searchTerm = `${suggestion.usuario.persona.primerNombre} ${suggestion.usuario.persona.apellidoPaterno}`;

    // Filtra la lista de graduados según la sugerencia seleccionada
    this.filteredGraduadosList = this.graduadosList.filter(graduado =>
      graduado.id === suggestion.id
    );

    // Actualiza el número de resultados
    this.resultadoNumber = this.filteredGraduadosList.length;

    // Limpia las sugerencias
    this.suggestions = [];
  }

  updateFilteredGraduadosList(): void {
    if (this.searchTerm.trim() !== '') {
      this.filteredGraduadosList = this.graduadosList.filter(graduado => {
        const graduadoPlano = this.mapGraduadoToSearchableObject(graduado);
        return Object.values(graduadoPlano).some(value =>
          (typeof value === 'string' && value.toLowerCase().includes(this.searchTerm.toLowerCase()))
        );
      });
    } else {
      this.filteredGraduadosList = this.graduadosList;
    }
  }

  clearSearchTerm(): void {
    this.searchTerm = '';
    this.updateFilteredGraduadosList();
    this.suggestions = [];

    this.resultadoNumber = this.graduadosList.length;
  }

  buscarBtn(event: Event): void {
    this.suggestions = [];
  }

  private mapGraduadoToSearchableObject(graduado: Graduado1): any {
    const careerNames = this.careerNameLists[graduado.id!] || [];
    return {
      id: graduado.id,
      nombreUsuario: graduado.usuario.nombreUsuario,
      primerNombre: graduado.usuario.persona.primerNombre,
      segundoNombre: graduado.usuario.persona.segundoNombre,
      apellidoPaterno: graduado.usuario.persona.apellidoPaterno,
      apellidoMaterno: graduado.usuario.persona.apellidoMaterno,
      cedula: graduado.usuario.persona.cedula,
      telefono: graduado.usuario.persona.telefono,
      emailPersonal: graduado.emailPersonal,
      anioGraduacion: graduado.anioGraduacion,
      estadoCivil: graduado.estadoCivil,
      ciudad: graduado.ciudad.nombre,
      provincia: graduado.ciudad.provincia.nombre,
      pais: graduado.ciudad.provincia.pais,
      carreras: careerNames.join(', ')
    };
  }

  startDate: Date | null = null;

  getCareerNames3(): void {
    this.careerNames = this.carreraService.getCarrerasNombres();
  }

  applyFilters(): void {
    this.openSelectedFilters();

    this.filteredGraduadosList = this.graduadosList.filter(graduado => {
      const graduationDate = new Date(graduado.anioGraduacion).getTime();

      console.log("FECHA: " + this.startDate)
      // Obtenemos el rango de fechas seleccionado por el usuario
      const startDate = this.startDate ? new Date(this.startDate).getTime() : null;
      const endDate = startDate ? new Date(startDate).setMonth(new Date(startDate).getMonth() + 1) : null;

      // Verificamos si la fecha de graduación está dentro del rango seleccionado
      const isWithinDateRange = (startDate === null || graduationDate >= startDate) &&
        (endDate === null || graduationDate < endDate);

      return isWithinDateRange;
    });
    this.resultadoNumber = this.filteredGraduadosList.length;
  }

  deleteFilters(): void {
    this.openSelectedFilters();

    this.selectedCareersMap = {};
    this.startDate = null;
    this.filteredGraduadosList = [...this.graduadosList];
    this.resultadoNumber = this.filteredGraduadosList.length;
  }

  getCareerName(idGraduado: any): void {
    this.graduadoService.getCareerListByGraduateId(idGraduado).subscribe(
      (careerNames: string[]) => {
        this.careerNameLists[idGraduado] = careerNames;
      }
    );
  }

  getCareerNames(idGraduado: any): string[] {
    const careers = this.careerNameList.filter(career => career[0] === idGraduado);
    console.log(idGraduado)
    console.log(careers);
    return careers.map(career => career[1]);
  }

  loadUserDataByUsername() {
    const storedRutaImagen = localStorage.getItem('rutaImagen');
    const storedUrlImagen = localStorage.getItem('urlImagen');
    if (storedRutaImagen && storedUrlImagen) {
      this.rutaimagen = storedRutaImagen;
      this.urlImage = storedUrlImagen;
    } else {
      console.error('La información de imagen no está disponible en localStorage.');
    }
  }

  showGraduadoDetails(graduado: Graduado1) {
    this.selectedGraduado = graduado;
    this.fechaNacimiento = this.selectedGraduado.usuario.persona.fechaNacimiento;
    this.calcularEdad();
  }

  calcularEdad() {
    const fechaNacimientoObj = new Date(this.fechaNacimiento);
    const fechaActual = new Date();
    const diferenciaEnMilisegundos = fechaActual.getTime() - fechaNacimientoObj.getTime();
    const aniosTranscurridos = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24 * 365.25);
    this.edad = Math.floor(aniosTranscurridos);
  }

  contactarPorWhatsapp(numeroTelefono: string): void {
    const numeroCorregido = numeroTelefono.substring(1);
    const numeroConCodigoPais = `593${numeroCorregido}`;
    const mensaje = "Hola, estoy interesado en contactarte.";
    const enlaceWhatsapp = `https://wa.me/${numeroConCodigoPais}?text=${encodeURIComponent(mensaje)}`;
    window.open(enlaceWhatsapp, "_blank");
  }
}