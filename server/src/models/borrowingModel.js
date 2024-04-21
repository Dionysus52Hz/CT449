import mongoose, { Schema } from 'mongoose';

const borrowingSchema = new Schema(
   {
      userId: {
         type: Schema.Types.ObjectId,
         ref: 'users',
         required: true,
      },
      bookId: {
         type: Schema.Types.ObjectId,
         ref: 'books',
         required: true,
      },
      state: {
         type: String,
         default: 'pending',
      },
      borrowedDate: {
         type: Date,
         default: Date.now,
      },
      returnedDate: {
         type: Date,
      },
   },
   { timestamps: true }
);

const BorrowingModel = mongoose.model('borrowings', borrowingSchema);

export default BorrowingModel;
