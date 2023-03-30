import { Brand, BrandedValueObject } from './valueObject';

export type ParticipantEmailType = Brand<string, 'ParticipantEmail'>;

export class ParticipantEmail extends BrandedValueObject<
  string,
  'ParticipantEmail'
> {
  private constructor(value: string) {
    super(value as ParticipantEmailType);
  }

  private static isValid(value: string): boolean {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(value);
  }

  public static create(value: string): ParticipantEmail {
    if (!this.isValid(value)) {
      throw new Error('メールアドレスではありません。:' + value);
    }
    return new ParticipantEmail(value);
  }
}
