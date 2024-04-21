import mongoose, { Schema } from 'mongoose';
import { CURRENT_YEAR } from '~/utils/constants';

const bookSchema = new Schema(
   {
      title: {
         type: String,
         required: [true, 'Title is not allow to be empty'],
         unique: true,
      },
      thumbnail: {
         type: String,
      },
      description: {
         type: String,
      },
      price: {
         type: Number,
         required: true,
         validate: {
            validator: function (value) {
               return value > 0;
            },
            message: 'Price need to be large than 0',
         },
      },
      stock: {
         type: Number,
         required: true,
      },
      stockLeft: {
         type: Number,
         default: function () {
            return this.stock;
         },
      },
      publishedYear: {
         type: Number,
         required: true,
         validate: {
            validator: function (value) {
               return value <= CURRENT_YEAR;
            },
            message: 'Published year is invalid',
         },
      },
      publisherId: {
         type: String,
      },
      author: {
         type: String,
      },
      slug: {
         type: String,
         required: true,
      },
      likes: {
         type: Array,
         default: [],
      },
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);

bookSchema.virtual('publisher', {
   ref: 'publishers',
   localField: 'publisherId',
   foreignField: 'publisherId',
   justOne: true,
});

const BookModel = mongoose.model('books', bookSchema);

export default BookModel;
