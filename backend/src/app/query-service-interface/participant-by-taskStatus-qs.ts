import { ParticipantDto } from './participant-qs';

export interface IParticipantByTaskStatusQS {
  getWithPagination(
    taskIds: string[],
    status: string,
    skip: number,
    take: number,
  ): Promise<ParticipantDto[]>;
}
