import { getUserById, IUser } from '../data/user';
import { IMessage } from '../data/message';
import { IChatRoom } from '../data/chat-room';

export interface ApiMessage {
  id: string;
  text: string;
  emoji: string;
  time: string;
  replyId: string;
  author: IUser;
  room: IChatRoom;
  isReadBy: string[];
  isDeleted?: boolean;
}

export const toAPIMessage = async (
  message: IMessage,
  room: IChatRoom,
): Promise<ApiMessage> => {
  const author = await getUserById(message.authorId);
  return {
    id: message.id,
    text: message.text,
    time: message.time.toUTCString(),
    replyId: message.replyId,
    author,
    room,
    isReadBy: message.isReadBy,
    isDeleted: message.isDeleted,
    emoji: message.emoji,
  };
};
