declare namespace data {
  interface IMessage {
    id: string;
    text: string;
    time: Date;
    replyId: string;
    authorId: string;
    roomId: string;
    isDeleted?: boolean;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface IMessageCreate
    extends Omit<IMessage, 'id' | 'time' | 'isDeleted'> {}

  interface IMessages {
    get(id: string): Promise<IMessage | null>;
    create(entity: IMessageCreate): Promise<IMessage>;
    listByRoomId(roomId: string): Promise<IMessage[]>;
    listMessageByUserId(userId: string): Promise<IMessage[]>;
  }
}
