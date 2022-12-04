import { Collection } from 'mongodb';
import { MongoCluster } from '../db/mongo-db';

export const DB_NAME = 'chat-app';

export default class MongoClientBase {
  protected dbConnect: () => Promise<void>;
  protected dbClose: () => Promise<void>;
  dbCollection: Collection<Document>;

  constructor(collectionName: string) {
    MongoCluster().then((setup) => {
      const db = setup.client.db(DB_NAME);
      this.dbCollection = db.collection(collectionName);
      this.dbConnect = setup.connect;
      this.dbClose = setup.close;
    });

    // const db = mongo.client.db(DB_NAME);

    //  mongo.connect();
    // const collection = db.collection(messagesCollectionName);
  }
}
