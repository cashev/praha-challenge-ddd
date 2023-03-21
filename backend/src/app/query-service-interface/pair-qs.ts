export class PairDto {
  public readonly id: number;
  public readonly name: string;

  public constructor(props: { id: number; name: string }) {
    const { id, name } = props;
    this.id = id;
    this.name = name;
  }
}

export interface IPairQS {
  findByName(teamId: number, name: string): Promise<PairDto>;
  getSmallestPairList(teamId: number): Promise<PairDto[]>;
  getNextId(): Promise<number>;
  findByTeamId(teamId: number): Promise<PairDto[]>;
}
