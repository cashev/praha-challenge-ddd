export type Brand<K, U> = K & { __brand: U };

export abstract class BrandedValueObject<K, U> {
  constructor(protected readonly value: Brand<K, U>) {}

  public getValue(): Brand<K, U> {
    return this.value;
  }

  public equals(vo?: BrandedValueObject<K, U>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.value === undefined) {
      return false;
    }
    return this.value === vo.value;
  }
}

interface ValueObjectProps<> {
  [index: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProps> {
  protected props: T;

  constructor(props: T) {
    const baseProps: any = {
      ...props,
    };

    this.props = baseProps;
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
