import { ValueObject } from './valueObject';

interface ParticipantEmailProps {
  value: string;
}

export class ParticipantEmail extends ValueObject<ParticipantEmailProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: ParticipantEmailProps) {
    super(props);
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
    return new ParticipantEmail({ value });
  }
}
