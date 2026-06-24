import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UniversidadService {
  constructor(private prisma: PrismaService) {}

  async crearCarrera(data: { nombre: string; materias: string[] }) {
    return this.prisma.$transaction(async (tx) => {
      return tx.carrera.create({
        data: {
          nombre: data.nombre,
          materias: {
            create: data.materias.map(m => ({
              nombre: m
            }))
          }
        },
        include: {
          materias: true
        }
      });
    });
  }

  async crearEstudiante(nombre: string) {
    return this.prisma.estudiante.create({
      data: { nombre }
    });
  }

  async crearMatriculas(data: { ciclo: string; activo: boolean }) {
    return this.prisma.$transaction(async (tx) => {
      const carrera = await tx.carrera.findFirst({
        include: { materias: true },
        orderBy: { id: 'desc' }
      });

      const estudiantes = await tx.estudiante.findMany();

      if (!carrera || estudiantes.length === 0) {
        throw new Error('Faltan datos');
      }

      const ciclo = await tx.ciclo.create({
        data: {
          nombre: data.ciclo,
          activo: data.activo
        }
      });

      const materia = carrera.materias[0];

      const matriculas = await tx.matricula.createMany({
        data: estudiantes.map(e => ({
          estudianteId: e.id,
          carreraId: carrera.id,
          cicloId: ciclo.id,
          materiaId: materia.id,
          activa: true
        }))
      });

      return {
        ciclo,
        carrera: carrera.nombre,
        estudiantes,
        matriculas: matriculas.count
      };
    });
  }

  async crearLaboratorio(nombre: string) {
    return this.prisma.$transaction(async (tx) => {
      const ciclo = await tx.ciclo.findFirst({
        where: { activo: true }
      });

      const matricula = await tx.matricula.findFirst({
        where: { activa: true }
      });

      if (!ciclo || !matricula) {
        throw new Error('Datos incompletos');
      }

      const laboratorio = await tx.laboratorio.create({
        data: { nombre }
      });

      return tx.asignacionLab.create({
        data: {
          laboratorioId: laboratorio.id,
          cicloId: ciclo.id,
          materiaId: matricula.materiaId
        }
      });
    });
  }
}