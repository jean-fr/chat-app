import { IChatRoom } from ".";
import _APIRepo from "./_APIRepo";

export default class ChatRoomRepo extends _APIRepo {
  public addChatRoom = async (attendees: string[]): Promise<IChatRoom> => {
    return this.http.post(this.url, { attendees });
  };

  public listRooms = async (): Promise<IChatRoom[]> => {
    return this.http.get(this.url);
  };

  public getRoom = async (id: string): Promise<IChatRoom> => {
    return this.http.get(`${this.url}/${id}`);
  };

  public listRoomsByUser = async (userId: string): Promise<IChatRoom[]> => {
    return this.http.get(`${this.url}/user/${userId}`);
  };
}
