import { Participant, ParticipantIdType } from 'src/domain/entity/participant';
import { Team } from 'src/domain/entity/team';
import { IParticipantRepository } from 'src/domain/repository-interface/participant-repository';
import { ITaskStatusRepository } from 'src/domain/repository-interface/taskStatus-repository';
import { ITeamRepository } from 'src/domain/repository-interface/team-repository';
import { ParticipantEmail } from 'src/domain/value-object/participantEmail';
import { ParticipantName } from 'src/domain/value-object/participantName';
import { Zaiseki } from 'src/domain/value-object/participantStatus';
import { randomChoice } from 'src/util/random';
import { ITaskIdQS } from './query-service-interface/task-qs';
import { TaskStatusService } from 'src/domain/service/taskStatus-service';
import { createRandomIdString } from 'src/util/random';
import { Option, isNone, isSome, none, some } from 'fp-ts/lib/Option';
import { TaskIdType, TaskStatus } from 'src/domain/entity/taskStatus';

/**
 * 参加者を新規追加するユースケース
 */
export class JoinNewParticipantUsecase {
  private participantRepo: IParticipantRepository;
  private teamRepo: ITeamRepository;
  private taskStatusRepo: ITaskStatusRepository;
  private qs: ITaskIdQS;

  constructor(
    participantRepo: IParticipantRepository,
    teamRepo: ITeamRepository,
    taskStatusRepo: ITaskStatusRepository,
    qs: ITaskIdQS,
  ) {
    this.participantRepo = participantRepo;
    this.teamRepo = teamRepo;
    this.taskStatusRepo = taskStatusRepo;
    this.qs = qs;
  }

  /**
   * 参加者を新規追加、チームへ追加、課題の進捗ステータスを作成します。
   *
   * @param name 参加者の名前
   * @param email 参加者のメールアドレス
   */
  async do(name: string, email: string): Promise<Option<Error>> {
    if (isSome(await this.participantRepo.findByEmail(email))) {
      // メールアドレス重複チェック
      return some(new Error('メールアドレスが重複しています。'));
    }
    // 参加者を新規参加
    const newParticipant = Participant.create(createRandomIdString(), {
      name: ParticipantName.create(name),
      email: ParticipantEmail.create(email),
      status: Zaiseki,
    });
    await this.participantRepo.save(newParticipant);
    // 新規参加者をチームに追加する
    const team = await this.findTeam();
    team.addParticipant(newParticipant);
    await this.teamRepo.save(team);
    // 各課題について未着手の進捗ステータスを作成する
    const taskStatusList = await this.createTaskStatusList(newParticipant.id);
    await this.taskStatusRepo.saveAll(taskStatusList);
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
