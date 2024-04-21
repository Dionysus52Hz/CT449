import { env } from './environment';
import mongoose from 'mongoose';

export const CONNECT_DB = async () => {
   try {
      await mongoose.connect(env.MONGODB_URI, {
         dbName: env.DATABASE_NAME,
      });
   } catch (error) {
      console.log(error);
      process.exit(1);
   }
};
