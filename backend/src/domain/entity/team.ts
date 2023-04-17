import { PairName } from '../value-object/pairName';
import { TeamName } from '../value-object/teamName';
import { Zaiseki } from '../value-object/participantStatus';
import { Entity } from './entity';
import { Pair } from './pair';
import { Participant, ParticipantIdType } from './participant';
import { Brand } from '../value-object/valueObject';
import { createRandomIdString } from 'src/util/random';

type TeamIdType = Brand<string, 'TeamId'>;

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

  async addParticipant(participant: Participant) {
    if (participant.status != Zaiseki) {
      throw new Error('在籍中ではない参加者です');
    }

    const pairs = this.getSmallestPair();
    if (pairs.length == 0) {
      return false;
    }
    const pair = this.randomChoice<Pair>(pairs);
    if (pair.isFullMember()) {
      // ペアを分割する
      const anotherMember = this.randomChoice<ParticipantIdType>([
        ...pair.member,
      ]);
      pair.removeMember(anotherMember);

      const newPair = Pair.create(createRandomIdString(), {
        pairName: this.getUnusedPairName(),
        member: [anotherMember, participant.id],
      });
      this.addPair(newPair);
    } else {
      pair.addMember(participant.id);
    }
  }

  async removeParticipant(participant: Participant): Promise<boolean> {
    if (!this.isMember(participant)) {
      throw new Error('メンバーではありません');
    }
    const pair = this.pairList.filter((pair) =>
      pair.isMember(participant.id),
    )[0];
    if (pair.isFullMember()) {
      pair.removeMember(participant.id);
    } else {
      const anotherParticipant = pair.member.filter(
        (p) => p != participant.id,
      )[0];
      this.removePair(pair);
      const anotherPairs = this.getSmallestPair();
      if (anotherPairs.length == 0) {
        return false;
      }
      const anotherPair = this.randomChoice<Pair>(anotherPairs);
      if (anotherPair.isFullMember()) {
        const existingUser = this.randomChoice<ParticipantIdType>([
          ...anotherPair.member,
        ]);
        anotherPair.removeMember(existingUser);
        const newPair = Pair.create(createRandomIdString(), {
          pairName: this.getUnusedPairName(),
          member: [existingUser, anotherParticipant],
        });
        this.addPair(newPair);
      } else {
        anotherPair.addMember(anotherParticipant);
      }
    }
    return true;
  }

  private removePair(pair: Pair) {
    const index = this.pairList.findIndex((p) => p.id === pair.id);
    this.props.pairList.splice(index, 1);
  }

  get member(): readonly ParticipantIdType[] {
    return this.props.pairList.flatMap((pair) => pair.member);
  }

  isMember(user: Participant): boolean {
    return this.member.some((id) => id === user.id);
  }

  getSmallestPair(): Pair[] {
    if (this.pairList.every(p => p.isFullMember())) {
      return this.props.pairList;
    }
    return this.props.pairList.filter(p => p.member.length === 2);
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

  private static validate(member: ParticipantIdType[]) {
    if (member.length < 3) {
      throw new Error('チームの参加者は3名以上です。: ' + member.length);
    }
  }

  public static create(id: string, props: TeamProps): Team {
    this.validate(props.pairList.flatMap((pair) => pair.member));
    props.pairList = [...props.pairList];
    return new Team(id as TeamIdType, props);
  }
}
