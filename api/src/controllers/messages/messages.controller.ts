import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { getRoom } from '../../data/chat-room';
import { getUserById } from '../../data/user';
import { addMessage, IMessage, listMessageByRoomId } from '../../data/message';
import { MessageCreateDto } from './dto/message-create.dto';
import { ISocketService } from '../../chats/services/socket/socket.service';
import { ApiMessage, toAPIMessage } from '../../serializers/messages';

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

    const apiMessage = await toAPIMessage(m, room);
    const result = await this.socketService.emit(
      'userSendMessage',
      roomId,
      apiMessage,
    );
    console.log('userSendMessage | ', result);
    return apiMessage;
  }

  @Get('roomId/:roomId')
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
