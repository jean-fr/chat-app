import {
  addEntity,
  entityExists,
  getEntityByField,
  getEntityById,
  listEntities,
  listEntitiesByField,
  removeEntity,
} from './db-client';

const usersCollectionName = 'users';

export interface IUser {
  id: string;
  name: string;
  email: string;
  isOnline: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserCreate extends Pick<IUser, 'email' | 'name'> {}

export const removeUser = async (userId: string) => {
  return removeEntity(usersCollectionName, userId);
};

export const addUser = async ({
  email,
  name,
}: IUserCreate): Promise<IUser | null> => {
  return addEntity(usersCollectionName, { email, name });
};

export const userExists = async (email: string) => {
  return entityExists(usersCollectionName, 'email', email);
};

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return getEntityByField(usersCollectionName, 'email', email);
};

export const getUserById = async (userId: string): Promise<IUser | null> => {
  return getEntityById(usersCollectionName, userId);
};

export const listUserByRoomId = async (roomId: string): Promise<IUser[]> => {
  return listEntitiesByField(usersCollectionName, 'roomId', roomId);
};

export const listAllUsers = async (): Promise<IUser[]> => {
  return listEntities(usersCollectionName);
};
