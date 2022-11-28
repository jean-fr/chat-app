import { listMessageByRoomId } from '../data/message';

export const getRoomsWithUnreadMessagesByUser = async (
  roomIds: string[],
  userId: string,
): Promise<string[]> => {
  const result: string[] = [];

  for (const id in roomIds) {
    const messages = await listMessageByRoomId(id);
    messages.some((m) => {
      if (!m.isReadBy.includes(userId)) {
        result.push(id);
      }
    });
  }
  return result;
};
