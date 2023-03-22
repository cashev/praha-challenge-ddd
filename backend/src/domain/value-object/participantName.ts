import { ValueObject } from './valueObject';

interface ParticipantNameProps {
  value: string;
}

export class ParticipantName extends ValueObject<ParticipantNameProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: ParticipantNameProps) {
    super(props);
  }

  public static create(value: string): ParticipantName {
    return new ParticipantName({ value });
  }
}
