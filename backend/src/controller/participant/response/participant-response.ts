import { ApiProperty } from '@nestjs/swagger';
import { ParticipantDto } from 'src/query/usecase/query-service-interface/participant-qs';

export class GetParticipantResponse {
  @ApiProperty({ type: () => [ParticipantData] })
  participantData: ParticipantData[];

  public constructor(params: { participantDtos: ParticipantDto[] }) {
    const { participantDtos } = params;
    this.participantData = participantDtos.map((dto) => {
      return new ParticipantData({ ...dto });
    });
  }
}

class ParticipantData {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;

  public constructor(params: { id: string; name: string; email: string }) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
  }
}
