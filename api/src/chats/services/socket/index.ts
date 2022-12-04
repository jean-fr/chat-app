import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { ApiMessage } from '../../../serializers/messages';
import { ISocketService, ServerEventType } from './socket.service';

@Injectable()
export class SocketService implements ISocketService {
  public socket: Server = null;

  async emit(
    event: ServerEventType,
    roomId: string,
    message: ApiMessage[],
  ): Promise<boolean> {
    return this.socket.to(roomId).emit(event, message);
  }
}
