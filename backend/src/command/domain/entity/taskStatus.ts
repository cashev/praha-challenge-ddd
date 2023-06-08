import { Done, TaskStatusValue } from '../value-object/taskStatusValue';
import { Brand } from '../value-object/valueObject';
import { Entity } from './entity';
import { ParticipantIdType } from './participant';

type TaskStatusIdType = Brand<string, 'TaskStatusId'>;
export type TaskIdType = Brand<string, 'TaskId'>;

export class TaskStatus extends Entity<TaskStatusIdType> {
  private _status: TaskStatusValue;

  private constructor(
    public readonly id: TaskStatusIdType,
    public readonly participantId: ParticipantIdType,
    public readonly taskId: TaskIdType,
    status: TaskStatusValue,
  ) {
    super(id);
    this._status = status;
  }

  public static create(
    id: string,
    params: {
      participantId: ParticipantIdType;
      taskId: TaskIdType;
      status: TaskStatusValue;
    },
  ): TaskStatus {
    const { participantId, taskId, status } = params;
    return new TaskStatus(
      id as TaskStatusIdType,
      participantId,
      taskId,
      status,
    );
  }

  get status(): TaskStatusValue {
    return this._status;
  }

  set status(status: TaskStatusValue) {
    if (this._status === Done) {
      throw Error('完了から他のステータスへの変更できません。');
    }
    this._status = status;
  }
}
