export abstract class IDataClients {
  abstract users: data.IUsers;
  abstract messages: data.IMessages;
  abstract rooms: data.IChatRooms;
}
