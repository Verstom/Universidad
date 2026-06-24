import { Body, Controller, Post } from '@nestjs/common';
import { UniversidadService } from './universidad.service';

@Controller('universidad')
export class UniversidadController {
  constructor(private universidadService: UniversidadService) {}

  @Post('registrar-carrera')
  registrarCarrera() {
    return this.universidadService.registrarCarrera();
  }

  @Post('registrar-estudiante')
  registrarEstudiante(@Body() datos: { nombre: string }) {
    return this.universidadService.registrarEstudiante(datos.nombre);
  }

  @Post('registrar-matriculas')
  registrarMatriculas() {
    return this.universidadService.registrarMatriculas();
  }

  @Post('registrar-laboratorio')
  registrarLaboratorio() {
    return this.universidadService.registrarLaboratorio();
  }
}
