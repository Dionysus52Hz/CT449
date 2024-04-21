import slugify from 'slugify';
import BookModel from '~/models/bookModel';
import UserModel from '~/models/userModel';

const createNew = async (reqBody) => {
   try {
      const newBook = {
         ...reqBody,
         slug: slugify(reqBody.title, {
            locale: 'vi',
            lower: true,
         }),
      };
      const createdBook = await BookModel.create(newBook);
      return createdBook;
   } catch (error) {
      throw new Error(error);
   }
};

const getBooks = async () => {
   try {
      const books = await BookModel.find().populate({
         path: 'publisher',
         select: 'publisherId publisherName',
      });
      return books;
   } catch (error) {
      throw new Error(error);
   }
};

const getBook = async (id) => {
   try {
      const result = (await BookModel.findById(id)).populate({
         path: 'publisher',
         select: 'publisherId publisherName',
      });
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const updateBook = async (id, data) => {
   try {
      const result = await BookModel.findByIdAndUpdate(id, data, {
         returnDocument: 'after',
         runValidators: true,
      });
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const deleteBook = async (id) => {
   try {
      const result = await BookModel.findByIdAndDelete(id);
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const uploadBookThumbnail = async (id, image) => {
   try {
      const result = await BookModel.findByIdAndUpdate(
         id,
         {
            thumbnail: image.path,
         },
         {
            returnDocument: 'after',
         }
      );
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const likeBook = async (id, userId) => {
   try {
      const book = await BookModel.findById(id);
      const isAlreadyLiked = book?.likes?.find((id) => id === userId);
      if (isAlreadyLiked) {
         throw new Error('This book is already liked');
      }
      const result = await BookModel.findByIdAndUpdate(
         id,
         { $push: { likes: userId } },
         { returnDocument: 'after' }
      );
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const unlikeBook = async (id, userId) => {
   try {
      const book = await BookModel.findById(id);
      const isAlreadyLiked = book?.likes?.find((id) => id === userId);
      if (!isAlreadyLiked) {
         throw new Error('This book is already unliked');
      }
      const result = await BookModel.findByIdAndUpdate(
         id,
         { $pull: { likes: userId } },
         { returnDocument: 'after' }
      );
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const getBooksByFilter = async (filter) => {
   try {
      const searchText = filter.searchText;
      const searchKey = filter.filterSelected.filter;
      let query;
      if (searchKey === 'keyword') {
         query = {
            $or: [
               { title: { $regex: new RegExp(searchText, 'i') } },
               { author: { $regex: new RegExp(searchText, 'i') } },
               {
                  publishedYear: isNaN(parseInt(searchText))
                     ? -1
                     : parseInt(searchText),
               },
            ],
         };
      } else {
         query = {
            [searchKey]: {
               $regex: new RegExp(searchText, 'i'),
            },
         };
      }
      const result = await BookModel.find(query).populate({
         path: 'publisher',
         select: 'publisherId publisherName',
      });
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

export const BookService = {
   createNew,
   getBooks,
   getBook,
   updateBook,
   deleteBook,
   uploadBookThumbnail,
   likeBook,
   unlikeBook,
   getBooksByFilter,
};
