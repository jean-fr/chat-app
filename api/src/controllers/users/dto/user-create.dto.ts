import { IUserCreate } from '../../../data/user';
import { IsString } from 'class-validator';

export class UserCreateDto implements IUserCreate {
  @IsString()
  email: string;

  @IsString()
  name: string;
}
