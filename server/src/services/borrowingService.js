import BorrowingModel from '~/models/borrowingModel';
import UserModel from '~/models/userModel';
import BookModel from '~/models/bookModel';

const createNew = async (reqBody) => {
   try {
      const checkBook = await BookModel.findById(reqBody.bookId);
      if (!checkBook) {
         throw new Error('This book does not exist');
      }
      const checkBorrowing = await BorrowingModel.findOne({
         userId: reqBody.userId,
         bookId: reqBody.bookId,
      });
      if (checkBorrowing) {
         throw new Error(
            'This user is already requested for borrowing this book'
         );
      }
      const createdBorrowing = await BorrowingModel.create(reqBody);
      await UserModel.findByIdAndUpdate(
         reqBody.userId,
         { $push: { borrowedBook: createdBorrowing._id } },
         { returnDocument: 'after' }
      );
      await BookModel.findByIdAndUpdate(
         reqBody.bookId,
         { $inc: { stockLeft: -1 } },
         { returnDocument: 'after' }
      );
      return createdBorrowing;
   } catch (error) {
      throw new Error(error);
   }
};

const getBorrowings = async () => {
   try {
      const borrowings = await BorrowingModel.find()
         .populate('userId', excludeFields)
         .populate('bookId');
      return borrowings;
   } catch (error) {
      throw new Error(error);
   }
};

const excludeFields = '-password -role -refreshToken';

const getBorrowing = async (id) => {
   try {
      const result = (
         await BorrowingModel.findById(id).populate('userId', excludeFields)
      ).populate('bookId');
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const checkBorrowing = async (data) => {
   try {
      const result = await BorrowingModel.findOne({
         userId: data.userId,
         bookId: data.bookId,
      });
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const updateBorrowing = async (id, data) => {
   try {
      const result = await BorrowingModel.findByIdAndUpdate(id, data, {
         returnDocument: 'after',
         runValidators: true,
      });

      if (data.state === 'returned' || data.returnedDate) {
         await BookModel.findByIdAndUpdate(
            result.bookId,
            { $inc: { stockLeft: 1 } },
            { returnDocument: 'after' }
         );
      }
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const deleteBorrowing = async (id) => {
   try {
      const result = await BorrowingModel.findByIdAndDelete(id);
      await UserModel.findByIdAndUpdate(
         result.userId,
         {
            $pull: { borrowedBook: result._id },
         },
         {
            returnDocument: 'after',
         }
      );
      await BookModel.findByIdAndUpdate(
         result.bookId,
         { $inc: { stockLeft: 1 } },
         { returnDocument: 'after' }
      );
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

export const BorrowingService = {
   createNew,
   getBorrowings,
   getBorrowing,
   checkBorrowing,
   updateBorrowing,
   deleteBorrowing,
};
