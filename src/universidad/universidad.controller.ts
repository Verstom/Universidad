import { Controller, Post, Body } from '@nestjs/common';
import { UniversidadService } from './universidad.service';

@Controller('universidad')
export class UniversidadController {
  constructor(private readonly universidadService: UniversidadService) {}

  @Post('carrera')
  crearCarrera(@Body() data: { nombre: string; materias: string[] }) {
    return this.universidadService.crearCarrera(data);
  }

  @Post('estudiante')
  crearEstudiante(@Body() data: { nombre: string }) {
    return this.universidadService.crearEstudiante(data.nombre);
  }

  @Post('matriculas')
  crearMatriculas(@Body() data: { ciclo: string; activo: boolean }) {
    return this.universidadService.crearMatriculas(data);
  }

  @Post('laboratorio')
  crearLaboratorio(@Body() data: { nombre: string }) {
    return this.universidadService.crearLaboratorio(data.nombre);
  }
}