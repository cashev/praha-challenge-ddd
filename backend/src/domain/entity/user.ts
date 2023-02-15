import { UserEmail } from '../value-object/userEmail';
import { UserStatus } from '../value-object/userStatus';
import { Entity } from './entity';

interface UserProps {
  userName: string;
  email: UserEmail;
  status: UserStatus;
}

export class User extends Entity<UserProps> {
  private constructor(id: number, props: UserProps) {
    super(id, props);
  }

  public static create(id: number, props: UserProps): User {
    return new User(id, props);
  }
}
