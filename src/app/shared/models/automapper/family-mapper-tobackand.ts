// ============================================
// MODELOS DE DATOS
// ============================================

// Lo que espera el Backend
export interface FamiliarBackendDTO {
  tipo_documento: {
    codigo: string;
    descripcion: string;
  };
  numero_documento: string;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  tipo_parentesco: {
    codigo: string;
    descripcion: string;
  };
  telefono_contacto: string;
  correo_contacto: string;
}

// Lo que usas en el Frontend (del formulario)
export interface FamiliarFrontendModel {
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  tipoParentesco: string;
  telefonoContacto: string;
  correoElectronico: string;
  // Campos adicionales que podrías tener
  nombreCompleto?: string;
}

// ============================================
// CONFIGURACIÓN DEL MAPPER
// ============================================

import { MapperConfiguration } from './auto-mapper.service';

export const familiarMapperConfig: MapperConfiguration<FamiliarBackendDTO, FamiliarFrontendModel> = {
  mappings: [
    // Mapeo normal (Backend -> Frontend)
    { source: 'tipo_documento.codigo', target: 'tipoDocumento' },
    { source: 'numero_documento', target: 'numeroDocumento' },
    { source: 'nombre', target: 'nombre' },
    { source: 'primer_apellido', target: 'primerApellido' },
    { source: 'segundo_apellido', target: 'segundoApellido' },
    { source: 'tipo_parentesco.codigo', target: 'tipoParentesco' },
    { source: 'telefono_contacto', target: 'telefonoContacto' },
    { source: 'correo_contacto', target: 'correoElectronico' },

    // Campo calculado (solo para Frontend)
    {
      source: (src) => `${src.nombre} ${src.primer_apellido} ${src.segundo_apellido}`,
      target: 'nombreCompleto'
    }
  ],
  ignoreNullValues: false,
  ignoreUndefined: false
};

// ============================================
// CONFIGURACIÓN ESPECIAL PARA MAPEO INVERSO
// Necesaria porque el backend espera objetos anidados
// ============================================

export const familiarReverseMapperConfig: MapperConfiguration<FamiliarFrontendModel, FamiliarBackendDTO> = {
  mappings: [
    // Campos simples
    { source: 'numeroDocumento', target: 'numero_documento' },
    { source: 'nombre', target: 'nombre' },
    { source: 'primerApellido', target: 'primer_apellido' },
    { source: 'segundoApellido', target: 'segundo_apellido' },
    { source: 'telefonoContacto', target: 'telefono_contacto' },
    { source: 'correoElectronico', target: 'correo_contacto' },

    // Objeto anidado: tipo_documento
    {
      source: 'tipoDocumento',
      target: 'tipo_documento',
      transform: (codigo: string) => ({
        codigo: codigo,
        descripcion: codigo // O puedes buscar la descripción de un catálogo
      })
    },

    // Objeto anidado: tipo_parentesco
    {
      source: 'tipoParentesco',
      target: 'tipo_parentesco',
      transform: (codigo: string) => ({
        codigo: codigo,
        descripcion: codigo // O puedes buscar la descripción de un catálogo
      })
    }
  ],
  ignoreNullValues: false,
  ignoreUndefined: false
};

// ============================================
// USO EN EL COMPONENTE - VERSIÓN 1 (Mapeo Directo)
// ============================================

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutoMapperService } from './auto-mapper.service';

@Component({
  selector: 'app-autorizar-familiar',
  template: `...`
})
export class AutorizarFamiliarComponent {
  formAutorizarFamiliar: FormGroup;

  constructor(
    private fb: FormBuilder,
    private mapper: AutoMapperService,
    private familiarService: FamiliarService
  ) {
    this.formAutorizarFamiliar = this.fb.group({
      tipo_documento: ['', Validators.required],
      numero_documento: ['', Validators.required],
      nombre: ['', Validators.required],
      primer_apellido: ['', Validators.required],
      segundo_apellido: [''],
      tipo_parentesco: ['', Validators.required],
      telefono_contacto: ['', Validators.required],
      correo_electronico: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.formAutorizarFamiliar.valid) {
      // MÉTODO 1: Usando mapeo directo con configuración custom
      const frontendData: FamiliarFrontendModel = {
        tipoDocumento: this.formAutorizarFamiliar.get('tipo_documento')?.value,
        numeroDocumento: this.formAutorizarFamiliar.get('numero_documento')?.value,
        nombre: this.formAutorizarFamiliar.get('nombre')?.value,
        primerApellido: this.formAutorizarFamiliar.get('primer_apellido')?.value,
        segundoApellido: this.formAutorizarFamiliar.get('segundo_apellido')?.value,
        tipoParentesco: this.formAutorizarFamiliar.get('tipo_parentesco')?.value,
        telefonoContacto: this.formAutorizarFamiliar.get('telefono_contacto')?.value,
        correoElectronico: this.formAutorizarFamiliar.get('correo_electronico')?.value
      };

      // Transformar a formato Backend
      const backendData = this.mapper.mapDirect<FamiliarFrontendModel, FamiliarBackendDTO>(
        frontendData,
        familiarReverseMapperConfig
      );

      console.log('Datos para el backend:', backendData);
      // Resultado:
      // {
      //   tipo_documento: { codigo: 'DNI', descripcion: 'DNI' },
      //   numero_documento: '12345678A',
      //   nombre: 'Juan',
      //   primer_apellido: 'García',
      //   segundo_apellido: 'López',
      //   tipo_parentesco: { codigo: 'HIJO', descripcion: 'HIJO' },
      //   telefono_contacto: '600123456',
      //   correo_contacto: 'juan@example.com'
      // }

      // Enviar al backend
      this.familiarService.crearFamiliar(backendData).subscribe(
        response => console.log('Familiar creado', response),
        error => console.error('Error', error)
      );
    }
  }
}

// ============================================
// USO EN EL COMPONENTE - VERSIÓN 2 (Más Limpia)
// Usando el mapeo directamente desde los valores del formulario
// ============================================

@Component({
  selector: 'app-autorizar-familiar-v2',
  template: `...`
})
export class AutorizarFamiliarV2Component {
  formAutorizarFamiliar: FormGroup;

  constructor(
    private fb: FormBuilder,
    private mapper: AutoMapperService,
    private familiarService: FamiliarService
  ) {
    this.formAutorizarFamiliar = this.fb.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      nombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      tipoParentesco: ['', Validators.required],
      telefonoContacto: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.formAutorizarFamiliar.valid) {
      // Obtener valores del formulario
      const formValue = this.formAutorizarFamiliar.value as FamiliarFrontendModel;

      // Mapear a formato backend
      const backendData = this.mapper.mapDirect<FamiliarFrontendModel, FamiliarBackendDTO>(
        formValue,
        familiarReverseMapperConfig
      );

      // Enviar al backend
      this.familiarService.crearFamiliar(backendData).subscribe(
        response => console.log('Familiar creado', response),
        error => console.error('Error', error)
      );
    }
  }
}

// ============================================
// VERSIÓN 3: CON CATÁLOGOS PARA DESCRIPCIONES
// Si tienes un servicio de catálogos para obtener las descripciones
// ============================================

@Component({
  selector: 'app-autorizar-familiar-v3',
  template: `...`
})
export class AutorizarFamiliarV3Component {
  formAutorizarFamiliar: FormGroup;
  tiposDocumento: Array<{ codigo: string; descripcion: string }> = [];
  tiposParentesco: Array<{ codigo: string; descripcion: string }> = [];

  constructor(
    private fb: FormBuilder,
    private mapper: AutoMapperService,
    private familiarService: FamiliarService,
    private catalogoService: CatalogoService
  ) {
    this.formAutorizarFamiliar = this.fb.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      nombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      tipoParentesco: ['', Validators.required],
      telefonoContacto: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]]
    });

    // Cargar catálogos
    this.cargarCatalogos();
  }

  cargarCatalogos(): void {
    this.catalogoService.getTiposDocumento().subscribe(tipos => {
      this.tiposDocumento = tipos;
    });
    this.catalogoService.getTiposParentesco().subscribe(tipos => {
      this.tiposParentesco = tipos;
    });
  }

  onSubmit(): void {
    if (this.formAutorizarFamiliar.valid) {
      const formValue = this.formAutorizarFamiliar.value as FamiliarFrontendModel;

      // Configuración con descripciones reales de los catálogos
      const configConCatalogos: MapperConfiguration<FamiliarFrontendModel, FamiliarBackendDTO> = {
        mappings: [
          { source: 'numeroDocumento', target: 'numero_documento' },
          { source: 'nombre', target: 'nombre' },
          { source: 'primerApellido', target: 'primer_apellido' },
          { source: 'segundoApellido', target: 'segundo_apellido' },
          { source: 'telefonoContacto', target: 'telefono_contacto' },
          { source: 'correoElectronico', target: 'correo_contacto' },
          {
            source: 'tipoDocumento',
            target: 'tipo_documento',
            transform: (codigo: string) => {
              const tipo = this.tiposDocumento.find(t => t.codigo === codigo);
              return {
                codigo: codigo,
                descripcion: tipo?.descripcion ?? codigo
              };
            }
          },
          {
            source: 'tipoParentesco',
            target: 'tipo_parentesco',
            transform: (codigo: string) => {
              const tipo = this.tiposParentesco.find(t => t.codigo === codigo);
              return {
                codigo: codigo,
                descripcion: tipo?.descripcion ?? codigo
              };
            }
          }
        ]
      };

      const backendData = this.mapper.mapDirect<FamiliarFrontendModel, FamiliarBackendDTO>(
        formValue,
        configConCatalogos
      );

      this.familiarService.crearFamiliar(backendData).subscribe(
        response => console.log('Familiar creado', response),
        error => console.error('Error', error)
      );
    }
  }
}

// ============================================
// SERVICIO CON MAPEO INVERSO REGISTRADO
// ============================================

@Injectable({
  providedIn: 'root'
})
export class FamiliarService {
  private baseUrl = 'https://api.example.com';

  constructor(
    private http: HttpClient,
    private mapper: AutoMapperService
  ) {
    // Registrar ambas direcciones del mapeo
    this.mapper.createMap('FamiliarToBackend', familiarReverseMapperConfig);
  }

  crearFamiliar(familiar: FamiliarFrontendModel): Observable<FamiliarBackendDTO> {
    // Mapear usando configuración registrada
    const dto = this.mapper.map<FamiliarFrontendModel, FamiliarBackendDTO>(
      'FamiliarToBackend',
      familiar
    );

    return this.http.post<FamiliarBackendDTO>(`${this.baseUrl}/familiares`, dto);
  }

  actualizarFamiliar(id: number, familiar: FamiliarFrontendModel): Observable<FamiliarBackendDTO> {
    const dto = this.mapper.map<FamiliarFrontendModel, FamiliarBackendDTO>(
      'FamiliarToBackend',
      familiar
    );

    return this.http.put<FamiliarBackendDTO>(`${this.baseUrl}/familiares/${id}`, dto);
  }
}

// ============================================
// EJEMPLO COMPLETO DE FLUJO BIDIRECCIONAL
// ============================================

@Component({
  selector: 'app-editar-familiar',
  template: `...`
})
export class EditarFamiliarComponent implements OnInit {
  formAutorizarFamiliar: FormGroup;
  familiarId: number = 1;

  constructor(
    private fb: FormBuilder,
    private mapper: AutoMapperService,
    private familiarService: FamiliarService
  ) {
    this.formAutorizarFamiliar = this.fb.group({
      tipoDocumento: [''],
      numeroDocumento: [''],
      nombre: [''],
      primerApellido: [''],
      segundoApellido: [''],
      tipoParentesco: [''],
      telefonoContacto: [''],
      correoElectronico: ['']
    });
  }

  ngOnInit(): void {
    // 1. Obtener datos del backend (Backend -> Frontend)
    this.familiarService.obtenerFamiliar(this.familiarId).subscribe(
      (backendData: FamiliarBackendDTO) => {
        // Mapear de Backend a Frontend
        const frontendData = this.mapper.mapDirect<FamiliarBackendDTO, FamiliarFrontendModel>(
          backendData,
          familiarMapperConfig
        );

        // Poblar el formulario
        this.formAutorizarFamiliar.patchValue(frontendData);
      }
    );
  }

  onSubmit(): void {
    // 2. Enviar datos al backend (Frontend -> Backend)
    if (this.formAutorizarFamiliar.valid) {
      const formValue = this.formAutorizarFamiliar.value as FamiliarFrontendModel;

      // Mapear de Frontend a Backend
      const backendData = this.mapper.mapDirect<FamiliarFrontendModel, FamiliarBackendDTO>(
        formValue,
        familiarReverseMapperConfig
      );

      this.familiarService.actualizarFamiliar(this.familiarId, formValue).subscribe(
        response => console.log('Familiar actualizado', response),
        error => console.error('Error', error)
      );
    }
  }
}