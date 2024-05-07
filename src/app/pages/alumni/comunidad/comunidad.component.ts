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
@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.component.html',
  styleUrls: ['comunidad.component.css']
})
export class ComunidadComponent {
  selectedGraduado: any;

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

  careerNameList: any[] = [];
  careerNameLists: { [idGraduado: number]: string[] } = {};

  graduado: Graduado1 = { id: 0, usuario: new Usuario(), ciudad: new Ciudad(), anioGraduacion: new Date(), emailPersonal: '', estadoCivil: '', rutaPdf: '', urlPdf: '' };

  graduadosList: Graduado1[] = [];

  public isTable: boolean = false;
  public filtersVisible: boolean = false;

  constructor(private graduadoService: GraduadoService, private userservice: UserService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const userId = localStorage.getItem('user_id');
    this.graduadoService.getGraduadosNotIn(userId ? parseInt(userId) : 0).subscribe(
      (result) => {
        this.graduadosList = result;
        this.filteredGraduadosList = result;
        this.graduadosList.forEach((graduado) => {
          this.getCareerName(graduado.id);
        });
      },
    );
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
    // Realiza la acción deseada con el graduado seleccionado
    console.log('Graduado seleccionado:', suggestion);

    this.searchTerm = `${suggestion.usuario.persona.primerNombre} ${suggestion.usuario.persona.apellidoPaterno}`;

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
  }

  private mapGraduadoToSearchableObject(graduado: Graduado1): any {
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
      pais: graduado.ciudad.provincia.pais
    };
  }

  private mapGraduado(graduado: Graduado1): Graduado1 {
    const usuario = new Usuario();
    usuario.id = graduado.usuario.id;
    usuario.clave = graduado.usuario.clave;
    usuario.nombreUsuario = graduado.usuario.nombreUsuario;
    usuario.estado = graduado.usuario.estado;
    usuario.urlImagen = graduado.usuario.urlImagen;
    usuario.persona = this.mapPersona(graduado.usuario.persona);
    usuario.rutaImagen = graduado.usuario.rutaImagen;
    usuario.rol = this.mapRol(graduado.usuario.rol);

    const ciudad = new Ciudad();
    ciudad.id = graduado.ciudad.id;
    ciudad.nombre = graduado.ciudad.nombre;
    ciudad.provincia = this.mapProvincia(graduado.ciudad.provincia);

    const graduadoMapped = new Graduado1();
    graduadoMapped.id = graduado.id;
    graduadoMapped.usuario = usuario;
    graduadoMapped.ciudad = ciudad;
    graduadoMapped.anioGraduacion = graduado.anioGraduacion;
    graduadoMapped.emailPersonal = graduado.emailPersonal;
    graduadoMapped.estadoCivil = graduado.estadoCivil;
    graduadoMapped.rutaPdf = graduado.rutaPdf;
    graduadoMapped.urlPdf = graduado.urlPdf;

    return graduadoMapped;
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

  private mapPersona(persona: Persona): Persona {
    const personaMapped = new Persona();
    personaMapped.id = persona.id;
    personaMapped.cedula = persona.cedula;
    personaMapped.primerNombre = persona.primerNombre;
    personaMapped.segundoNombre = persona.segundoNombre;

    // Verifica que fechaNacimiento sea de tipo Date antes de asignarla
    personaMapped.fechaNacimiento = persona.fechaNacimiento instanceof Date ? persona.fechaNacimiento : new Date(persona.fechaNacimiento);

    personaMapped.telefono = persona.telefono;
    personaMapped.apellidoPaterno = persona.apellidoPaterno;
    personaMapped.apellidoMaterno = persona.apellidoMaterno;

    return personaMapped;
  }


  private mapRol(rol: Rol): Rol {
    const rolMapped = new Rol();
    rolMapped.id = rol.id;
    rolMapped.nombre = rol.nombre;
    rolMapped.descripcion = rol.descripcion;

    return rolMapped;
  }

  private mapProvincia(provincia: Provincia): Provincia {
    const provinciaMapped = new Provincia();
    provinciaMapped.id = provincia.id;
    provinciaMapped.nombre = provincia.nombre;
    provinciaMapped.pais = provincia.pais;

    return provinciaMapped;
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
