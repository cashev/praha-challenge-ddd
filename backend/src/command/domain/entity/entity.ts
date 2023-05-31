import { Brand } from '../value-object/valueObject';

const isEntity2 = (v: any): v is Entity<any> => {
  return v instanceof Entity;
};

export abstract class Entity<T extends Brand<any, any>> {
  protected readonly _id: T;

  constructor(id: T) {
    this._id = id;
  }

  public equals(object?: Entity<T>): boolean {
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
