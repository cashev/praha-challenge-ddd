import { ParticipantIdType } from 'src/domain/entity/participant';
import { TaskStatusService } from '../taskStatus-service';
import { Yet } from 'src/domain/value-object/taskStatusValue';
import { TaskIdDto } from 'src/app/query-service-interface/task-qs';

describe('createAllTaskStatusForNewParticipant', () => {
  const createMockQS = (dtos: TaskIdDto[]) => {
    return {
      getAll: jest.fn().mockResolvedValue(dtos),
    };
  };

  test('[正常系]', async () => {
    const dtos = [];
    for (let i = 1; i <= 80; i++) {
      dtos.push(new TaskIdDto({ id: i.toString() }));
    }
    const service = new TaskStatusService(createMockQS(dtos));
    const result = await service.createTaskStatusForNewParticipant(
      '4' as ParticipantIdType,
    );
    expect(result.length).toBe(80);
    expect(result.every((ts) => ts.status === Yet)).toBeTruthy();
    expect(new Set(result.map((ts) => ts.id)).size).toBe(80);
    expect(result.every((ts) => ts.participantId === '4')).toBeTruthy();
    expect(new Set(result.map((ts) => ts.taskId)).size).toBe(80);
  });
});
