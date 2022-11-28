import { IsArray, IsString } from 'class-validator';
import { IMessageCreate } from '../../../data/message';

export class MessageCreateDto implements IMessageCreate {
  @IsArray()
  isReadBy: string[];

  @IsString()
  text: string;

  @IsString()
  emoji: string;

  @IsString()
  replyId: string;

  @IsString()
  authorId: string;

  @IsString()
  roomId: string;
}
