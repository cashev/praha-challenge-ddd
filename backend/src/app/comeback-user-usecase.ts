import { Pair } from 'src/domain/entity/pair';
import { Team } from 'src/domain/entity/team';
import { Zaiseki } from 'src/domain/value-object/userStatus';
import { randomChoice } from 'src/util/RandomChoice';
import { IUserQS, UserDto } from './query-service-interface/user-qs';
import { IPairQS } from './query-service-interface/pair-qs';
import { ITeamRepository } from './repository-interface/team-repository';
import { IUserRepository } from './repository-interface/user-repository';

// 休会中, 退会済の参加者が復帰するユースケース
export class ComebackUserUseCase {
  private readonly userRepo: IUserRepository;
  private readonly userQS: IUserQS;
  private readonly teamRepo: ITeamRepository;
  private readonly pairRepo: IPairQS;

  constructor(
    userQS: IUserQS,
    teamRepo: ITeamRepository,
    pairRepo: IPairQS,
  ) {
    this.userQS = userQS;
    this.teamRepo = teamRepo;
    this.pairRepo = pairRepo;
  }

  async do(userId: number) {
    const userDto = await this.userQS.findById(userId);
    this.validate(userDto);

    const team = await this.getSmallestTeam();
    // const pair = await this.getSmallestPair(team.id);

    // if (pair.isFullMember()) {
    //   // todo
    // }
  }

  private validate(userDto: UserDto | null) {
    if (userDto == null) {
      throw new Error('存在しない参加者です。');
    }
    if (userDto.status === Zaiseki.toString()) {
      throw new Error('在籍中の参加者です。');
    }
  }

  private async getSmallestTeam(): Promise<Team> {
    const teams = await this.teamRepo.getSmallestTeamList();
    return randomChoice<Team>(teams);
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
