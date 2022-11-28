import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { getRoom } from '../../data/chat-room';
import {
  addUser,
  getUserByEmail,
  getUserById,
  IUser,
  listAllUsers,
  listUserByRoomId,
} from '../../data/user';
import { UserCreateDto } from './dto/user-create.dto';

@Controller('users')
export class UserController {
  @Post()
  async addUser(@Body() body: UserCreateDto): Promise<IUser> {
    const { name, email } = body;

    let u = await getUserByEmail(email);
    if (u) {
      throw new BadRequestException('user alredy exist');
    }

    u = await addUser({ email, name });
    return u;
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<IUser> {
    const u = await getUserByEmail(email);
    if (!u) {
      throw new NotFoundException();
    }

    return u;
  }
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<IUser> {
    const u = await getUserById(id);
    if (!u) {
      throw new NotFoundException();
    }
    return u;
  }
  @Get('roomId/:roomId')
  async listUserByRoomId(@Param('roomId') roomId: string): Promise<IUser[]> {
    const room = getRoom(roomId);

    if (!room) {
      throw new NotFoundException();
    }
    const users = await listUserByRoomId(roomId);
    return users;
  }
  @Get()
  async listAllUsers(): Promise<IUser[]> {
    const users = await listAllUsers();
    return users;
  }
}
