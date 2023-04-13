import { ParticipantEmail } from '../value-object/participantEmail';
import { ParticipantName } from '../value-object/participantName';
import { ParticipantStatus } from '../value-object/participantStatus';
import { Brand } from '../value-object/valueObject';
import { Entity } from './entity';

export type ParticipantIdType = Brand<string, 'ParticipantId'>;

interface ParticipantProps {
  participantName: ParticipantName;
  email: ParticipantEmail;
  status: ParticipantStatus;
}

export class Participant extends Entity<ParticipantIdType, ParticipantProps> {
  get id(): ParticipantIdType {
    return this._id;
  }

  get participantName(): ParticipantName {
    return this.props.participantName;
  }

  set participantName(participantName: ParticipantName) {
    this.props.participantName = participantName;
  }

  get email(): ParticipantEmail {
    return this.props.email;
  }

  set email(email: ParticipantEmail) {
    this.props.email = email;
  }

  get status(): ParticipantStatus {
    return this.props.status;
  }

  set status(status: ParticipantStatus) {
    this.props.status = status;
  }

  private constructor(id: ParticipantIdType, props: ParticipantProps) {
    super(id, props);
  }

  public static create(id: string, props: ParticipantProps): Participant {
    return new Participant(id as ParticipantIdType, props);
  }
}
