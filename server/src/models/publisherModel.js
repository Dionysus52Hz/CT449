import mongoose, { Schema } from 'mongoose';

const publisherSchema = new Schema(
   {
      publisherId: {
         type: String,
         required: true,
         unique: true,
      },
      publisherName: {
         type: String,
         required: true,
      },
      address: {
         type: String,
      },
   },
   { timestamps: true }
);

const PublisherModel = mongoose.model('publishers', publisherSchema);

export default PublisherModel;
