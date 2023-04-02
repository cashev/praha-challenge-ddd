import { PairName } from '../value-object/pairName';
import { Zaiseki } from '../value-object/participantStatus';
import { Brand } from '../value-object/valueObject';
import { Entity } from './entity';
import { Participant } from './participant';

type PairIdType = Brand<number, 'PairId'>;

interface PairProps {
  pairName: PairName;
  member: Participant[];
}

export class Pair extends Entity<PairIdType, PairProps> {
  get id(): PairIdType {
    return this._id;
  }

  get pairName(): PairName {
    return this.props.pairName;
  }

  set pairName(PairName: PairName) {
    this.props.pairName = PairName;
  }

  get member(): readonly Participant[] {
    return this.props.member;
  }

  addMember(user: Participant) {
    if (this.isFullMember()) {
      throw new Error('ペアは3名までです。');
    }
    if (user.status != Zaiseki) {
      throw new Error('参加者が在籍中ではありません。');
    }
    if (this.isMember(user)) {
      throw new Error('既存のメンバーです。');
    }
    this.props.member.push(user);
  }

  removeMember(user: Participant) {
    const index = this.member.indexOf(user);
    if (index < 0) {
      throw new Error('この参加者はペアの一員ではありません。');
    }
    this.props.member.splice(index, 1);
  }

  isMember(user: Participant): boolean {
    return this.member.some((u) => u.id === user.id);
  }

  isFullMember(): boolean {
    return this.member.length === 3;
  }

  private constructor(id: PairIdType, props: PairProps) {
    super(id, props);
  }

  private static validate(member: Participant[]) {
    if (member.length < 2 || member.length > 3) {
      throw new Error('ペアは2名または3名です。: ' + member.length);
    }

    if (member.some((user) => user.status !== Zaiseki)) {
      throw new Error('在籍中ではない参加者が含まれています。');
    }
  }

  public static create(id: number, props: PairProps): Pair {
    this.validate(props.member);
    props.member = [...props.member];
    return new Pair(id as PairIdType, props);
  }
}
