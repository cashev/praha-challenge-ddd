export class PairDto {
  public readonly id: string;
  public readonly name: string;

  public constructor(props: { id: string; name: string }) {
    const { id, name } = props;
    this.id = id;
    this.name = name;
  }
}

export interface IPairQS {
  getAll(): Promise<PairDto[]>;
}
