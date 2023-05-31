export class TeamDto {
  public readonly id: string;
  public readonly name: string;
  public readonly pairs: PairDto[];

  public constructor(props: {
    id: string;
    name: string;
    pairs: {
      pairId: string;
      pairName: string;
      participants: {
        participantId: string;
        participantName: string;
        status: string;
      }[];
    }[];
  }) {
    const { id, name, pairs } = props;
    this.id = id;
    this.name = name;
    this.pairs = pairs.map((p) => new PairDto(p));
  }
}

class PairDto {
  public readonly pairId: string;
  public readonly pairName: string;
  public readonly participants: ParticipantStatusDto[];

  public constructor(props: {
    pairId: string;
    pairName: string;
    participants: {
      participantId: string;
      participantName: string;
      status: string;
    }[];
  }) {
    const { pairId, pairName, participants } = props;
    this.pairId = pairId;
    this.pairName = pairName;
    this.participants = participants.map((p) => new ParticipantStatusDto(p));
  }
}

class ParticipantStatusDto {
  public readonly participantId: string;
  public readonly participantName: string;
  public readonly status: string;

  public constructor(props: {
    participantId: string;
    participantName: string;
    status: string;
  }) {
    const { participantId, participantName, status } = props;
    this.participantId = participantId;
    this.participantName = participantName;
    this.status = status;
  }
}

export interface ITeamQS {
  /**
   * 全てのTeamを取得します。
   */
  getAll(): Promise<TeamDto[]>;
}
