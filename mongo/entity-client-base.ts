import MongoClientBase from './db-base';

export default abstract class MysqlEntityClientBase extends MongoClientBase {
  constructor(collectionName: string) {
    super(collectionName);
  }
}
