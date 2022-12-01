import { addEntity, getEntityById, listEntitiesByField } from './db-client';
import * as firebase from 'firebase-admin';
export interface IMessage {
  id: string;
  text: string;
  time: firebase.firestore.Timestamp;
  replyId: string;
  authorId: string;
  roomId: string;
  isDeleted?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMessageCreate
  extends Omit<IMessage, 'id' | 'time' | 'isDeleted'> {}

const messagesCollectionName = 'messages';

export const addMessage = async ({
  text,
  authorId,
  replyId,
  roomId,
}: IMessageCreate): Promise<IMessage> => {
  return addEntity(messagesCollectionName, {
    text,
    authorId,
    replyId,
    time: firebase.firestore.Timestamp.now(),
    roomId,
    isDeleted: false,
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
