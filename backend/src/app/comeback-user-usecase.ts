import { Pair } from 'src/domain/entity/pair';
import { Team } from 'src/domain/entity/team';
import { User } from 'src/domain/entity/user';
import { Zaiseki } from 'src/domain/value-object/userStatus';
import { IPairRepository } from './repository-interface/pair-repository';
import { ITeamRepository } from './repository-interface/team-repository';
import { IUserRepository } from './repository-interface/user-repository';

// 休会中, 退会済の参加者が復帰するユースケース
export class ComebackUserUseCase {
  private readonly userRepo: IUserRepository;
  private readonly teamRepo: ITeamRepository;
  private readonly pairRepo: IPairRepository;

  constructor(
    userRepo: IUserRepository,
    teamRepo: ITeamRepository,
    pairRepo: IPairRepository,
  ) {
    this.userRepo = userRepo;
    this.teamRepo = teamRepo;
    this.pairRepo = pairRepo;
  }

  async do(userId: number) {
    const user = await this.userRepo.find(userId);
    this.validate(user);

    const team = await this.getSmallestTeam();
    const pair = await this.getSmallestPair(team.id);

    if (pair.isFullMember()) {
      // todo
    }
  }

  private validate(user: User) {
    if (user == null) {
      throw new Error('存在しない参加者です。');
    }
    if (user.status == Zaiseki) {
      throw new Error('在籍中の参加者です。');
    }
  }

  private randomChoice<T>(list: T[]): T {
    return list[Math.floor(Math.random() * list.length)];
  }

  private async getSmallestTeam(): Promise<Team> {
    const teams = await this.teamRepo.getSmallestTeamList();
    return this.randomChoice<Team>(teams);
  }

  private async getSmallestPair(teamId: number): Promise<Pair> {
    const pairs = await this.pairRepo.getSmallestPairList(teamId);
    return this.randomChoice<Pair>(pairs);
  }

  // private async createNextPairName(basePairName: PairName): Promise<PairName> {
  //   const pairService = new PairService(this.pairRepo);
  //   let tmp = String.fromCharCode(basePairName.value.charCodeAt(0) + 1);
  //   while(pairService.isDuplicated(PairName.create(tmp))) {
  //     tmp = tmp === 'z' ? 'a' : String.fromCharCode(tmp.charCodeAt(0) + 1);
  //     if (tmp == basePairName.value) {
  //       throw new Error('使用可能なペア名がありません。')
  //     }
  //   }
  //   return PairName.create(tmp);
  // }
}
