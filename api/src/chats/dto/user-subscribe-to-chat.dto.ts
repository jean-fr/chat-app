import { IsString } from 'class-validator';

export class UserSubscribeToChatDto {
  @IsString()
  roomId: string;
}
