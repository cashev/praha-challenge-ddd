import { PairName } from '../value-object/pairName';
import { TeamName } from '../value-object/teamName';
import { Zaiseki } from '../value-object/participantStatus';
import { Entity } from './entity';
import { Pair } from './pair';
import { Participant, ParticipantIdType } from './participant';
import { Brand } from '../value-object/valueObject';
import { createRandomIdString, randomChoice } from 'src/util/random';

type TeamIdType = Brand<string, 'TeamId'>;

interface TeamProps {
  teamName: TeamName;
  pairList: Pair[];
}

const MIN_TEAM_MEMBER_SIZE = 3;

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

  get member(): readonly ParticipantIdType[] {
    return this.props.pairList.flatMap((pair) => pair.member);
  }

  isMember(participant: Participant): boolean {
    return this.member.some((id) => id === participant.id);
  }

  /**
   * チームに参加者を追加します。
   * 3人のペアのみの場合、ペアを分割します。
   *
   * @param participant 追加する参加者
   */
  async addParticipant(participant: Participant) {
    if (participant.status != Zaiseki) {
      throw new Error('在籍中ではない参加者です。');
    }
    // チーム内で最小のペア
    const pair = this.getSmallestPair();
    if (pair.isFullMember()) {
      // 既存のペアを分割する
      const anotherMember = randomChoice<ParticipantIdType>([...pair.member]);
      pair.removeMember(anotherMember);
      // 新しいペアを作成する
      const newPair = Pair.create(createRandomIdString(), {
        pairName: this.getUnusedPairName(),
        member: [anotherMember, participant.id],
      });
      this.addPair(newPair);
    } else {
      // 参加者を既存のペアに追加する
      pair.addMember(participant.id);
    }
  }

  /**
   * チームから参加者を取り除けるか判定します。
   *
   * @returns true...取り除ける, false...取り除けない
   */
  canRemoveParticipant(): boolean {
    return this.member.length > MIN_TEAM_MEMBER_SIZE;
  }

  /**
   * チームから引数の参加者を取り除きます。
   * 対象参加者を取り除いたペアの人数が1人となった場合、ペアを再編成します。
   *
   * @param participant 取り除く参加者
   * @returns true...成功, false...失敗
   */
  removeParticipant(participant: Participant) {
    if (!this.isMember(participant)) {
      throw new Error('メンバーではありません');
    }
    // 参加者が所属していたペアを取得
    const exPair = this.pairList.filter((pair) =>
      pair.isMember(participant.id),
    )[0];
    if (exPair.isFullMember()) {
      // 3人ペアであればそのまま参加者を取り除く
      exPair.removeMember(participant.id);
    } else {
      // 2人ペアであればペアを解散し、もう片方の参加者を別ペアに合流する
      const anotherParticipant = exPair.member.filter(
        (p) => p != participant.id,
      )[0];
      this.removePair(exPair);
      // 合流先ペアを取得する
      const anotherPair = this.getSmallestPair();
      if (anotherPair.isFullMember()) {
        // 合流先のペアが3人の場合、ペアを分割する
        const existingUser = randomChoice<ParticipantIdType>([
          ...anotherPair.member,
        ]);
        anotherPair.removeMember(existingUser);
        const newPair = Pair.create(createRandomIdString(), {
          pairName: this.getUnusedPairName(),
          member: [existingUser, anotherParticipant],
        });
        this.addPair(newPair);
      } else {
        // 合流先のペアが2人の場合、そのまま合流する
        anotherPair.addMember(anotherParticipant);
      }
    }
  }

  /**
   * チームにペアを追加します。
   *
   * @param newPair 追加するペア
   */
  private addPair(newPair: Pair) {
    if (
      this.pairList
        .map((pair) => pair.pairName)
        .some((pairName) => pairName.equals(newPair.pairName))
    ) {
      throw new Error('ペア名が重複しています');
    }
    this.props.pairList.push(newPair);
  }

  /**
   * チームからペアを取り除きます。
   * チームの整合性は呼び出し元で担保してください
   *
   * @param pair 取り除くペア
   */
  private removePair(pair: Pair) {
    const index = this.pairList.findIndex((p) => p.id === pair.id);
    this.props.pairList.splice(index, 1);
  }

  /**
   * チーム内で最小人数のペアを取得します。
   * 複数存在する場合はその名からランダムで取得します。
   *
   * @returns 最小人数のペア
   */
  private getSmallestPair(): Pair {
    if (this.pairList.every((p) => p.isFullMember())) {
      return randomChoice<Pair>(this.props.pairList);
    }
    return randomChoice<Pair>(
      this.props.pairList.filter((p) => p.member.length === 2),
    );
  }

  /**
   * チーム内で使われていないペア名を取得します。
   *
   * @returns 未使用のペア名
   */
  private getUnusedPairName(): PairName {
    const usedPairNameSet = new Set(
      this.pairList.map((pair) => pair.pairName.getValue().toString()),
    );
    const alphabet = [...'abcdefghijklmnopqrstuvwxyz'];
    for (const c of alphabet) {
      if (usedPairNameSet.has(c)) {
        continue;
      }
      return PairName.create(c);
    }
    throw new Error('利用可能なペア名がありません。');
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
