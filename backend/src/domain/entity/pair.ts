import { PairName } from '../value-object/pairName';
import { Brand } from '../value-object/valueObject';
import { Entity } from './entity';
import { ParticipantIdType } from './participant';

type PairIdType = Brand<string, 'PairId'>;

interface PairProps {
  pairName: PairName;
  member: ParticipantIdType[];
}

export class Pair extends Entity<PairIdType, PairProps> {
  get id(): PairIdType {
    return this._id;
  }

  get pairName(): PairName {
    return this.props.pairName;
  }

  get member(): readonly ParticipantIdType[] {
    return this.props.member;
  }

  addMember(participantId: ParticipantIdType) {
    if (this.isFullMember()) {
      throw new Error('ペアは3名までです。');
    }
    if (this.isMember(participantId)) {
      throw new Error('既存のメンバーです。');
    }
    this.props.member.push(participantId);
  }

  removeMember(participantId: ParticipantIdType) {
    const index = this.member.indexOf(participantId);
    if (index < 0) {
      throw new Error('この参加者はペアの一員ではありません。');
    }
    this.props.member.splice(index, 1);
  }

  isMember(participantId: ParticipantIdType): boolean {
    return this.member.some((id) => id === participantId);
  }

  isFullMember(): boolean {
    return this.member.length === 3;
  }

  private constructor(id: PairIdType, props: PairProps) {
    super(id, props);
  }

  private static validate(member: ParticipantIdType[]) {
    if (member.length < 2 || member.length > 3) {
      throw new Error('ペアは2名または3名です。: ' + member.length);
    }
  }

  public static create(id: string, props: PairProps): Pair {
    this.validate(props.member);
    props.member = [...props.member];
    return new Pair(id as PairIdType, props);
  }
}
