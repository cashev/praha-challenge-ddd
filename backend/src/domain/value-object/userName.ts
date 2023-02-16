import { ValueObject } from './valueObject';

interface UserNameProps {
  value: string;
}

export class UserName extends ValueObject<UserNameProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserNameProps) {
    super(props);
  }

  public static create(value: string): UserName {
    return new UserName({ value });
  }
}
