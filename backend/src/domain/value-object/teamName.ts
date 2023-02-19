import { ValueObject } from './valueObject';

interface TeamNameProps {
  value: string;
}

export class TeamName extends ValueObject<TeamNameProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: TeamNameProps) {
    super(props);
  }

  private static isValid(value: string) {
    if (isNaN(Number(value))) {
      throw new Error('チーム名は数字のみ使えます。: ' + value);
    }
    if (value.length > 3) {
      throw new Error('チーム名は3文字以下です。: ' + value);
    }
  }

  public static create(value: string): TeamName {
    this.isValid(value);
    return new TeamName({ value });
  }
}
