import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Client } from 'src/entities/client/client.entity';
import { Video } from 'src/entities/academy/video.entity';
import { PlaylistService } from './services/playlist/playlist.service';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [TypeOrmModule.forFeature([Video, Client]), HttpModule],
  controllers: [VideoController],
  providers: [VideoService, PlaylistService]
})
export class VideoModule {}
