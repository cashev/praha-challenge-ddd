import { ApiProperty } from '@nestjs/swagger';
import { PairDto } from 'src/app/query-service-interface/pair-qs';

export class GetPairResponse {
  @ApiProperty({ type: () => [PairData] })
  pairData: PairData[];

  public constructor(params: { pairDtos: PairDto[] }) {
    const { pairDtos: pairDtos } = params;
    this.pairData = pairDtos.map((dto) => new PairData(dto));
  }
}

class PairData {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  participants: ParticipantData[];

  public constructor(params: {
    id: string;
    name: string;
    participants: {
      participantId: string;
      participantName: string;
      status: string;
    }[];
  }) {
    this.id = params.id;
    this.name = params.name;
    this.participants = params.participants.map((p) => new ParticipantData(p));
  }
}

class ParticipantData {
  @ApiProperty()
  participantId: string;
  @ApiProperty()
  participantName: string;
  @ApiProperty()
  status: string;

  constructor(params: {
    participantId: string;
    participantName: string;
    status: string;
  }) {
    this.participantId = params.participantId;
    this.participantName = params.participantName;
    this.status = params.status;
  }
}
