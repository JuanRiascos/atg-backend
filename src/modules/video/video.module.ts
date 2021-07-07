import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Client } from 'src/entities/client/client.entity';
import { Video } from 'src/entities/academy/video.entity';
import { PlaylistService } from './services/playlist/playlist.service';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { ExtraReps } from 'src/entities/academy/extra-reps.entity';
import { CaseStudies } from 'src/entities/academy/case-studies.entity';
import { ViewVideos } from 'src/entities/academy/views-videos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Video, Client, ExtraReps, CaseStudies, ViewVideos]), HttpModule],
  controllers: [VideoController],
  providers: [VideoService, PlaylistService]
})
export class VideoModule { }
