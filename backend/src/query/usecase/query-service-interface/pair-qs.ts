export class PairDto {
  public readonly id: string;
  public readonly name: string;
  public readonly participants: ParticipantDto[];

  public constructor(props: {
    id: string;
    name: string;
    participants: {
      participantId: string;
      participantName: string;
    }[];
  }) {
    const { id, name, participants } = props;
    this.id = id;
    this.name = name;
    this.participants = participants.map((p) => new ParticipantDto(p));
  }
}

class ParticipantDto {
  public readonly participantId: string;
  public readonly participantName: string;

  public constructor(props: {
    participantId: string;
    participantName: string;
  }) {
    const { participantId, participantName } = props;
    this.participantId = participantId;
    this.participantName = participantName;
  }
}

export interface IPairQS {
  /**
   * 全てのペアを取得します。
   */
  getAll(): Promise<PairDto[]>;
}
