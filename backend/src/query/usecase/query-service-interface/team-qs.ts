export class TeamDto {
  public readonly id: string;
  public readonly name: string;
  public readonly pairs: PairDto[];
  public readonly kyukaiParticipants: ParticipantDto[];

  public constructor(props: {
    id: string;
    name: string;
    pairs: {
      pairId: string;
      pairName: string;
      participants: {
        participantId: string;
        participantName: string;
      }[];
    }[];
    kyukaiParticipants: {
      participantId: string;
      participantName: string;
    }[];
  }) {
    const { id, name, pairs, kyukaiParticipants } = props;
    this.id = id;
    this.name = name;
    this.pairs = pairs.map((p) => new PairDto(p));
    this.kyukaiParticipants = kyukaiParticipants.map(
      (kp) => new ParticipantDto(kp),
    );
  }
}

class PairDto {
  public readonly pairId: string;
  public readonly pairName: string;
  public readonly participants: ParticipantDto[];

  public constructor(props: {
    pairId: string;
    pairName: string;
    participants: {
      participantId: string;
      participantName: string;
    }[];
  }) {
    const { pairId, pairName, participants } = props;
    this.pairId = pairId;
    this.pairName = pairName;
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

export interface ITeamQS {
  /**
   * 全てのTeamを取得します。
   */
  getAll(): Promise<TeamDto[]>;
}
