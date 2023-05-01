import { TaskIdType, TaskStatus } from 'src/domain/entity/taskStatus';
import {
  Yet,
  Waiting,
  Done,
  TaskStatusValue,
} from 'src/domain/value-object/taskStatusValue';
import { UpdateTaskStatusUseCase } from '../update-taskStatus-usecase';
import { ParticipantIdType } from 'src/domain/entity/participant';
import { isSome, some } from 'fp-ts/lib/Option';
import { MockTaskStatusRepository } from './mock/taskStatus-repository';
import { createRandomIdString } from 'src/util/random';

describe('do', () => {
  const createTaskStatus = (status: TaskStatusValue) => {
    return TaskStatus.create(createRandomIdString(), {
      participantId: '1' as ParticipantIdType,
      taskId: '1' as TaskIdType,
      status,
    });
  };

  test('[正常系] 未着手->レビュー待ち', async () => {
    const taskStatus = createTaskStatus(Yet);
    const mockTaskStatusRepo = new MockTaskStatusRepository(some(taskStatus));

    const usecase = new UpdateTaskStatusUseCase(mockTaskStatusRepo);
    await usecase.do('1', '1', 'レビュー待ち');
    expect(taskStatus.status).toBe(Waiting);
  });

  test('[正常系] レビュー待ち->完了', async () => {
    const taskStatus = createTaskStatus(Waiting);
    const mockTaskStatusRepo = new MockTaskStatusRepository(some(taskStatus));

    const usecase = new UpdateTaskStatusUseCase(mockTaskStatusRepo);
    await usecase.do('1', '1', '完了');
    expect(taskStatus.status).toBe(Done);
  });

  test('[正常系] 未着手->完了', async () => {
    const taskStatus = createTaskStatus(Yet);
    const mockTaskStatusRepo = new MockTaskStatusRepository(some(taskStatus));

    const usecase = new UpdateTaskStatusUseCase(mockTaskStatusRepo);
    await usecase.do('1', '1', '完了');
    expect(taskStatus.status).toBe(Done);
  });

  test('[異常系] 完了->未着手', async () => {
    const taskStatus = createTaskStatus(Done);
    const mockTaskStatusRepo = new MockTaskStatusRepository(some(taskStatus));

    const usecase = new UpdateTaskStatusUseCase(mockTaskStatusRepo);
    const result = await usecase.do('1', '1', '未着手');
    expect(isSome(result)).toBeTruthy();
  });

  test('[異常系] 完了->レビュー待ち', async () => {
    const taskStatus = createTaskStatus(Done);
    const mockTaskStatusRepo = new MockTaskStatusRepository(some(taskStatus));

    const usecase = new UpdateTaskStatusUseCase(mockTaskStatusRepo);
    const result = await usecase.do('1', '1', 'レビュー待ち');
    expect(isSome(result)).toBeTruthy();
  });
});
