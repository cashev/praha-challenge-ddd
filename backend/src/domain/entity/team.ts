import { TeamName } from '../value-object/teamName';
import { Zaiseki } from '../value-object/userStatus';
import { Entity } from './entity';
import { User } from './user';

interface TeamProps {
  teamName: TeamName;
  member: User[];
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

  get member(): readonly User[] {
    return this.props.member;
  }

  isMember(user: User): boolean {
    return this.member.some((u) => u.id === user.id);
  }

  addMember(user: User) {
    if (user.status != Zaiseki) {
      throw new Error('参加者が在籍中ではありません。');
    }
    if (this.isMember(user)) {
      throw new Error('既存のメンバーです。');
    }
    this.props.member.push(user);
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
    this.validate(props.member);
    props.member = [...props.member];
    return new Team(id, props);
  }
}
