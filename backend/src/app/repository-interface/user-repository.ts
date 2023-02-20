import { User } from 'src/domain/entity/user';

export interface IUserRepository {
  find(id: number): Promise<User>;
  save(user: User): Promise<void>;
}
