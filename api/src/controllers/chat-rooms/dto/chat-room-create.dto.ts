import { IsArray } from 'class-validator';
import { IChatRoomCreate } from '../../../data/firestore/chat-room';

export class ChatRoomCreateDto implements IChatRoomCreate {
  @IsArray()
  attendees: string[];
}
