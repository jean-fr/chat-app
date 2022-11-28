import { Module } from '@nestjs/common';
import { ChatsModule } from './chats/chats.module';
import { ChatRoomController } from './controllers/chat-rooms/chat-rooms.controller';
import { MessageController } from './controllers/messages/messages.controller';
import { UserController } from './controllers/users/users.controller';

@Module({
  imports: [ChatsModule],
  controllers: [ChatRoomController, MessageController, UserController],
  providers: [],
})
export class AppModule {}
