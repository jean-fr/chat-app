import MysqlEntityClientBase from './entity-client-base';

const roomsCollectionName = 'rooms';

export class ChatRoomDao
  extends MysqlEntityClientBase
  implements data.IChatRooms
{
  constructor() {
    super(roomsCollectionName);
  }
  async get(id: string): Promise<data.IChatRoom> {
    // const mongo = await this.mongo;a
    try {
      //   const db = mongo.client.db(DB_NAME);
      //   mongo.connect();
      //   const collection = db.collection(this.collectionName);
      await this.dbConnect();
      const cursor = await this.dbCollection.find({ _id: new ObjectId(id) });

      const items = await cursor.toArray();

      return items.length > 0 ? (items[0] as T) : null;
    } catch (error) {
    } finally {
      await this.dbClose();
    }
  }
  async create(room: data.IChatRoomCreate): Promise<data.IChatRoom> {
    try {
      await this.dbConnect();
      // const collection = db.collection(this.collectionName);

      const e = await this.dbCollection.insertOne(room);

      return this.get(e.insertedId.toString());
    } catch (error) {
      console.error(error);
    } finally {
      await this.dbClose();
    }
  }
  async listByUserId(userId: string): Promise<data.IChatRoom[]> {
    // const mongo = await this.mongo;

    try {
      // const db = mongo.client.db(DB_NAME);
      // mongo.connect();
      //const collection = db.collection(roomsCollectionName);
      await this.dbConnect();
      const cursor = await this.dbCollection.find({ userId });
      const items = await cursor.toArray();

      return items as unknown as data.IChatRoom[];
    } catch (error) {
    } finally {
      // mongo.client.close();
      await this.dbClose();
    }
  }
  async listAll(): Promise<data.IChatRoom[]> {
    //  const mongo = await this.mongo;
    try {
      // const db = mongo.client.db(DB_NAME);
      // mongo.connect();
      // const collection = db.collection(roomsCollectionName);
      await this.dbConnect();
      const cursor = await this.dbCollection.find({});
      const items = await cursor.toArray();

      return items as unknown as data.IChatRoom[];
    } catch (error) {
    } finally {
      // mongo.client.close();
      await this.dbClose();
    }
  }
}
