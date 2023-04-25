import { ParticipantIdType } from 'src/domain/entity/participant';
import { TaskStatusService } from '../taskStatus-service';
import { Yet } from 'src/domain/value-object/taskStatusValue';
import { TaskIdType } from 'src/domain/entity/taskStatus';

describe('createAllTaskStatusForNewParticipant', () => {
  test('[正常系]', async () => {
    const taskIds = [];
    for (let i = 1; i <= 80; i++) {
      taskIds.push(i.toString() as TaskIdType);
    }
    const service = new TaskStatusService();
    const result = await service.createTaskStatusForNewParticipant(
      '4' as ParticipantIdType,
      taskIds,
    );
    expect(result.length).toBe(80);
    expect(result.every((ts) => ts.status === Yet)).toBeTruthy();
    expect(new Set(result.map((ts) => ts.id)).size).toBe(80);
    expect(result.every((ts) => ts.participantId === '4')).toBeTruthy();
    expect(new Set(result.map((ts) => ts.taskId)).size).toBe(80);
  });
});
