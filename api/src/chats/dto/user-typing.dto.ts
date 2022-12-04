import { IsString } from 'class-validator';

export class UserOnTypingDto {
  @IsString()
  roomId: string;

  @IsString()
  name: string;

  @IsString()
  email: string;
}
