import { Participant } from 'src/domain/entity/participant';
import { Team } from 'src/domain/entity/team';
import { IParticipantRepository } from 'src/domain/repository-interface/participant-repository';
import { ITaskStatusRepository } from 'src/domain/repository-interface/taskStatus-repository';
import { ITeamRepository } from 'src/domain/repository-interface/team-repository';
import { ParticipantEmail } from 'src/domain/value-object/participantEmail';
import { ParticipantName } from 'src/domain/value-object/participantName';
import { Zaiseki } from 'src/domain/value-object/participantStatus';
import { randomChoice } from 'src/util/RandomChoice';
import { ITaskQS } from './query-service-interface/task-qs';
import { TaskStatusService } from 'src/domain/service/taskStatus-service';
import { createRandomIdString } from 'src/util/random';

export class JoinNewParticipantUsecase {
  private participantRepo: IParticipantRepository;
  private teamRepo: ITeamRepository;
  private taskStatusRepo: ITaskStatusRepository;
  private taskQS: ITaskQS;

  constructor(
    participantRepo: IParticipantRepository,
    teamRepo: ITeamRepository,
    taskStatusRepo: ITaskStatusRepository,
    taskQS: ITaskQS,
  ) {
    this.participantRepo = participantRepo;
    this.teamRepo = teamRepo;
    this.taskStatusRepo = taskStatusRepo;
    this.taskQS = taskQS;
  }

  // 参加者を新規追加するユースケース
  async do(name: string, email: string) {
    const newParticipant = Participant.create(createRandomIdString(), {
      participantName: ParticipantName.create(name),
      email: ParticipantEmail.create(email),
      status: Zaiseki,
    });
    await this.participantRepo.save(newParticipant);
    // チームへ参加
    const teams = await this.teamRepo.getSmallestTeamList();
    if (teams == null) {
      throw new Error();
    }
    const team = randomChoice<Team>(teams);
    team.addParticipant(newParticipant);
    this.teamRepo.save(team);
    // タスクを割り当て
    const taskIds = (await this.taskQS.getAll()).map((t) => t.id);
    const tsService = new TaskStatusService();
    const taskStatusList = await tsService.createTaskStatusForNewParticipant(
      newParticipant.id,
      taskIds,
    );
    this.taskStatusRepo.saveAll(taskStatusList);
  }
}
