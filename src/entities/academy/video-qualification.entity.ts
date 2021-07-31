import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { Client } from "../client/client.entity";
import { Video } from "./video.entity";

@Entity('video_qualification', { schema: 'academy' })
export class VideoQualification {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('int')
  value: number

  @ManyToOne(() => Video, video => video.qualifications, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'fk_video' })
  video: Video

  @ManyToOne(() => Client, client => client.qualifications, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_client' })
  client: Client

}