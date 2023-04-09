import { Done, TaskStatusValue } from '../value-object/taskStatusValue';
import { Brand } from '../value-object/valueObject';
import { Entity } from './entity';
import { ParticipantIdType } from './participant';

type TaskStatusIdType = Brand<number, 'TaskStatusId'>;
export type TaskIdType = Brand<number, 'TaskId'>;

interface TaskStatusProps {
  participantId: ParticipantIdType;
  taskId: TaskIdType;
  status: TaskStatusValue;
}

export class TaskStatus extends Entity<TaskStatusIdType, TaskStatusProps> {
  private constructor(id: TaskStatusIdType, props: TaskStatusProps) {
    super(id, props);
  }

  public static create(id: number, props: TaskStatusProps): TaskStatus {
    return new TaskStatus(id as TaskStatusIdType, props);
  }

  get id(): TaskStatusIdType {
    return this._id;
  }

  get participantId(): ParticipantIdType {
    return this.props.participantId;
  }

  get taskId(): TaskIdType {
    return this.props.taskId;
  }

  get status(): TaskStatusValue {
    return this.props.status;
  }

  set status(status: TaskStatusValue) {
    if (this.props.status === Done) {
      throw Error('完了から他のステータスへの変更できません。');
    }
    this.props.status = status;
  }
}
