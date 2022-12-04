import * as Axios from "axios";
import { HTTPClient } from "../clients/Http";
import ChatRoomRepo from "./ChatRoomRepo";
import MessageRepo from "./MessageRepo";

import UserRepo from "./UserRepo";

export interface ApiMessage {
  id: string;
  text: string;
  time: string;
  replyId: string;
  author: IUser;
  room: IChatRoom;
  isDeleted?: boolean;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
}
export interface IChatRoom {
  id: string;
  attendees: string[];
}

export interface IMessageCreate extends Pick<Partial<ApiMessage>, "text" | "replyId"> {
  authorId: string;
  roomId: string;
}

export default class Api {
  public users!: UserRepo;
  public messages!: MessageRepo;
  public chatRooms!: ChatRoomRepo;
  constructor(authToken?: string) {
    this.initialiseRepos();
  }

  private initialiseRepos = (authToken?: string) => {
    const http = new HTTPClient({
      baseURL: "http://localhost:4001",
      authToken,
      onError(apiError: Axios.AxiosError) {
        // do stuff on error
        if (typeof window !== "undefined") {
          console.error("failed to send request to api", apiError);
        }
        throw apiError;
      },

      responseDataMapper(res: Axios.AxiosResponse<any>) {
        return res.data;
      },
    });

    this.users = new UserRepo(http, "users");
    this.messages = new MessageRepo(http, "messages");
    this.chatRooms = new ChatRoomRepo(http, "chatRooms");
  };
}
