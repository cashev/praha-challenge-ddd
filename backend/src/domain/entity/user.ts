import { Entity } from './entity';

interface UserProps {
  name: string;
  mailAddress: string;
}

export class User extends Entity<UserProps> {}
