export type Brand<K, U> = K & { __brand: U };

export abstract class ValueObject<K, U> {
  constructor(protected readonly value: Brand<K, U>) {}

  public getValue(): Brand<K, U> {
    return this.value;
  }

  public equals(vo?: ValueObject<K, U>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.value === undefined) {
      return false;
    }
    return this.value === vo.value;
  }
}
