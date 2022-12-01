import { getUserById, IUser } from '../data/user';
import { IMessage } from '../data/message';
import { IChatRoom } from '../data/chat-room';
import { dateToString } from '../utils/dates';

export interface ApiMessage {
  id: string;
  text: string;
  time: string;
  replyId: string;
  author: IUser;
  room: IChatRoom;
  isDeleted: boolean;
}

export const toAPIMessage = async (
  message: IMessage,
  room: IChatRoom,
): Promise<ApiMessage> => {
  const author = await getUserById(message.authorId);
  return {
    id: message.id,
    text: message.text,
    time: dateToString(message.time.toDate()),
    replyId: message.replyId,
    author,
    room,
    isDeleted: message.isDeleted,
  };
};
