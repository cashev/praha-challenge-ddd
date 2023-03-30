import { Brand, BrandedValueObject } from './valueObject';

export type ParticipantNameType = Brand<string, 'ParticipantName'>;

export class ParticipantName extends BrandedValueObject<
  string,
  'ParticipantName'
> {
  private constructor(value: string) {
    super(value as ParticipantNameType);
  }

  public static create(value: string): ParticipantName {
    return new ParticipantName(value);
  }
}
