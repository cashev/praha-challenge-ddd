export class PairDto {
    public readonly id: number;
    public readonly name: string;
  
    public constructor(props: { id: number; name: string }) {
      const { id, name } = props;
      this.id = id;
      this.name = name;
    }
  }
  
  export interface IPairQS {
    getAll(): Promise<PairDto[]>;
  }
  