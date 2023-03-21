import { TeamName } from '../value-object/teamName';
import { Zaiseki } from '../value-object/userStatus';
import { Entity } from './entity';
import { Pair } from './pair';
import { User } from './user';

interface TeamProps {
  teamName: TeamName;
  pairList: Pair[];
}

export class Team extends Entity<TeamProps> {
  get id(): number {
    return this._id;
  }

  get teamName(): TeamName {
    return this.props.teamName;
  }

  set teamName(teamName: TeamName) {
    this.props.teamName = teamName;
  }

  get pairList(): readonly Pair[] {
    return this.props.pairList;
  }

  get member(): readonly User[] {
    return this.props.pairList.flatMap((pair) => pair.member);
  }

  isMember(user: User): boolean {
    return this.member.some((u) => u.id === user.id);
  }

  getSmallestPair(): Pair {
    return this.pairList.reduce((a, b) =>
      a.member.length <= b.member.length ? a : b,
    );
  }

  private constructor(id: number, props: TeamProps) {
    super(id, props);
  }

  private static validate(member: User[]) {
    if (member.length < 3) {
      throw new Error('チームの参加者は3名以上です。: ' + member.length);
    }
    if (member.some((user) => user.status !== Zaiseki)) {
      throw new Error('在籍中ではない参加者が含まれています。');
    }
  }

  public static create(id: number, props: TeamProps): Team {
    this.validate(props.pairList.flatMap((pair) => pair.member));
    props.pairList = [...props.pairList];
    return new Team(id, props);
  }
}
