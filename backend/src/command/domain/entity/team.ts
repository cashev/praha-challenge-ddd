import { PairName } from '../value-object/pairName';
import { TeamName } from '../value-object/teamName';
import { Entity } from './entity';
import { ParticipantIdType } from './participant';
import { Brand } from '../value-object/valueObject';
import { createRandomIdString, randomChoice } from 'src/util/random';
import { Option, none, some } from 'fp-ts/lib/Option';

type TeamIdType = Brand<string, 'TeamId'>;

export class Team extends Entity<TeamIdType> {
  private static readonly MIN_TEAM_MEMBER_SIZE = 3;

  getPairs(): Pair[] {
    return [...this.pairs];
  }

  getAllMember(): ParticipantIdType[] {
    return [
      ...this.pairs.flatMap((p) => p.getParticipants()),
      ...this.getKyukaiMember(),
    ].sort(sortByParticipantIdType);
  }

  getZaisekiMember(): ParticipantIdType[] {
    return [
      ...this.pairs
        .flatMap((p) => p.getParticipants())
        .sort(sortByParticipantIdType),
    ];
  }

  getKyukaiMember(): ParticipantIdType[] {
    return [...this.kyukaiParticipants.sort(sortByParticipantIdType)];
  }

  /**
   * チーム,ペアに参加者を追加します。
   * 休会中として既に所属していた場合、ペアへ割り当てます。
   * 参加者を追加できるペアがない場合、ペアを分割します。
   *
   * @param participantId 参加者id
   * @returns エラー
   */
  joinParticipant(participantId: ParticipantIdType): Option<Error> {
    if (this.isZaisekiMember(participantId)) {
      return some(new Error('既に在籍中の参加者です。'));
    }
    if (this.isKyukaiMember(participantId)) {
      // 休会中として所属している場合は、一度取り除く
      this.removeKyukaiParticipant(participantId);
    }
    // チーム内で最小のペア
    const pair = this.getSmallestPair();
    if (pair.isFullMember()) {
      // 既存のペアを分割する
      const newPartner = randomChoice<ParticipantIdType>(
        pair.getParticipants(),
      );
      pair.removeParticipant(newPartner);
      // 新しいペアを作成する
      const newPair = Pair.create(
        createRandomIdString(),
        this.getUnusedPairName(),
        [newPartner, participantId],
      );
      this.addPair(newPair);
    } else {
      // 参加者を既存のペアに追加する
      pair.joinParticipant(participantId);
    }
    return none;
  }

  /**
   * チームから参加者を取り除けるか判定します。
   *
   * @returns true...取り除ける, false...取り除けない
   */
  canRemoveParticipant(): boolean {
    return this.getZaisekiMember().length > Team.MIN_TEAM_MEMBER_SIZE;
  }

  /**
   * 指定した参加者を休会中にします。
   * 対象参加者を取り除いたペアの人数が1人となった場合、ペアを再編成します。
   *
   * @param participantId 休会する参加者のid
   */
  suspendParticipant(participantId: ParticipantIdType): Option<Error> {
    if (!this.canRemoveParticipant()) {
      return some(
        new Error(`参加者が規定数: ${Team.MIN_TEAM_MEMBER_SIZE}を下回ります。`),
      );
    }
    if (!this.isMember(participantId)) {
      return some(new Error('メンバーではありません'));
    }
    // 参加者が所属していたペアを取得
    const exPair = this.findPair(participantId);
    if (exPair.isFullMember()) {
      exPair.removeParticipant(participantId);
    } else {
      const exPartner = exPair
        .getParticipants()
        .filter((pid) => pid != participantId)[0];
      // 合流先ペアを取得する前に既存のペアを取り除く
      this.removePair(exPair);
      // 合流先ペアを取得する
      const anotherPair = this.getSmallestPair();
      if (anotherPair.isFullMember()) {
        // ペアを分割する
        const newPartner = randomChoice<ParticipantIdType>(
          anotherPair.getParticipants(),
        );
        anotherPair.removeParticipant(newPartner);
        const newPair = Pair.create(
          createRandomIdString(),
          this.getUnusedPairName(),
          [newPartner, exPartner],
        );
        this.addPair(newPair);
      } else {
        anotherPair.joinParticipant(exPartner);
      }
    }
    this.addKyukaiParticipant(participantId);
    return none;
  }

  /**
   * チームから引数の参加者を取り除きます。
   * 対象参加者を取り除いたペアの人数が1人となった場合、ペアを再編成します。
   *
   * @param participant 取り除く参加者のid
   */
  removeParticipant(participantId: ParticipantIdType): Option<Error> {
    if (!this.canRemoveParticipant()) {
      return some(
        new Error(`参加者が規定数: ${Team.MIN_TEAM_MEMBER_SIZE}を下回ります。`),
      );
    }
    if (!this.isMember(participantId)) {
      return some(new Error('メンバーではありません'));
    }
    if (this.isKyukaiMember(participantId)) {
      // 休会中であれば取り除くだけ
      this.removeKyukaiParticipant(participantId);
      return none;
    }
    // 参加者が所属していたペアを取得
    const exPair = this.findPair(participantId);
    if (exPair.isFullMember()) {
      // 3人ペアであればそのまま参加者を取り除く
      exPair.removeParticipant(participantId);
    } else {
      // 2人ペアであればペアを解散し、もう片方の参加者を別ペアに合流する
      const exPartner = exPair
        .getParticipants()
        .filter((pid) => pid != participantId)[0];
      this.removePair(exPair);
      // 合流先ペアを取得する
      const anotherPair = this.getSmallestPair();
      if (anotherPair.isFullMember()) {
        // 合流先のペアが3人の場合、ペアを分割する
        const newPartner = randomChoice<ParticipantIdType>(
          anotherPair.getParticipants(),
        );
        anotherPair.removeParticipant(newPartner);
        const newPair = Pair.create(
          createRandomIdString(),
          this.getUnusedPairName(),
          [newPartner, exPartner],
        );
        this.addPair(newPair);
      } else {
        // 合流先のペアが2人の場合、そのまま合流する
        anotherPair.joinParticipant(exPartner);
      }
    }
    return none;
  }

  /**
   * 参加者が所属しているか判定します。
   *
   * @param participantId 参加者id
   * @returns 含まれている場合...true, 含まれていない場合...false
   */
  private isMember(participantId: ParticipantIdType): boolean {
    return (
      this.isZaisekiMember(participantId) || this.isKyukaiMember(participantId)
    );
  }

  /**
   * 参加者が在籍中として所属しているか判定します。
   *
   * @param participantId 参加者id
   * @returns 在籍中として所属している場合...true
   */
  private isZaisekiMember(participantId: ParticipantIdType): boolean {
    return this.getPairs().some((p) => p.isMember(participantId));
  }

  /**
   * 参加者が休会中として所属しているか判定します。
   *
   * @param participantId 参加者id
   * @returns 休会中として
   */
  private isKyukaiMember(participantId: ParticipantIdType): boolean {
    return this.getKyukaiMember().some((pid) => pid === participantId);
  }

  private addKyukaiParticipant(participantId: ParticipantIdType) {
    if (this.isZaisekiMember(participantId)) {
      throw new Error('在籍中の参加者です。');
    }
    this.kyukaiParticipants.push(participantId);
  }

  private removeKyukaiParticipant(participantId: ParticipantIdType) {
    if (!this.isKyukaiMember(participantId)) {
      throw new Error('休会中ではない参加者です。');
    }
    const index = this.kyukaiParticipants.indexOf(participantId);
    this.kyukaiParticipants.splice(index, 1);
  }

  /**
   * 指定した参加者が所属するペアを取得します。
   *
   * @param participantId 参加者id
   * @returns ペア
   */
  private findPair(participantId: ParticipantIdType): Pair {
    return this.getPairs().filter((p) => p.isMember(participantId))[0];
  }

  /**
   * チームにペアを追加します。
   *
   * @param newPair 追加するペア
   */
  private addPair(newPair: Pair) {
    if (
      this.pairs
        .map((pair) => pair.name)
        .some((name) => name.equals(newPair.name))
    ) {
      throw new Error('ペア名が重複しています');
    }
    this.pairs.push(newPair);
  }

  /**
   * チームからペアを取り除きます。
   * チームの整合性は呼び出し元で担保してください
   *
   * @param pair 取り除くペア
   */
  private removePair(pair: Pair) {
    const index = this.pairs.findIndex((p) => p.id === pair.id);
    this.pairs.splice(index, 1);
  }

  /**
   * チーム内で最小人数のペアを取得します。
   * 複数存在する場合はその名からランダムで取得します。
   *
   * @returns 最小人数のペア
   */
  private getSmallestPair(): Pair {
    if (this.pairs.every((p) => p.isFullMember())) {
      return randomChoice<Pair>(this.pairs);
    }
    const minLength = Math.min(
      ...this.pairs.map((p) => p.getParticipants().length),
    );
    return randomChoice<Pair>(
      this.pairs.filter((p) => p.getParticipants().length === minLength),
    );
  }

  /**
   * チーム内で使われていないペア名を取得します。
   *
   * @returns 未使用のペア名
   */
  private getUnusedPairName(): string {
    const usedPairNameSet = new Set(
      this.pairs.map((pair) => pair.name.getValue().toString()),
    );
    const alphabet = [...'abcdefghijklmnopqrstuvwxyz'];
    for (const c of alphabet) {
      if (usedPairNameSet.has(c)) {
        continue;
      }
      return c;
    }
    throw new Error('利用可能なペア名がありません。');
  }

  private constructor(
    readonly id: TeamIdType,
    readonly name: TeamName,
    private pairs: Pair[],
    private kyukaiParticipants: ParticipantIdType[] = [],
  ) {
    super(id);
  }

  private static validate(
    pairs: {
      pairId: string;
      pairName: string;
      participants: string[];
    }[],
  ) {
    const participants = pairs.flatMap((p) => p.participants);
    if (participants.length < 3) {
      throw new Error('チームの参加者は3名以上です。: ' + participants.length);
    }
  }

  public static create(
    id: string,
    name: string,
    pairs: {
      pairId: string;
      pairName: string;
      participants: string[];
    }[],
    kyukaiParticipants: string[] = [],
  ): Team {
    this.validate(pairs);
    return new Team(
      id as TeamIdType,
      TeamName.create(name),
      this.createPairs([...pairs]),
      [...kyukaiParticipants.map((kp) => kp as ParticipantIdType)],
    );
  }

  private static createPairs(
    pairs: {
      pairId: string;
      pairName: string;
      participants: string[];
    }[],
  ): Pair[] {
    return pairs.map((p) => Pair.create(p.pairId, p.pairName, p.participants));
  }
}

type PairIdType = Brand<string, 'PairId'>;

class Pair extends Entity<PairIdType> {
  private static readonly MIN_PAIR_MEMBER_SIZE = 2;
  private static readonly MAX_PAIR_MEMBER_SIZE = 3;

  /**
   * ペアに所属する全ての参加者idを取得します。
   *
   * @returns ペアに所属する全ての参加者id
   */
  getParticipants(): ParticipantIdType[] {
    return [...this.participants.sort(sortByParticipantIdType)];
  }

  /**
   * ペアに参加者を追加します。
   *
   * @param participantId 参加者id
   */
  joinParticipant(participantId: ParticipantIdType) {
    if (this.isFullMember()) {
      throw new Error(`ペアは${Pair.MAX_PAIR_MEMBER_SIZE}名までです。`);
    }
    if (this.isMember(participantId)) {
      throw new Error('既存の参加者です。');
    }
    this.participants.push(participantId);
  }

  /**
   * ペアから参加者を取り除きます。
   *
   * @param participantId 参加者id
   */
  removeParticipant(participantId: ParticipantIdType) {
    if (this.participants.length <= Pair.MIN_PAIR_MEMBER_SIZE) {
      throw new Error(
        `ペアの最低人数: ${Pair.MIN_PAIR_MEMBER_SIZE} を下回ります。`,
      );
    }
    const index = this.participants.indexOf(participantId);
    if (index < 0) {
      throw new Error('この参加者はペアの一員ではありません。');
    }
    this.participants.splice(index, 1);
  }

  /**
   * 参加者がこのペアに含まれているか判定します。
   *
   * @param participantId 参加者id
   * @returns 含まれている場合...true, 含まれていない場合...false
   */
  isMember(participantId: ParticipantIdType): boolean {
    return this.participants.some((pid) => pid === participantId);
  }

  /**
   * ペアが最大人数か判定します。
   *
   * @returns ペアが最大人数の場合...true, ペアが最大人数ではない場合...false
   */
  isFullMember(): boolean {
    return this.participants.length >= Pair.MAX_PAIR_MEMBER_SIZE;
  }

  private constructor(
    readonly id: PairIdType,
    readonly name: PairName,
    private participants: ParticipantIdType[],
  ) {
    super(id);
  }

  private static validate(participants: string[]) {
    if (
      participants.length < Pair.MIN_PAIR_MEMBER_SIZE ||
      participants.length > Pair.MAX_PAIR_MEMBER_SIZE
    ) {
      throw new Error('ペアは2名または3名です。: ' + participants.length);
    }
  }

  public static create(id: string, name: string, participants: string[]): Pair {
    this.validate(participants);
    return new Pair(id as PairIdType, PairName.create(name), [
      ...participants.map((p) => p as ParticipantIdType),
    ]);
  }
}

const sortByParticipantIdType = (
  pid1: ParticipantIdType,
  pid2: ParticipantIdType,
) => {
  if (pid1 < pid2) {
    return -1;
  }
  if (pid1 > pid2) {
    return 1;
  }
  return 0;
};
