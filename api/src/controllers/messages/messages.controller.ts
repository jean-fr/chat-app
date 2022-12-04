import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';

import { MessageCreateDto } from './dto/message-create.dto';
import { ISocketService } from '../../chats/services/socket/socket.service';
import { ApiMessage, toAPIMessage } from '../../serializers/messages';
import { getRoom } from '../../data/firestore/chat-room';
import {
  addMessage,
  listMessageByRoomId,
  IMessage,
} from 'src/data/firestore/message';
import { getUserById } from '../../data/firestore/user';

@Controller('messages')
export class MessageController {
  constructor(private socketService: ISocketService) {}
  @Post()
  async addMessage(@Body() body: MessageCreateDto): Promise<ApiMessage> {
    const { text, authorId, replyId, roomId } = body;
    const room = await getRoom(roomId);
    if (!room) {
      throw new NotFoundException();
    }
    const author = await getUserById(authorId);
    if (!author) {
      throw new NotFoundException();
    }

    const m = await addMessage({
      text,
      authorId,
      replyId: replyId || null,
      roomId,
    });

    let messages = await listMessageByRoomId(roomId);

    const msgs: ApiMessage[] = [];

    messages = messages.sort((a: IMessage, b: IMessage) => {
      return a.time.toMillis() - b.time.toMillis();
    });

    for (const m of messages) {
      const am = await toAPIMessage(m, room);
      msgs.push(am);
    }

    await this.socketService.emit('userSendMessage', roomId, msgs);
    return await toAPIMessage(m, room);
  }

  @Get('room/:roomId')
  async listMessageByRoomId(
    @Param('roomId') roomId: string,
  ): Promise<ApiMessage[]> {
    const room = await getRoom(roomId);
    if (!room) {
      throw new NotFoundException();
    }
    let messages = await listMessageByRoomId(roomId);

    const result: ApiMessage[] = [];

    messages = messages.sort((a: IMessage, b: IMessage) => {
      return a.time.toMillis() - b.time.toMillis();
    });

    for (const m of messages) {
      const am = await toAPIMessage(m, room);
      result.push(am);
    }

    return result;
  }
}
