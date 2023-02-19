import { PairName } from '../value-object/pairName';
import { Zaiseki } from '../value-object/userStatus';
import { Entity } from './entity';
import { User } from './user';

interface PairProps {
  pairName: PairName;
  member: User[];
}

export class Pair extends Entity<PairProps> {
  get pairName(): PairName {
    return this.props.pairName;
  }

  set pairName(PairName: PairName) {
    this.props.pairName = PairName;
  }

  get member(): User[] {
    return this.props.member;
  }

  set member(member: User[]) {
    this.props.member = member;
  }

  private constructor(id: number, props: PairProps) {
    super(id, props);
  }

  private static validate(member: User[]) {
    if (member.length < 2 || member.length > 3) {
      throw new Error('ペアは2名または3名です。: ' + member.length);
    }

    if (member.some((user) => user.status !== Zaiseki)) {
      throw new Error('在籍中ではない参加者が含まれています。');
    }
  }

  public static create(id: number, props: PairProps): Pair {
    this.validate(props.member);
    return new Pair(id, props);
  }
}
