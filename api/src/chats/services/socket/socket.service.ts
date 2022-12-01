import { Server } from 'socket.io';
import { ApiMessage } from '../../../serializers/messages';

export type ServerEventType = 'userSendMessage';

export abstract class ISocketService {
  abstract socket: Server;
  abstract emit(
    event: ServerEventType,
    roomId: string,
    message: ApiMessage,
  ): Promise<boolean>;
}
