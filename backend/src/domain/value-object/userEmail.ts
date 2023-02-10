import { ValueObject } from './valueObject';
import validator from 'validator';

interface UserEmailProps {
  value: string;
}

export class UserEmail extends ValueObject<UserEmailProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserEmailProps) {
    super(props);
  }

  private static isValid(value: string): boolean {
    return validator.isEmail(value);
  }

  public static create(value: string): UserEmail {
    if (!this.isValid(value)) {
      throw new Error();
    }
    return new UserEmail({ value });
  }
}
