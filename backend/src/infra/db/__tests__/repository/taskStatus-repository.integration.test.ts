import { prisma } from 'src/testUtil/prisma';
import { TaskStatusRepository } from '../../repository/taskStatus-repository';
import {
  createTestParticipants,
  createTestTask,
  createTestTaskStatus,
} from 'src/testUtil/test-data';
import { TaskIdType, TaskStatus } from 'src/domain/entity/taskStatus';
import { ParticipantIdType } from 'src/domain/entity/participant';
import {
  Done,
  Yet,
  getTaskStatusValue,
} from 'src/domain/value-object/taskStatusValue';
import { isNone } from 'fp-ts/lib/Option';

describe('taskStatus-repository.integration.test', () => {
  const taskStatusRepository = new TaskStatusRepository(prisma);

  const createTestData = async () => {
    await prisma.participant.createMany({ data: createTestParticipants() });
    await prisma.task.createMany({ data: createTestTask() });
    await prisma.taskStatus.createMany({ data: createTestTaskStatus() });
  };

  const deleteTestData = async () => {
    await prisma.taskStatus.deleteMany();
    await prisma.participant.deleteMany();
    await prisma.task.deleteMany();
  };

  beforeAll(async () => {
    await deleteTestData();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('find', () => {
    beforeAll(async () => {
      await createTestData();
    });
    afterAll(async () => {
      await deleteTestData();
    });

    test('[正常系]', async () => {
      const result = await taskStatusRepository.find('001', 'T001');
      if (isNone(result)) {
        throw new Error();
      }
      const taskStatus = result.value;
      expect(taskStatus.status).toEqual(Done);
    });
  });

  describe('save', () => {
    beforeAll(async () => {
      await createTestData();
    });
    afterAll(async () => {
      await deleteTestData();
    });

    test('[正常系] 更新', async () => {
      const taskStatus = TaskStatus.create('TS001T003', {
        participantId: '001' as ParticipantIdType,
        taskId: 'T003' as TaskIdType,
        status: Done,
      });
      await taskStatusRepository.save(taskStatus);

      const result = await taskStatusRepository.find('001', 'T003');
      if (isNone(result)) {
        throw new Error();
      }
      const tsResult = result.value;
      expect(tsResult.status).toEqual(Done);
    });
  });

  describe('saveAll', () => {
    beforeAll(async () => {
      await createTestData();
      await prisma.taskStatus.deleteMany({
        where: {
          participantId: '083',
        },
      });
    });
    afterAll(async () => {
      await deleteTestData();
    });

    test('[正常系]', async () => {
      const taskStatusList = [
        TaskStatus.create('TS083T001', {
          participantId: '083' as ParticipantIdType,
          taskId: 'T001' as TaskIdType,
          status: Yet,
        }),
        TaskStatus.create('TS083T002', {
          participantId: '083' as ParticipantIdType,
          taskId: 'T002' as TaskIdType,
          status: Yet,
        }),
        TaskStatus.create('TS083T003', {
          participantId: '083' as ParticipantIdType,
          taskId: 'T003' as TaskIdType,
          status: Yet,
        }),
        TaskStatus.create('TS083T004', {
          participantId: '083' as ParticipantIdType,
          taskId: 'T004' as TaskIdType,
          status: Yet,
        }),
      ];
      await taskStatusRepository.saveAll(taskStatusList);

      const results = await prisma.taskStatus.findMany({
        where: {
          participantId: '083',
        },
      });
      expect(results.length).toBe(4);
      expect(
        results.every((r) => r.status === getTaskStatusValue(Yet)),
      ).toBeTruthy();
    });
  });
});
