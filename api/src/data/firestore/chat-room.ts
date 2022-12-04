import {
  addEntity,
  getEntityById,
  listEntities,
  listEntitiesInField,
} from '../db/db-client';

export interface IChatRoom {
  id: string;
  attendees: string[];
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IChatRoomCreate extends Pick<IChatRoom, 'attendees'> {}

const chatRoomsCollectionName = 'chatRooms';

export const addChatRoom = async (attendees: string[]): Promise<IChatRoom> => {
  return addEntity(chatRoomsCollectionName, { attendees });
};

export const listRooms = async (): Promise<IChatRoom[]> => {
  return listEntities(chatRoomsCollectionName);
};
export const listRoomsByUserId = async (
  userId: string,
): Promise<IChatRoom[]> => {
  return listEntitiesInField(chatRoomsCollectionName, 'attendees', userId);
};
export const getRoom = async (id: string): Promise<IChatRoom | null> => {
  return getEntityById(chatRoomsCollectionName, id);
};
