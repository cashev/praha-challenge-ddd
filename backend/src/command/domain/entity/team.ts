import { PairName } from '../value-object/pairName';
import { TeamName } from '../value-object/teamName';
import { Entity2 } from './entity';
import { ParticipantIdType } from './participant';
import { Brand } from '../value-object/valueObject';
import { createRandomIdString, randomChoice } from 'src/util/random';
import { isLeft, left, right } from 'fp-ts/lib/Either';
import { Option, none, some } from 'fp-ts/lib/Option';

type TeamIdType = Brand<string, 'TeamId'>;

export class Team extends Entity2<TeamIdType> {
  private static readonly MIN_TEAM_MEMBER_SIZE = 3;

  getPairs(): Pair[] {
    return [...this.pairs];
  }

  getAllMember(): ParticipantStatus[] {
    return [
      ...this.pairs
        .flatMap((p) => p.getAllMember())
        .sort(sortByParticipantIdType),
    ];
  }

  getZaisekiMember(): ParticipantStatus[] {
    return [
      ...this.pairs.flatMap((p) =>
        p.getZaisekiMember().sort(sortByParticipantIdType),
      ),
    ];
  }

  /**
   * チームに参加者を追加します。
   * 3人のペアのみの場合、ペアを分割します。
   *
   * @param participantId 追加する参加者
   */
  async addParticipant(participantId: ParticipantIdType) {
    // チーム内で最小のペア
    const pair = this.getSmallestPair();
    const ps = ParticipantStatus.create(
      participantId,
      ParticipantStatusValues.Zaiseki,
    );
    if (pair.isFullMember()) {
      // 既存のペアを分割する
      const anotherMember = randomChoice<ParticipantStatus>([
        ...pair.getAllMember(),
      ]);
      pair.removeMember(anotherMember.participantId);
      // 新しいペアを作成する
      const newPair = Pair.create(
        createRandomIdString(),
        this.getUnusedPairName(),
        [anotherMember, ps],
      );
      this.addPair(newPair);
    } else {
      // 参加者を既存のペアに追加する
      pair.joinMember(ps);
    }
  }

  /**
   * チームに参加者を追加します。
   * 休会中として既に所属していた場合、在籍中へ変更します。
   * 参加者を追加できるペアがない場合、ペアを分割します。
   *
   * @param participantId 参加者id
   * @returns エラー
   */
  joinParticipant(participantId: ParticipantIdType): Option<Error> {
    if (
      this.getZaisekiMember().some((m) => m.participantId === participantId)
    ) {
      return some(new Error('既に在籍中の参加者です。'));
    }
    if (this.isMember(participantId)) {
      // 休会中としてペアに所属している場合は、一度取り除く
      const exPair = this.findPair(participantId);
      exPair.removeMember(participantId);
    }

    // チーム内で最小のペア
    const pair = this.getSmallestPair();
    const ps = ParticipantStatus.create(
      participantId,
      ParticipantStatusValues.Zaiseki,
    );
    if (pair.isFullMember()) {
      // 既存のペアを分割する
      const newPartner = randomChoice<ParticipantStatus>([
        ...pair.getZaisekiMember(),
      ]);
      pair.removeMember(newPartner.participantId);
      // 新しいペアを作成する
      const newPair = Pair.create(
        createRandomIdString(),
        this.getUnusedPairName(),
        [newPartner, ps],
      );
      this.addPair(newPair);
    } else {
      // 参加者を既存のペアに追加する
      pair.joinMember(ps);
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
    if (!this.isMember(participantId)) {
      return some(new Error('メンバーではありません'));
    }
    // 参加者が所属していたペアを取得
    const exPair = this.findPair(participantId);
    if (exPair.isFullMember()) {
      exPair.suspendMember(participantId);
    } else {
      // 休会中の参加者がいる可能がある
      const others = exPair.getAllMember();
      // 合流先ペアを取得する前に既存のペアを取り除く
      this.removePair(exPair);
      // 合流先ペアを取得する
      const anotherPair = this.getSmallestPair();
      if (anotherPair.isFullMember()) {
        // ペアを分割する
        const newPartner = randomChoice<ParticipantStatus>([
          ...anotherPair.getZaisekiMember(),
        ]);
        anotherPair.removeMember(newPartner.participantId);
        const newPair = Pair.create(
          createRandomIdString(),
          this.getUnusedPairName(),
          [newPartner, ...others],
        );
        newPair.suspendMember(participantId);
        this.addPair(newPair);
      } else {
        anotherPair.joinMember(...others);
        anotherPair.suspendMember(participantId);
      }
    }
    return none;
  }

  /**
   * チームから引数の参加者を取り除きます。
   * 対象参加者を取り除いたペアの人数が1人となった場合、ペアを再編成します。
   *
   * @param participant 取り除く参加者のid
   */
  removeParticipant(participantId: ParticipantIdType): Option<Error> {
    if (!this.isMember(participantId)) {
      return some(new Error('メンバーではありません'));
    }
    // 参加者が所属していたペアを取得
    const exPair = this.findPair(participantId);
    if (exPair.isFullMember()) {
      // 3人ペアであればそのまま参加者を取り除く
      exPair.removeMember(participantId);
    } else {
      // 2人ペアであればペアを解散し、もう片方の参加者を別ペアに合流する
      const others = exPair.getAllMember();
      this.removePair(exPair);
      // 合流先ペアを取得する
      const anotherPair = this.getSmallestPair();
      if (anotherPair.isFullMember()) {
        // 合流先のペアが3人の場合、ペアを分割する
        const newPartner = randomChoice<ParticipantStatus>([
          ...anotherPair.getZaisekiMember(),
        ]);
        anotherPair.removeMember(newPartner.participantId);
        const newPair = Pair.create(
          createRandomIdString(),
          this.getUnusedPairName(),
          [newPartner, ...others],
        );
        newPair.removeMember(participantId);
        this.addPair(newPair);
      } else {
        // 合流先のペアが2人の場合、そのまま合流する
        anotherPair.joinMember(...others);
        anotherPair.removeMember(participantId);
      }
    }
    return none;
  }

  /**
   * 参加者がこのペアに含まれているか判定します。
   *
   * @param participantId 参加者id
   * @returns 含まれている場合...true, 含まれていない場合...false
   */
  private isMember(participantId: ParticipantIdType): boolean {
    return this.getAllMember()
      .map((ps) => ps.participantId)
      .some((pid) => pid === participantId);
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
      ...this.pairs.map((p) => p.getZaisekiMember().length),
    );
    return randomChoice<Pair>(
      this.pairs.filter((p) => p.getZaisekiMember().length === minLength),
    );
  }

  /**
   * チーム内で使われていないペア名を取得します。
   *
   * @returns 未使用のペア名
   */
  private getUnusedPairName(): PairName {
    const usedPairNameSet = new Set(
      this.pairs.map((pair) => pair.name.getValue().toString()),
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

  private constructor(
    readonly id: TeamIdType,
    readonly name: TeamName,
    private pairs: Pair[],
  ) {
    super(id);
  }

  private static validate(
    pairs: {
      pairId: string;
      pairName: string;
      member: { participantId: string; status: string }[];
    }[],
  ) {
    const zaisekiMember = pairs
      .flatMap((p) => p.member)
      .filter((m) => m.status === ParticipantStatusValues.Zaiseki);
    if (zaisekiMember.length < 3) {
      throw new Error('チームの参加者は3名以上です。: ' + zaisekiMember.length);
    }
  }

  public static create(
    id: string,
    name: string,
    pairs: {
      pairId: string;
      pairName: string;
      member: { participantId: string; status: string }[];
    }[],
  ): Team {
    this.validate(pairs);
    return new Team(
      id as TeamIdType,
      TeamName.create(name),
      this.createPairs([...pairs]),
    );
  }

  private static createPairs(
    pairs: {
      pairId: string;
      pairName: string;
      member: { participantId: string; status: string }[];
    }[],
  ): Pair[] {
    return pairs.map((p) =>
      Pair.create(
        p.pairId,
        PairName.create(p.pairName),
        this.createMember(p.member),
      ),
    );
  }

  private static createMember(
    member: { participantId: string; status: string }[],
  ): ParticipantStatus[] {
    return member.map((m) =>
      ParticipantStatus.create(m.participantId, m.status),
    );
  }
}

type PairIdType = Brand<string, 'PairId'>;

class Pair extends Entity2<PairIdType> {
  private static readonly MIN_PAIR_MEMBER_SIZE = 2;
  private static readonly MAX_PAIR_MEMBER_SIZE = 3;

  /**
   * ペアに所属する全ての参加者を取得します。
   *
   * @returns 全メンバー
   */
  getAllMember(): ParticipantStatus[] {
    return [...this.member.sort(sortByParticipantIdType)];
  }

  /**
   * ペアに所属する在籍中のメンバーを取得します。
   *
   * @returns 在籍中のメンバー
   */
  getZaisekiMember(): ParticipantStatus[] {
    return [
      ...this.member.filter((m) => m.isZaiseki()).sort(sortByParticipantIdType),
    ];
  }

  /**
   * ペアに参加者を追加します。
   * ペアに休会中のその参加者がいる場合、ステータスを変更します。
   *
   * @param participantId 参加者id
   */
  joinMember(...psList: ParticipantStatus[]) {
    if (this.isFullMember()) {
      throw new Error(`ペアは${Pair.MAX_PAIR_MEMBER_SIZE}名までです。`);
    }
    for (const ps of psList) {
      if (this.isMember(ps.participantId)) {
        // 休会中の場合、在籍中へ変更する
        const participant = this.member.filter(
          (m) => m.participantId == ps.participantId,
        )[0];
        participant.changeStatus(Zaiseki);
      }
      this.member.push(ps);
    }
  }

  /**
   * 所属中の参加者を休会中へ変更します。
   * 注意: ペアに所属したままです。
   *
   * @param participantId 参加者id
   */
  suspendMember(participantId: ParticipantIdType) {
    if (this.getZaisekiMember().length <= Pair.MIN_PAIR_MEMBER_SIZE) {
      throw new Error(
        `ペアの最低人数: ${Pair.MIN_PAIR_MEMBER_SIZE} を下回ります。`,
      );
    }
    const index = this.member
      .map((m) => m.participantId)
      .indexOf(participantId);
    if (index < 0) {
      throw new Error('この参加者はペアの一員ではありません。');
    }
    this.member[index].changeStatus(Kyukai);
  }

  /**
   * ペアから参加者を取り除きます。
   *
   * @param participantId 参加者id
   */
  removeMember(participantId: ParticipantIdType) {
    const index = this.member
      .map((m) => m.participantId)
      .indexOf(participantId);
    if (index < 0) {
      throw new Error('この参加者はペアの一員ではありません。');
    }
    this.member.splice(index, 1);
  }

  /**
   * 参加者がこのペアに含まれているか判定します。
   *
   * @param participantId 参加者id
   * @returns 含まれている場合...true, 含まれていない場合...false
   */
  isMember(participantId: ParticipantIdType): boolean {
    return this.member
      .map((m) => m.participantId)
      .some((id) => id === participantId);
  }

  /**
   * ペアが最大人数か判定します。
   *
   * @returns ペアが最大人数の場合...true, ペアが最大人数ではない場合...false
   */
  isFullMember(): boolean {
    return this.getZaisekiMember().length >= Pair.MAX_PAIR_MEMBER_SIZE;
  }

  private constructor(
    readonly id: PairIdType,
    readonly name: PairName,
    private member: ParticipantStatus[],
  ) {
    super(id);
  }

  private static validate(member: ParticipantStatus[]) {
    const zaisekiMember = member.filter((m) => m.isZaiseki());
    if (
      zaisekiMember.length < Pair.MIN_PAIR_MEMBER_SIZE ||
      zaisekiMember.length > Pair.MAX_PAIR_MEMBER_SIZE
    ) {
      throw new Error('ペアは2名または3名です。: ' + zaisekiMember.length);
    }
  }

  public static create(
    id: string,
    name: PairName,
    member: ParticipantStatus[],
  ): Pair {
    this.validate(member);
    return new Pair(id as PairIdType, name, [...member]);
  }
}

const ParticipantStatusValues = {
  Zaiseki: '在籍中',
  Kyukai: '休会中',
  Taikai: '退会済',
} as const;

/** 在籍中 */
const Zaiseki = Symbol(ParticipantStatusValues.Zaiseki);
/** 休会中 */
const Kyukai = Symbol(ParticipantStatusValues.Kyukai);
/** 退会済 */
const Taikai = Symbol(ParticipantStatusValues.Taikai);
/** 参加者在籍ステータス */
type ParticipantStatusValue = typeof Zaiseki | typeof Kyukai | typeof Taikai;

const convert = (status: string) => {
  switch (status) {
    case ParticipantStatusValues.Zaiseki:
      return right(Zaiseki);
    case ParticipantStatusValues.Kyukai:
      return right(Kyukai);
    case ParticipantStatusValues.Taikai:
      return right(Taikai);
  }
  return left(
    new Error(
      '不正な値です。在籍中, 休会中, 退会済を指定してください。: ' + status,
    ),
  );
};

const getParticipantStatusValue = (status: ParticipantStatusValue) => {
  switch (status) {
    case Zaiseki:
      return ParticipantStatusValues.Zaiseki;
    case Kyukai:
      return ParticipantStatusValues.Kyukai;
    case Taikai:
      return ParticipantStatusValues.Taikai;
  }
};

type ParticipantStatusIdType = Brand<string, 'ParticipantStatusId'>;

/**
 * 参加者ステータス
 */
class ParticipantStatus extends Entity2<ParticipantStatusIdType> {
  getStatusValue(): string {
    return getParticipantStatusValue(this.status);
  }

  changeStatus(status: ParticipantStatusValue) {
    this.status = status;
  }

  isZaiseki(): boolean {
    return this.status === Zaiseki;
  }

  isKyukai(): boolean {
    return this.status === Kyukai;
  }

  private constructor(
    id: ParticipantStatusIdType,
    readonly participantId: ParticipantIdType,
    private status: ParticipantStatusValue,
  ) {
    super(id);
  }

  public static create(
    participantId: string,
    status: string,
  ): ParticipantStatus {
    const result = convert(status);
    if (isLeft(result)) {
      throw new Error(result.left.message);
    }
    const psValue = result.right;
    return new ParticipantStatus(
      createRandomIdString() as ParticipantStatusIdType,
      participantId as ParticipantIdType,
      psValue,
    );
  }
}

const sortByParticipantIdType = (
  ps1: ParticipantStatus,
  ps2: ParticipantStatus,
) => {
  if (ps1.participantId < ps2.participantId) {
    return -1;
  }
  if (ps1.participantId > ps2.participantId) {
    return 1;
  }
  return 0;
};
