import { ApiProperty } from '@nestjs/swagger';
import { PairDto } from 'src/app/query-service-interface/pair-qs';

export class GetPairResponse {
  @ApiProperty({ type: () => [PairData] })
  participantData: PairData[];

  public constructor(params: { pairDtos: PairDto[] }) {
    const { pairDtos: pairDtos } = params;
    this.participantData = pairDtos.map(({ id, name }) => {
      return new PairData({
        id,
        name,
      });
    });
  }
}

class PairData {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;

  public constructor(params: { id: string; name: string }) {
    this.id = params.id;
    this.name = params.name;
  }
}
