import { config } from 'dotenv';
import { MongoClient } from 'mongodb';
config();

export const MongoCluster = async (): Promise<{
  client: MongoClient;
  connect: () => Promise<void>;
  close: () => Promise<void>;
}> => {
  const client = new MongoClient(
    process.env.DB_URI || 'mongodb://localhost:27017/chat-app',
  );
  const connect = async () => {
    console.log('Connecting to MongoDB cluster...');
    await client.connect();
    console.log('Successfully connected to MongoDB!');
  };

  const close = async () => {
    await client.close();
    console.log('Successfully closed');
  };

  return {
    client,
    connect,
    close,
  };
};
