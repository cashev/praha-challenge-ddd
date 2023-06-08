import { Brand, ValueObject } from './valueObject';

export type ParticipantNameType = Brand<string, 'ParticipantName'>;

export class ParticipantName extends ValueObject<string, 'ParticipantName'> {
  private constructor(value: string) {
    super(value as ParticipantNameType);
  }

  public static create(value: string): ParticipantName {
    return new ParticipantName(value);
  }
}
