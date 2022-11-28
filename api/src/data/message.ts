import { addEntity, getEntityById, listEntitiesByField } from './db-client';

export interface IMessage {
  id: string;
  text: string;
  emoji: string;
  time: Date;
  replyId: string;
  authorId: string;
  roomId: string;
  isReadBy: string[];
  isDeleted?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMessageCreate
  extends Omit<IMessage, 'id' | 'time' | 'isDeleted'> {}

const messagesCollectionName = 'messages';

export const addMessage = async ({
  text,
  authorId,
  emoji,
  replyId,
  isReadBy,
  roomId,
}: IMessageCreate): Promise<IMessage> => {
  return addEntity(messagesCollectionName, {
    text,
    authorId,
    emoji,
    replyId,
    isReadBy,
    time: new Date(),
    roomId,
  });
};
export const getMessageById = async (id: string): Promise<IMessage | null> => {
  return getEntityById(messagesCollectionName, id);
};
export const listMessageByRoomId = async (
  roomId: string,
): Promise<IMessage[]> => {
  return listEntitiesByField(messagesCollectionName, 'roomId', roomId);
};

export const listMessageByUserId = async (
  authorId: string,
): Promise<IMessage[]> => {
  return listEntitiesByField(messagesCollectionName, 'authorId', authorId);
};
