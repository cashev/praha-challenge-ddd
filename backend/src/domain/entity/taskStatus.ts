import { Done, TaskStatusValue } from '../value-object/taskStatusValue';
import { Entity } from './entity';

interface TaskStatusProps {
  status: TaskStatusValue;
}

export class TaskStatus extends Entity<TaskStatusProps> {
  private constructor(id: number, props: TaskStatusProps) {
    super(id, props);
  }

  public static create(id: number, props: TaskStatusProps): TaskStatus {
    return new TaskStatus(id, props);
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
