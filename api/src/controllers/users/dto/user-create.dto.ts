import { IsString } from 'class-validator';
import { IUserCreate } from '../../../data/firestore/user';

export class UserCreateDto implements IUserCreate {
  @IsString()
  email: string;

  @IsString()
  name: string;
}
