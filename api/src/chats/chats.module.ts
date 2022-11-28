import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';
import { ISocketService } from './services/socket/socket.service';
import { SocketService } from './services/socket';

@Module({
  imports: [],
  providers: [
    ChatsGateway,
    {
      provide: ISocketService,
      useClass: SocketService,
    },
  ],
  exports: [
    {
      provide: ISocketService,
      useClass: SocketService,
    },
  ],
})
export class ChatsModule {}
