import { Pair } from 'src/domain/entity/pair';
import { Team } from 'src/domain/entity/team';
import { Zaiseki } from 'src/domain/value-object/userStatus';
import { randomChoice } from 'src/util/RandomChoice';
import { ITeamRepository } from '../domain/repository-interface/team-repository';
import { IUserRepository } from '../domain/repository-interface/user-repository';
import { User } from 'src/domain/entity/user';

// 休会中, 退会済の参加者が復帰するユースケース
export class ComebackUserUseCase {
  private readonly userRepo: IUserRepository;
  private readonly teamRepo: ITeamRepository;

  constructor(userRepo: IUserRepository, teamRepo: ITeamRepository) {
    this.userRepo = userRepo;
    this.teamRepo = teamRepo;
  }

  async do(userId: number) {
    const user = await this.userRepo.find(userId);
    this.validate(user);

    const team = await this.getSmallestTeam();
    const pair = team.getSmallestPair();

    user.status = Zaiseki;
    this.userRepo.save(user);
    if (pair.isFullMember()) {
      const existingUser = randomChoice<User>([...pair.member]);
      pair.removeMember(existingUser);
      const newPair = Pair.create(await this.teamRepo.getNextPairId(), {
        pairName: team.getUnusedPairName(),
        member: [existingUser, user],
      });
      team.addPair(newPair);
    } else {
      pair.addMember(user);
    }
    this.teamRepo.save(team);
  }

  private validate(user: User) {
    if (user == null) {
      throw new Error('存在しない参加者です。');
    }
    if (user.status === Zaiseki) {
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
