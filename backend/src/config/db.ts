import mongoose from 'mongoose';
import { env } from './env';

mongoose.set('strictQuery', true);

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.mongoUri);
    // eslint-disable-next-line no-console
    console.log(`[db] Mongo connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[db] Connection error:', (error as Error).message);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
};
