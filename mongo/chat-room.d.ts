declare namespace data {
  export interface IChatRoom {
    id: string;
    attendees: string[];
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface IChatRoomCreate extends Pick<IChatRoom, 'attendees'> {}

  interface IChatRooms {
    get(id: string): Promise<IChatRoom | null>;
    create(entity: IChatRoomCreate): Promise<IChatRoom>;
    listByUserId(userId: string): Promise<IChatRoom[]>;
    listAll(): Promise<IChatRoom[]>;
  }
}
