import { IsOptional, IsString } from 'class-validator';
import { IMessageCreate } from '../../../data/message';

export class MessageCreateDto implements IMessageCreate {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  replyId: string;

  @IsString()
  authorId: string;

  @IsString()
  roomId: string;
}
