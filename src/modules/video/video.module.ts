import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Client } from 'src/entities/client/client.entity';
import { Video } from 'src/entities/academy/video.entity';
import { VideoQualification } from 'src/entities/academy/video-qualification.entity';
import { PlaylistService } from './services/playlist.service';
import { VideoController } from './video.controller';
import { VideoCheckController } from './check.controller';
import { VideoService } from './services/video.service';
import { ExtraReps } from 'src/entities/academy/extra-reps.entity';
import { CaseStudies } from 'src/entities/academy/case-studies.entity';
import { ViewVideos } from 'src/entities/academy/views-videos.entity';
import { Check } from 'src/entities/academy/check.entity';
import { CheckService } from './services/check.service';
import { CheckClient } from 'src/entities/academy/check-client.entity';
 
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Video,
      Client,
      ExtraReps,
      CaseStudies,
      ViewVideos,
      Check,
      VideoQualification,
      CheckClient
    ]),
    HttpModule
  ],
  controllers: [VideoController, VideoCheckController],
  providers: [VideoService, PlaylistService, CheckService]
})
export class VideoModule { }
