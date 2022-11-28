import { IsArray } from 'class-validator';
import { IChatRoomCreate } from 'src/data/chat-room';

export class ChatRoomCreateDto implements IChatRoomCreate {
  @IsArray()
  attendees: string[];
}
