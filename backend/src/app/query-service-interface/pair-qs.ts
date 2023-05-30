export class PairDto {
  public readonly id: string;
  public readonly name: string;
  public readonly participants: ParticipantStatusDto[];

  public constructor(props: {
    id: string;
    name: string;
    participants: {
      participantId: string;
      participantName: string;
      status: string;
    }[];
  }) {
    const { id, name, participants } = props;
    this.id = id;
    this.name = name;
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

export interface IPairQS {
  /**
   * 全てのペアを取得します。
   */
  getAll(): Promise<PairDto[]>;
}
