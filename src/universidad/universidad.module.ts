import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UniversidadController } from './universidad.controller';
import { UniversidadService } from './universidad.service';

@Module({
  imports: [PrismaModule],
  controllers: [UniversidadController],
  providers: [UniversidadService],
  exports: [UniversidadService],
})
export class UniversidadModule {}
