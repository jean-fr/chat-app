import { ApiMessage, IMessageCreate } from ".";
import _APIRepo from "./_APIRepo";

export default class MessageRepo extends _APIRepo {
  public createMessage = async (data: IMessageCreate): Promise<ApiMessage> => {
    return this.http.post(this.url, data);
  };

  public listMessageByRoomId = async (roomId: string): Promise<ApiMessage[]> => {
    return this.http.get(`${this.url}/room/${roomId}`);
  };

  public listMessageByUserId = async (authorId: string): Promise<ApiMessage[]> => {
    return this.http.get(`${this.url}/author/${authorId}`);
  };
}
