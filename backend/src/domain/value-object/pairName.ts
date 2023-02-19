import { ValueObject } from './valueObject';

interface PairNameProps {
  value: string;
}

export class PairName extends ValueObject<PairNameProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: PairNameProps) {
    super(props);
  }

  private static validate(value: string) {
    if (!/[a-z]/.test(value)) {
      throw new Error('ペア名は英文字の小文字です。: ' + value);
    }
    if (value.length !== 1) {
      throw new Error('ペア名は1文字です。: ' + value);
    }
  }

  public static create(value: string): PairName {
    this.validate(value);
    return new PairName({ value });
  }
}
