import { env } from './environment';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
   cloud_name: env.CLOUDINARY_NAME,
   api_key: env.CLOUDINARY_KEY,
   api_secret: env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
   cloudinary,
   allowedFormats: ['jpg', 'png', 'jpeg'],
   params: {
      folder: 'quanlymuonsach',
   },
});

const uploadCloud = multer({ storage });

export default uploadCloud;
