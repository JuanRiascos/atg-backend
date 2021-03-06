import {
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  ManyToMany,
} from "typeorm";

import { States } from "../@enums/index.enum";
import { AssessmentClientTry } from "../academy/assessment-client-try.entity";
import { CaseStudies } from "../academy/case-studies.entity";
import { CheckClient } from "../academy/check-client.entity";
import { Check } from "../academy/check.entity";
import { ClientQuestion } from "../academy/client-question.entity";
import { ExtraReps } from "../academy/extra-reps.entity";
import { Interest } from "../academy/interest.entity";
import { VideoQualification } from "../academy/video-qualification.entity";
import { Playlist } from "../academy/playlist.entity";
import { Video } from "../academy/video.entity";
import { ViewCaseStudies } from "../academy/views-case-studies.entity";
import { ViewExtraReps } from "../academy/views-extra-reps.entity";
import { ViewVideos } from "../academy/views-videos.entity";
import { Subscription } from "../payment/subscription.entity";
import { User } from "../user/user.entity";
import { PaymentHistory } from "./payment-history.entity";
import { SessionClient } from "./session-client.entity";
import { StatusNotification } from "./status-notification.entity";

@Entity("client", { schema: 'client' })
export class Client {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("enum", { enum: States, default: States.Active })
  state: States;

  @Column("character varying", { name: "id_customer_stripe", nullable: true })
  idCustomerStripe: string;

  @Column('simple-json', { nullable: true })
  city: any

  @OneToOne(
    () => User,
    user => user.client,
    { nullable: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'fk_user' })
  user: User;

  @OneToOne(
    () => User,
    user => user.client
  )
  @JoinColumn({ name: 'fk_status_notification' })
  statusNotification: StatusNotification;

  @OneToMany(() => PaymentHistory, paymentHistory => paymentHistory.client)
  payments: PaymentHistory[]

  @ManyToMany(() => Interest, interest => interest.clients, {
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
  })
  interests: Interest[];

  @OneToMany(() => ClientQuestion, clientQuestion => clientQuestion.client)
  clientQuestion: ClientQuestion[]

  @OneToMany(() => AssessmentClientTry, trys => trys.client)
  trys: AssessmentClientTry[]

  @OneToMany(() => Subscription, subscription => subscription.client)
  subscriptions: Subscription[];

  /* @OneToMany(() => Playlist, playlist => playlist.client)
  playlist: Playlist[]; */

  @ManyToMany(type => Video, video => video.clients, {
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
  })
  videos: Video[];

  @ManyToMany(type => CaseStudies, caseStudies => caseStudies.clients, {
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
  })
  caseStudies: CaseStudies[];

  @ManyToMany(type => ExtraReps, extraReps => extraReps.clients, {
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
  })
  extraReps: ExtraReps[];

  @OneToMany(() => SessionClient, session => session.client)
  sessions: SessionClient[]

  @OneToMany(() => ViewCaseStudies, view => view.client)
  viewsCaseStudies: ViewCaseStudies[]

  @OneToMany(() => ViewExtraReps, view => view.client)
  viewsExtraReps: ViewExtraReps[]

  @OneToMany(() => ViewVideos, view => view.client)
  viewsVideos: ViewVideos[]

  @OneToMany(() => VideoQualification, videoQualification => videoQualification.client)
  qualifications: VideoQualification[]

  @OneToMany(() => CheckClient, checkClient => checkClient.client)
  checks: CheckClient[]
}