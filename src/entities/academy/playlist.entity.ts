import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatePlaylist } from "../@enums/index.enum";
import { Client } from "../client/client.entity";
import { Video } from "./video.entity";

@Entity('playlist', { schema: 'academy' })
export class Playlist {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('enum', { enum: StatePlaylist, name: "state_playlist", nullable: true })
  statePlaylist: StatePlaylist

  @ManyToOne(() => Client, client => client.playlist, {
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'fk_client' })
  client: Client;

  @ManyToOne(() => Video, video => video.playlist, {
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'fk_video' })
  video: Video;

}