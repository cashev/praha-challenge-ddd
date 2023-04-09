import { ParticipantIdType } from 'src/domain/entity/participant';
import { TaskStatusService } from '../taskStatus-service';
import { Yet } from 'src/domain/value-object/taskStatusValue';

describe('createAllTaskStatusForNewParticipant', () => {
  const mockTaskStatusRepo = () => {
    return {
      find: jest.fn(),
      getNextIdAndSetNext: jest.fn().mockResolvedValue(321),
      save: jest.fn(),
      saveAll: jest.fn(),
    };
  };

  test('[正常系]', async () => {
    const taskIds = [];
    for (let i = 1; i <= 80; i++) {
      taskIds.push(i);
    }
    const service = new TaskStatusService(mockTaskStatusRepo());
    const result = await service.createTaskStatusForNewParticipant(
      4 as ParticipantIdType,
      taskIds,
    );
    expect(result.length).toBe(80);
    expect(result.every((ts) => ts.status === Yet)).toBeTruthy();
    expect(Math.min(...result.map((ts) => ts.id as number))).toBe(321);
    expect(Math.max(...result.map((ts) => ts.id as number))).toBe(400);
    expect(new Set(result.map((ts) => ts.id)).size).toBe(80);
    expect(result.every((ts) => ts.participantId === 4)).toBeTruthy();
    expect(Math.min(...result.map((ts) => ts.taskId as number))).toBe(1);
    expect(Math.max(...result.map((ts) => ts.taskId as number))).toBe(80);
    expect(new Set(result.map((ts) => ts.taskId)).size).toBe(80);
  });
});
