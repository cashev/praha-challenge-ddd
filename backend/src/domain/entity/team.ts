import { PairName } from '../value-object/pairName';
import { TeamName } from '../value-object/teamName';
import { Zaiseki } from '../value-object/participantStatus';
import { Entity } from './entity';
import { Pair } from './pair';
import { Participant } from './participant';
import { ITeamRepository } from '../repository-interface/team-repository';
import { Brand } from '../value-object/valueObject';

type TeamIdType = Brand<number, 'TeamId'>;

interface TeamProps {
  teamName: TeamName;
  pairList: Pair[];
}

export class Team extends Entity<TeamIdType, TeamProps> {
  get id(): TeamIdType {
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

  addPair(newPair: Pair) {
    if (
      this.pairList
        .map((pair) => pair.pairName)
        .some((pairName) => pairName.equals(newPair.pairName))
    ) {
      throw new Error('ペア名が重複しています');
    }
    this.props.pairList.push(newPair);
  }

  async removeParticipant(participant: Participant, teamRepo: ITeamRepository) {
    if (!this.isMember(participant)) {
      throw new Error('メンバーではありません');
    }
    const pair = this.pairList.filter((pair) => pair.isMember(participant))[0];
    if (pair.isFullMember()) {
      pair.removeMember(participant);
    } else {
      const anotherParticipant = pair.member.filter(
        (p) => !p.equals(participant),
      )[0];
      this.removePair(pair);
      const anotherPair = this.getSmallestPair();
      if (anotherPair.isFullMember()) {
        const existingUser = this.randomChoice<Participant>([
          ...anotherPair.member,
        ]);
        anotherPair.removeMember(existingUser);
        const newPair = Pair.create(await teamRepo.getNextPairId(), {
          pairName: this.getUnusedPairName(),
          member: [existingUser, anotherParticipant],
        });
        this.addPair(newPair);
      } else {
        anotherPair.addMember(anotherParticipant);
      }
    }
  }

  private removePair(pair: Pair) {
    const index = this.pairList.findIndex((p) => p.id === pair.id);
    this.props.pairList.splice(index, 1);
  }

  get member(): readonly Participant[] {
    return this.props.pairList.flatMap((pair) => pair.member);
  }

  isMember(user: Participant): boolean {
    return this.member.some((u) => u.id === user.id);
  }

  getSmallestPair(): Pair {
    return this.props.pairList.reduce((a, b) =>
      a.member.length <= b.member.length ? a : b,
    );
  }

  getUnusedPairName(): PairName {
    const pairNameSet = new Set(
      this.pairList.map((pair) => pair.pairName.getValue()),
    );
    const unusedName = this.findUnusedName(pairNameSet);
    return PairName.create(unusedName);
  }

  private findUnusedName(pairNameSet: Set<string>): string {
    const alphabet = [...'abcdefghijklmnopqrstuvwxyz'];
    for (const c of alphabet) {
      if (pairNameSet.has(c)) {
        continue;
      }
      return c;
    }
    throw new Error('利用可能なペア名がありません。');
  }

  private randomChoice<T>(list: T[]) {
    return list[Math.floor(Math.random() * list.length)];
  }

  private constructor(id: TeamIdType, props: TeamProps) {
    super(id, props);
  }

  private static validate(member: Participant[]) {
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
    return new Team(id as TeamIdType, props);
  }
}
