import { PairName } from '../value-object/pairName';
import { Brand } from '../value-object/valueObject';
import { Entity } from './entity';
import { ParticipantIdType } from './participant';

type PairIdType = Brand<string, 'PairId'>;

interface PairProps {
  name: PairName;
  member: ParticipantIdType[];
}

const MIN_PAIR_MEMBER_SIZE = 2;
const MAX_PAIR_MEMBER_SIZE = 3;

export class Pair extends Entity<PairIdType, PairProps> {
  get id(): PairIdType {
    return this._id;
  }

  get pairName(): PairName {
    return this.props.name;
  }

  get member(): readonly ParticipantIdType[] {
    return this.props.member;
  }

  /**
   * ペアに参加者を追加します。
   *
   * @param participantId 参加者
   */
  addMember(participantId: ParticipantIdType) {
    if (this.isFullMember()) {
      throw new Error('ペアは3名までです。');
    }
    if (this.isMember(participantId)) {
      throw new Error('既存のメンバーです。');
    }
    this.props.member.push(participantId);
  }

  /**
   * ペアから参加者を取り除きます。
   *
   * @param participantId 参加者
   */
  removeMember(participantId: ParticipantIdType) {
    const index = this.member.indexOf(participantId);
    if (index < 0) {
      throw new Error('この参加者はペアの一員ではありません。');
    }
    this.props.member.splice(index, 1);
  }

  /**
   * 参加者がこのペアに含まれているか判定します。
   *
   * @param participantId 参加者
   * @returns 含まれている場合...true, 含まれていない場合...false
   */
  isMember(participantId: ParticipantIdType): boolean {
    return this.member.some((id) => id === participantId);
  }

  /**
   * ペアが最大人数か判定します。
   *
   * @returns ペアが最大人数の場合...true, ペアが最大人数ではない場合...false
   */
  isFullMember(): boolean {
    return this.member.length === MAX_PAIR_MEMBER_SIZE;
  }

  private constructor(id: PairIdType, props: PairProps) {
    super(id, props);
  }

  private static validate(member: ParticipantIdType[]) {
    if (
      member.length < MIN_PAIR_MEMBER_SIZE ||
      member.length > MAX_PAIR_MEMBER_SIZE
    ) {
      throw new Error('ペアは2名または3名です。: ' + member.length);
    }
  }

  public static create(id: string, props: PairProps): Pair {
    this.validate(props.member);
    props.member = [...props.member];
    return new Pair(id as PairIdType, props);
  }
}
