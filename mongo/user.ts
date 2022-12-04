import MysqlEntityClientBase from './entity-client-base';

const usersCollectionName = 'users';

export class UserDao extends MysqlEntityClientBase implements data.IUsers {
  constructor() {
    super(usersCollectionName);
  }
  async create(user: data.IUserCreate): Promise<data.IUser> {
    try {
      await this.dbConnect();
      // const collection = db.collection(this.collectionName);

      const e = await this.dbCollection.insertOne(user);

      return this.get(e.insertedId.toString());
    } catch (error) {
      console.error(error);
    } finally {
      await this.dbClose();
    }
  }
  async get(id: string): Promise<data.IUser> {
    // const mongo = await this.mongo;a
    try {
      //   const db = mongo.client.db(DB_NAME);
      //   mongo.connect();
      //   const collection = db.collection(this.collectionName);
      await this.dbConnect();
      const cursor = await this.dbCollection.find({ _id: new ObjectId(id) });

      const items = await cursor.toArray();

      return items.length > 0 ? (items[0] as IUser) : null;
    } catch (error) {
    } finally {
      await this.dbClose();
    }
  }

  async userExists(email: string): Promise<boolean> {
    const u = await this.getByEmail(email);
    return !!u;
  }
  async getByEmail(email: string): Promise<data.IUser> {
    // const mongo = await this.mongo;
    try {
      // const db = mongo.client.db(DB_NAME);
      // mongo.connect();
      // const collection = db.collection(usersCollectionName);
      await this.dbConnect();
      const cursor = await this.dbCollection.find({ email });
      const items = await cursor.toArray();

      return items.length > 0 ? (items[0] as unknown as data.IUser) : null;
    } catch (error) {
    } finally {
      await this.dbClose();
    }
  }

  async listAll(): Promise<data.IUser[]> {
    // const mongo = await this.mongo;
    try {
      // const db = mongo.client.db(DB_NAME);
      // mongo.connect();
      // const collection = db.collection(usersCollectionName);
      await this.dbConnect();
      const cursor = await this.dbCollection.find({});
      const items = await cursor.toArray();

      return items as unknown as data.IUser[];
    } catch (error) {
    } finally {
      await this.dbClose();
    }
  }
}
