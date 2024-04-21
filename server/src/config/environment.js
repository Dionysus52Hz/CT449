import 'dotenv/config';

export const env = {
   MONGODB_URI: process.env.MONGODB_URI,
   DATABASE_NAME: process.env.DATABASE_NAME,
   APP_HOST: process.env.APP_HOST,
   APP_PORT: process.env.APP_PORT,
   JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
   CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
   CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
   CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
};
