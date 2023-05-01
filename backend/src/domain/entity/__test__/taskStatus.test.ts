import { createRandomIdString } from 'src/util/random';
import { TaskIdType, TaskStatus } from '../taskStatus';
import { ParticipantIdType } from '../participant';
import { Done, Waiting, Yet } from 'src/domain/value-object/taskStatusValue';

describe('set status', () => {
  test('[正常系] 未着手 -> レビュー待ち', () => {
    const taskStatus = TaskStatus.create(createRandomIdString(), {
      participantId: createRandomIdString() as ParticipantIdType,
      taskId: createRandomIdString() as TaskIdType,
      status: Yet,
    });
    taskStatus.status = Waiting;
    expect(taskStatus.status).toEqual(Waiting);
  });

  test('[正常系] 未着手 -> 完了', () => {
    const taskStatus = TaskStatus.create(createRandomIdString(), {
      participantId: createRandomIdString() as ParticipantIdType,
      taskId: createRandomIdString() as TaskIdType,
      status: Yet,
    });
    taskStatus.status = Done;
    expect(taskStatus.status).toEqual(Done);
  });

  test('[正常系] レビュー待ち -> 未着手', () => {
    const taskStatus = TaskStatus.create(createRandomIdString(), {
      participantId: createRandomIdString() as ParticipantIdType,
      taskId: createRandomIdString() as TaskIdType,
      status: Waiting,
    });
    taskStatus.status = Yet;
    expect(taskStatus.status).toEqual(Yet);
  });

  test('[正常系] レビュー待ち -> 完了', () => {
    const taskStatus = TaskStatus.create(createRandomIdString(), {
      participantId: createRandomIdString() as ParticipantIdType,
      taskId: createRandomIdString() as TaskIdType,
      status: Waiting,
    });
    taskStatus.status = Done;
    expect(taskStatus.status).toEqual(Done);
  });

  test('[異常系] 完了 -> 未着手', () => {
    const taskStatus = TaskStatus.create(createRandomIdString(), {
      participantId: createRandomIdString() as ParticipantIdType,
      taskId: createRandomIdString() as TaskIdType,
      status: Done,
    });
    expect(() => {
      taskStatus.status = Yet;
    }).toThrow();
  });

  test('[異常系] 完了 -> レビュー待ち', () => {
    const taskStatus = TaskStatus.create(createRandomIdString(), {
      participantId: createRandomIdString() as ParticipantIdType,
      taskId: createRandomIdString() as TaskIdType,
      status: Done,
    });
    expect(() => {
      taskStatus.status = Waiting;
    }).toThrow();
  });
});
