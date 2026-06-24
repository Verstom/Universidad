import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UniversidadService {
  constructor(private prisma: PrismaService) {}

  
  async registrarCarrera() {
    return this.prisma.$transaction(async (tx) => {
      const carrera = await tx.carrera.create({
        data: {
          nombre: 'Desarrollo de Software',
          materias: {
            create: [
              { nombre: 'Programacion 1' },
              { nombre: 'Programacion 2' },
              { nombre: 'Base de Datos' },
            ],
          },
        },
        include: {
          materias: true,
        },
      });

      return carrera;
    });
  }

  
  async registrarEstudiante(nombre: string) {
    return this.prisma.estudiante.create({
      data: {
        nombre,
      },
    });
  }

  
  async registrarMatriculas() {
    return this.prisma.$transaction(async (tx) => {
      const carrera = await tx.carrera.findFirst({
        where: {
          nombre: 'Desarrollo de Software',
        },
        include: {
          materias: true,
        },
        orderBy: {
          id: 'desc',
        },
      });

      if (!carrera) {
        throw new Error('La carrera no existe');
      }

      if (carrera.materias.length === 0) {
        throw new Error('La carrera no tiene materias');
      }

      const estudiantes = await tx.estudiante.findMany();

      if (estudiantes.length === 0) {
        throw new Error('No hay estudiantes registrados');
      }

      const ciclo = await tx.ciclo.create({
        data: {
          nombre: '2026-2027',
          activo: true,
        },
      });

      const materia = carrera.materias[0];

      const datosMatriculas = estudiantes.map((estudiante) => ({
        activa: true,
        estudianteId: estudiante.id,
        carreraId: carrera.id,
        cicloId: ciclo.id,
        materiaId: materia.id,
      }));

      const matriculas = await tx.matricula.createMany({
        data: datosMatriculas,
      });

      return {
        ciclo,
        carrera: carrera.nombre,
        materia: materia.nombre,
        cantidadMatriculas: matriculas.count,
      };
    });
  }

  
  async registrarLaboratorio() {
    return this.prisma.$transaction(async (tx) => {
      const ciclo = await tx.ciclo.findFirst({
        where: {
          activo: true,
        },
        orderBy: {
          id: 'desc',
        },
      });

      if (!ciclo) {
        throw new Error('No hay un ciclo activo');
      }

      const matricula = await tx.matricula.findFirst({
        where: {
          cicloId: ciclo.id,
          activa: true,
        },
      });

      if (!matricula) {
        throw new Error('No hay matriculas activas');
      }

      let laboratorio = await tx.laboratorio.findFirst();

      if (!laboratorio) {
        laboratorio = await tx.laboratorio.create({
          data: {
            nombre: 'Laboratorio 1',
          },
        });
      }

      const asignacion = await tx.asignacionLab.create({
        data: {
          laboratorioId: laboratorio.id,
          cicloId: ciclo.id,
          materiaId: matricula.materiaId,
        },
        include: {
          laboratorio: true,
          ciclo: true,
          materia: true,
        },
      });

      return asignacion;
    });
  }
}
