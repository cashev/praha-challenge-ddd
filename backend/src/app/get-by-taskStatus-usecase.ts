import { IParticipantByTaskStatusQS } from './query-service-interface/participant-by-taskStatus-qs';

const PARTICIPANT_TAKE_PER_PAGE = 10;

export class GetByTaskStatusUsecase {
  private qs: IParticipantByTaskStatusQS;
  constructor(qs: IParticipantByTaskStatusQS) {
    this.qs = qs;
  }

  async do(taskIds: string[], status: string, page = 0) {
    const skip = PARTICIPANT_TAKE_PER_PAGE * page;
    return await this.qs.getWithPagination(
      taskIds,
      status,
      skip,
      PARTICIPANT_TAKE_PER_PAGE,
    );
  }
}
