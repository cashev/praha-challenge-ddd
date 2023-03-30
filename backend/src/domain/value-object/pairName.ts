import { Brand, BrandedValueObject } from './valueObject';

export type PairNameType = Brand<string, 'PairName'>;

export class PairName extends BrandedValueObject<string, 'PairName'> {
  private constructor(value: string) {
    super(value as PairNameType);
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
    return new PairName(value);
  }
}
