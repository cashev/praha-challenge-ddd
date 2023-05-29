import { Brand } from '../value-object/valueObject';

const isEntity = (v: any): v is Entity<any, any> => {
  return v instanceof Entity;
};

export abstract class Entity<T extends Brand<any, any>, U> {
  protected readonly _id: T;
  protected readonly props: U;

  constructor(id: T, props: U) {
    this._id = id;
    this.props = props;
  }

  public equals(object?: Entity<T, U>): boolean {
    if (object == null || object == undefined) {
      return false;
    }
    if (this === object) {
      return true;
    }
    if (!isEntity(object)) {
      return false;
    }
    return this._id === object._id;
  }
}

const isEntity2 = (v: any): v is Entity2<any> => {
  return v instanceof Entity2;
};

export abstract class Entity2<T extends Brand<any, any>> {
  protected readonly _id: T;

  constructor(id: T) {
    this._id = id;
  }

  public equals(object?: Entity2<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }
    if (this === object) {
      return true;
    }
    if (!isEntity2(object)) {
      return false;
    }
    return this._id === object._id;
  }
}
