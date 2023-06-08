export class ParticipantDto {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly status: string;

  public constructor(props: { id: string; name: string; email: string }) {
    const { id, name, email } = props;
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

/**
 * 全ての参加者を取得します。
 */
export interface IParticipantQS {
  getAll(): Promise<ParticipantDto[]>;
}

export class ParticipantNameDto {
  public readonly id: string;
  public readonly name: string;

  public constructor(props: { id: string; name: string }) {
    const { id, name } = props;
    this.id = id;
    this.name = name;
  }
}

export interface IParticipantNameQS {
  /**
   * 指定した参加者idの参加者名を取得します。
   *
   * @param ids 参加者idのリスト
   */
  getNames(ids: string[]): Promise<ParticipantNameDto[]>;
}
