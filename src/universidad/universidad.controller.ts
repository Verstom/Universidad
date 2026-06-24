import { Controller, Post, Body } from '@nestjs/common';
import { UniversidadService } from './universidad.service';

@Controller('universidad')
export class UniversidadController {
  constructor(private readonly universidadService: UniversidadService) {}

  @Post('carrera')
  crearCarrera(@Body() { nombre, materias }: { nombre: string; materias: string[] }) {
    return this.universidadService.crearCarrera({ nombre, materias });
  }

  @Post('estudiante')
  crearEstudiante(@Body() { nombre }: { nombre: string }) {
    return this.universidadService.crearEstudiante(nombre);
  }

  @Post('matriculas')
  crearMatriculas(@Body() { ciclo, activo }: { ciclo: string; activo: boolean }) {
    return this.universidadService.crearMatriculas({ ciclo, activo });
  }

  @Post('laboratorio')
  crearLaboratorio(@Body() { nombre }: { nombre: string }) {
    return this.universidadService.crearLaboratorio(nombre);
  }
}