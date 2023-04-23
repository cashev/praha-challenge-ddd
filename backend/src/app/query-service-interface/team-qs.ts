export class TeamDto {
  public readonly id: string;
  public readonly name: string;

  public constructor(props: { id: string; name: string }) {
    const { id, name } = props;
    this.id = id;
    this.name = name;
  }
}

export interface ITeamQS {
  /**
   * 全てのTeamを取得します。
   */
  getAll(): Promise<TeamDto[]>;
}
