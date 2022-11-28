import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { ApiMessage } from '../../../serializers/messages';
import { ISocketService } from './socket.service';

@Injectable()
export class SocketService implements ISocketService {
  public socket: Server = null;

  async emit(
    event: 'userSendMessage',
    roomId: string,
    message: ApiMessage,
  ): Promise<void> {
    this.socket.to(roomId).emit(event, message);
  }
}
