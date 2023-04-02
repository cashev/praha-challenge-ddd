import { ApiProperty } from '@nestjs/swagger';
import { ParticipantDto } from 'src/app/query-service-interface/participant-qs';

export class GetParticipantResponse {
  @ApiProperty({ type: () => [ParticipantData] })
  participantData: ParticipantData[];

  public constructor(params: { participantDtos: ParticipantDto[] }) {
    const { participantDtos } = params;
    this.participantData = participantDtos.map(
      ({ id, name, email, status }) => {
        return new ParticipantData({
          id,
          name,
          email,
          status,
        });
      },
    );
  }
}

class ParticipantData {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  status: string;

  public constructor(params: {
    id: number;
    name: string;
    email: string;
    status: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.status = params.status;
  }
}
