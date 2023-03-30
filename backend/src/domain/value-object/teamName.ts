import { Brand, BrandedValueObject } from './valueObject';

export type TeamNameType = Brand<string, 'TeamName'>;

export class TeamName extends BrandedValueObject<string, 'TeamName'> {
  private constructor(value: string) {
    super(value as TeamNameType);
  }

  private static validate(value: string) {
    if (isNaN(Number(value))) {
      throw new Error('チーム名は数字のみ使えます。: ' + value);
    }
    if (value.length > 3) {
      throw new Error('チーム名は3文字以下です。: ' + value);
    }
  }

  public static create(value: string): TeamName {
    this.validate(value);
    return new TeamName(value);
  }
}
