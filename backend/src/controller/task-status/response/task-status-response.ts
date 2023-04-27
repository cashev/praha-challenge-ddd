import { ApiProperty } from '@nestjs/swagger';
import { ParticipantDto } from 'src/app/query-service-interface/participant-qs';
import { TaskStatusDto } from 'src/app/query-service-interface/task-status-qs';

export class GetTaskStatusResponse {
  taskStatusData: TaskStatusData[];

  public constructor(params: { taskStatusList: TaskStatusDto[] }) {
    const { taskStatusList } = params;
    this.taskStatusData = taskStatusList.map(
      (dto) => new TaskStatusData({ ...dto }),
    );
  }
}

class TaskStatusData {
  @ApiProperty()
  id: string;
  @ApiProperty()
  participantId: string;
  @ApiProperty()
  taskId: string;
  @ApiProperty()
  status: string;

  public constructor(params: {
    id: string;
    participantId: string;
    taskId: string;
    status: string;
  }) {
    this.id = params.id;
    this.participantId = params.participantId;
    this.taskId = params.taskId;
    this.status = params.status;
  }
}

export class GetByTaskStatusResponse {
  @ApiProperty({ type: () => [ParticipantData] })
  participantData: ParticipantData[];

  public constructor(params: { participants: ParticipantDto[] }) {
    const { participants } = params;
    this.participantData = participants.map(
      (p) => new ParticipantData({ ...p }),
    );
  }
}

class ParticipantData {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  status: string;

  public constructor(params: {
    id: string;
    name: string;
    email: string;
    status: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.status = params.status;
  }
}
