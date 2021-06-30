import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/entities/academy/course.entity';
import { CourseController } from './course.controller';
import { FindService } from './services/find.service';
import { ManageService } from './services/manage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    HttpModule
  ],
  controllers: [CourseController],
  providers: [FindService, ManageService]
})
export class CourseModule { }
