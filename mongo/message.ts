import MysqlEntityClientBase from './entity-client-base';

const messagesCollectionName = 'messages';
export class MessageDao
  extends MysqlEntityClientBase
  implements data.IMessages
{
  constructor() {
    super(messagesCollectionName);
  }

  async create(message: data.IMessageCreate): Promise<data.IMessage> {
    try {
      await this.dbConnect();
      // const collection = db.collection(this.collectionName);

      const e = await this.dbCollection.insertOne(message);

      return this.get(e.insertedId.toString());
    } catch (error) {
      console.error(error);
    } finally {
      await this.dbClose();
    }
  }

  async listByRoomId(roomId: string): Promise<data.IMessage[]> {
    // const mongo = await this.mongo;
    try {
      // const db = mongo.client.db(DB_NAME);
      // mongo.connect();
      // const collection = db.collection(messagesCollectionName);
      await this.dbConnect();
      const cursor = await this.dbCollection.find({ roomId });
      const items = await cursor.toArray();

      return items as unknown as data.IMessage[];
    } catch (error) {
    } finally {
      await this.dbClose();
    }
  }
  async listMessageByUserId(userId: string): Promise<data.IMessage[]> {
    // const mongo = await this.mongo;
    try {
      // const db = mongo.client.db(DB_NAME);
      // mongo.connect();
      // const collection = db.collection(messagesCollectionName);
      await this.dbConnect();
      const cursor = await this.dbCollection.find({ authorId: userId });
      const items = await cursor.toArray();

      return items as unknown as data.IMessage[];
    } catch (error) {
    } finally {
      await this.dbClose();
    }
  }
}
