import { io } from "socket.io-client";
import { ApiMessage } from "../repositories";

const apiBaseUrl = "http://localhost:4001";

export interface IMessage {
  id: string;
  text: string;
  emoji: string;
  time: Date;
  replyId: string;
  authorId: string;
  roomId: string;
}

export interface IOnUserTyping {
  roomId: string;
  name: string;
  email: string;
  clear?: boolean;
}

export interface IWebsocketClient {
  onServerMessage: (callback: (message: ApiMessage[]) => void) => void;
  onUserTypingMessage: (callback: (message: IOnUserTyping) => void) => void;
  subscribe: (roomId: string) => void;
  onTyping: (message: IOnUserTyping) => void;
}

const socket = io(`${apiBaseUrl}/chats`, {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("socket client is connected");
});
socket.on("disconnect", () => {
  console.log("socket client is disconnected");
});

socket.on("error", (e) => {
  console.log("socket client error:", e);
});

export const websocketClient = (): IWebsocketClient => {
  const onServerMessage = (callback: (message: ApiMessage[]) => void) => {
    socket.on("userSendMessage", (data: ApiMessage[]) => {
      callback(data);
    });
  };
  const onUserTypingMessage = (callback: (message: IOnUserTyping) => void) => {
    socket.on("userOnTyping", (data: IOnUserTyping) => {
      callback(data);
    });
  };

  const subscribe = (roomId: string) => {
    if (socket.disconnected) {
      socket.connect();
    }
    socket.emit("subscribeToChatRoom", { roomId });
  };

  const onTyping = (message: IOnUserTyping) => {
    if (socket.disconnected) {
      socket.connect();
    }
    socket.emit("userOnTyping", message);
  };

  return { onServerMessage, subscribe, onTyping, onUserTypingMessage };
};
