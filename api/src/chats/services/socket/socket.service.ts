import { Server } from 'socket.io';
import { ApiMessage } from '../../../serializers/messages';

export abstract class ISocketService {
  abstract socket: Server;
  abstract emit(
    event: 'userSendMessage',
    roomId: string,
    message: ApiMessage,
  ): Promise<void>;
}
