import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsController } from './utils.controller';
import { UtilsService } from './utils.service';
import { Versions } from 'src/entities/utils/versions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Versions
    ])
  ],
  controllers: [UtilsController],
  providers: [UtilsService],
  exports: [TypeOrmModule]
})
export class UtilsModule {
}