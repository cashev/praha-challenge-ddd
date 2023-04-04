import { ParticipantDto } from './participant-qs';

export interface IParticipantByTaskStatusQS {
  getWithPagination(
    taskIds: number[],
    status: string,
    skip: number,
    take: number,
  ): Promise<ParticipantDto[]>;
}
