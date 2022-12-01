import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ISocketService } from './services/socket/socket.service';
import { Body } from '@nestjs/common';
import { UserSubscribeToChatDto } from './dto/user-subscribe-to-chat.dto';
import { getRoom } from '../data/chat-room';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'chats',
  transports: ['websocket'],
})
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private socketService: ISocketService) {}

  @WebSocketServer() server: Server;

  handleConnection(@ConnectedSocket() socket: Socket, ...args: any[]) {
    console.log('socket client connected', {
      clientId: socket.id,
    });
  }
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('socket client disconnected', {
      clientId: socket.id,
    });
  }
  afterInit(server: Server) {
    this.socketService.socket = server;
    console.log('socket client initialized');
  }

  @SubscribeMessage('subscribeToChatRoom')
  async subscribeToChatRoom(
    @Body() body: UserSubscribeToChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId } = body;
    const room = await getRoom(roomId);
    if (!room) {
      console.log('no room found with roomId', {
        roomId,
      });
      throw new WsException('Resource not found');
    }
    console.log('subscribed To ChatRoom', room);
    await socket.join(roomId);
  }
}
