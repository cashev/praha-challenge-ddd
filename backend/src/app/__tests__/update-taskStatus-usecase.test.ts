import { TaskIdType, TaskStatus } from 'src/domain/entity/taskStatus';
import { Yet, Waiting, Done } from 'src/domain/value-object/taskStatusValue';
import { UpdateTaskStatusUseCase } from '../update-taskStatus-usecase';
import { ParticipantIdType } from 'src/domain/entity/participant';

describe('do', () => {
  test('[正常系] 未着手->レビュー待ち', async () => {
    const taskStatus = TaskStatus.create('1', {
      participantId: '1' as ParticipantIdType,
      taskId: '1' as TaskIdType,
      status: Yet,
    });
    const mockTaskStatusRepo = {
      find: jest.fn().mockResolvedValue(taskStatus),
      getNextIdAndSetNext: jest.fn(),
      save: jest.fn(),
      saveAll: jest.fn(),
    };

    const usecase = new UpdateTaskStatusUseCase(mockTaskStatusRepo);
    await usecase.do(1, 1, 'レビュー待ち');
    expect(taskStatus.status).toBe(Waiting);
  });

  test('[正常系] レビュー待ち->完了', async () => {
    const taskStatus = TaskStatus.create('1', {
      participantId: '1' as ParticipantIdType,
      taskId: '1' as TaskIdType,
      status: Waiting,
    });
    const mockTaskStatusRepo = {
      find: jest.fn().mockResolvedValue(taskStatus),
      getNextIdAndSetNext: jest.fn(),
      save: jest.fn(),
      saveAll: jest.fn(),
    };

    const usecase = new UpdateTaskStatusUseCase(mockTaskStatusRepo);
    await usecase.do(1, 1, '完了');
    expect(taskStatus.status).toBe(Done);
  });

  test('[正常系] 未着手->完了', async () => {
    const taskStatus = TaskStatus.create('1', {
      participantId: '1' as ParticipantIdType,
      taskId: '1' as TaskIdType,
      status: Yet,
    });
    const mockTaskStatusRepo = {
      find: jest.fn().mockResolvedValue(taskStatus),
      getNextIdAndSetNext: jest.fn(),
      save: jest.fn(),
      saveAll: jest.fn(),
    };

    const usecase = new UpdateTaskStatusUseCase(mockTaskStatusRepo);
    await usecase.do(1, 1, '完了');
    expect(taskStatus.status).toBe(Done);
  });

  test('[異常系] 完了->未着手', async () => {
    const taskStatus = TaskStatus.create('1', {
      participantId: '1' as ParticipantIdType,
      taskId: '1' as TaskIdType,
      status: Done,
    });
    const mockTaskStatusRepo = {
      find: jest.fn().mockResolvedValue(taskStatus),
      getNextIdAndSetNext: jest.fn(),
      save: jest.fn(),
      saveAll: jest.fn(),
    };

    const usecase = new UpdateTaskStatusUseCase(mockTaskStatusRepo);
    await expect(usecase.do(1, 1, '未着手')).rejects.toThrow();
  });

  test('[異常系] 完了->レビュー待ち', async () => {
    const taskStatus = TaskStatus.create('1', {
      participantId: '1' as ParticipantIdType,
      taskId: '1' as TaskIdType,
      status: Done,
    });
    const mockTaskStatusRepo = {
      find: jest.fn().mockResolvedValue(taskStatus),
      getNextIdAndSetNext: jest.fn(),
      save: jest.fn(),
      saveAll: jest.fn(),
    };

    const usecase = new UpdateTaskStatusUseCase(mockTaskStatusRepo);
    await expect(usecase.do(1, 1, 'レビュー待ち')).rejects.toThrow();
  });
});
