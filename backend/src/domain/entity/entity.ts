const isEntity = (v: any): v is Entity<any, any> => {
  return v instanceof Entity;
};

export abstract class Entity<T, U> {
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
