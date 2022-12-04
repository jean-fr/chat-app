import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  IChatRoom,
  addChatRoom,
  listRooms,
  getRoom,
  listRoomsByUserId,
} from '../../data/firestore/chat-room';

import { ChatRoomCreateDto } from './dto/chat-room-create.dto';

@Controller('chatRooms')
export class ChatRoomController {
  @Post()
  async addChatRoom(@Body() body: ChatRoomCreateDto): Promise<IChatRoom> {
    return addChatRoom(body.attendees);
  }
  @Get()
  async listRooms(): Promise<IChatRoom[]> {
    return await listRooms();
  }
  @Get(':id')
  async getRoom(@Param('id') id: string): Promise<IChatRoom> {
    const room = await getRoom(id);

    if (!room) {
      throw new NotFoundException();
    }
    return room;
  }

  @Get('user/:userId')
  async listRoomsByUser(@Param('userId') userId: string): Promise<IChatRoom[]> {
    const rooms = await listRoomsByUserId(userId);
    return rooms;
  }
}
