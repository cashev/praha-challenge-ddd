import { randomChoice } from 'src/util/random';
import { createRandomIdString } from 'src/util/random';
import { Option, isNone, isSome, none, some } from 'fp-ts/lib/Option';
import { IParticipantRepository } from '../domain/repository-interface/participant-repository';
import { ITeamRepository } from '../domain/repository-interface/team-repository';
import { ITaskStatusRepository } from '../domain/repository-interface/taskStatus-repository';
import { ITaskIdQS } from 'src/query/usecase/query-service-interface/task-qs';
import { Participant, ParticipantIdType } from '../domain/entity/participant';
import { ParticipantName } from '../domain/value-object/participantName';
import { ParticipantEmail } from '../domain/value-object/participantEmail';
import { Team } from '../domain/entity/team';
import { TaskIdType, TaskStatus } from '../domain/entity/taskStatus';
import { TaskStatusService } from '../domain/service/taskStatus-service';

/**
 * 参加者を新規追加するユースケース
 */
export class JoinNewParticipantUsecase {
  constructor(
    private readonly participantRepo: IParticipantRepository,
    private readonly teamRepo: ITeamRepository,
    private readonly taskStatusRepo: ITaskStatusRepository,
    private readonly qs: ITaskIdQS,
  ) {}

  /**
   * 参加者を新規追加、チームへ追加、課題の進捗ステータスを作成します。
   *
   * @param name 参加者の名前
   * @param email 参加者のメールアドレス
   */
  async do(name: string, email: string): Promise<Option<Error>> {
    const validateResult = await this.validate(email);
    if (isSome(validateResult)) {
      return validateResult;
    }
    // 参加者を新規参加
    const newParticipant = Participant.create(
      createRandomIdString(),
      ParticipantName.create(name),
      ParticipantEmail.create(email),
    );
    // 新規参加者をチームに追加する
    const team = await this.findTeam();
    const joinResult = team.joinParticipant(newParticipant.id);
    if (isSome(joinResult)) {
      return joinResult;
    }
    // 各課題について未着手の進捗ステータスを作成する
    const taskStatusList = await this.createTaskStatusList(newParticipant.id);
    await this.participantRepo.save(newParticipant);
    await this.teamRepo.save(team);
    await this.taskStatusRepo.saveAll(taskStatusList);
    return none;
  }

  private async validate(email: string): Promise<Option<Error>> {
    if (isSome(await this.participantRepo.findByEmail(email))) {
      // メールアドレス重複チェック
      return some(new Error('メールアドレスが重複しています。'));
    }
    return none;
  }

  private async findTeam(): Promise<Team> {
    const tResult = await this.teamRepo.getSmallestTeamList();
    if (isNone(tResult)) {
      throw new Error('チームが見つかりませんでした。');
    }
    const teams = tResult.value;
    if (teams.length == 0) {
      throw new Error('チームが見つかりませんでした。');
    }
    return randomChoice<Team>(teams);
  }

  private async createTaskStatusList(
    participantId: ParticipantIdType,
  ): Promise<TaskStatus[]> {
    const tsService = new TaskStatusService();
    const taskStatusList = tsService.createTaskStatusForNewParticipant(
      participantId,
      (await this.qs.getAll()).map((dto) => dto.id as TaskIdType),
    );
    return taskStatusList;
  }
}
