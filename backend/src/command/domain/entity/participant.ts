import { ParticipantEmail } from '../value-object/participantEmail';
import { ParticipantName } from '../value-object/participantName';
import { Brand } from '../value-object/valueObject';
import { Entity2 } from './entity';

export type ParticipantIdType = Brand<string, 'ParticipantId'>;

export class Participant extends Entity2<ParticipantIdType> {
  get id(): ParticipantIdType {
    return this._id;
  }

  getName(): ParticipantName {
    return this.name;
  }

  getEmail(): ParticipantEmail {
    return this.email;
  }

  private constructor(
    id: ParticipantIdType,
    private readonly name: ParticipantName,
    private email: ParticipantEmail,
  ) {
    super(id);
  }

  public static create(
    id: string,
    name: ParticipantName,
    email: ParticipantEmail,
  ): Participant {
    return new Participant(id as ParticipantIdType, name, email);
  }
}
