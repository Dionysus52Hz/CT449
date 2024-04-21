import { StatusCodes } from 'http-status-codes';
import { BookService } from '~/services/bookService';
import ApiError from '~/utils/ApiError';

const createNew = async (req, res, next) => {
   try {
      const createdBook = await BookService.createNew(req.body);

      res.status(StatusCodes.CREATED).json({
         success: true,
         createdBook,
      });
   } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const getBooks = async (req, res, next) => {
   try {
      const books = await BookService.getBooks();
      res.status(StatusCodes.OK).json({
         success: true,
         books,
      });
   } catch (error) {
      console.log(error);
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const getBook = async (req, res, next) => {
   try {
      const result = await BookService.getBook(req.params.id);
      res.status(StatusCodes.OK).json({
         success: true,
         result,
      });
   } catch (error) {
      console.log(error);
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const updateBook = async (req, res, next) => {
   try {
      const result = await BookService.updateBook(req.params.id, req.body);
      res.status(StatusCodes.OK).json({
         success: true,
         result,
      });
   } catch (error) {
      console.log(error);
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const deleteBook = async (req, res, next) => {
   try {
      const result = await BookService.deleteBook(req.params.id);
      if (result) {
         res.status(StatusCodes.OK).json({
            success: true,
            result,
         });
      } else
         res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'This book does not exist',
         });
   } catch (error) {
      console.log(error);
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const uploadBookThumbnail = async (req, res, next) => {
   try {
      console.log(req.file);
      if (!req.file) {
         res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Missing images',
         });
      } else {
         console.log(req.file);
         const result = await BookService.uploadBookThumbnail(
            req.params.id,
            req.file
         );
         res.status(StatusCodes.OK).json({
            success: true,
            result,
         });
      }
   } catch (error) {
      console.log(error);
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const likeBook = async (req, res, next) => {
   try {
      const userId = req.user._id;
      console.log(userId);
      const result = await BookService.likeBook(req.params.id, userId);
      if (result) {
         res.status(StatusCodes.OK).json({
            success: true,
            result,
         });
      } else
         res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Cannot like this book',
         });
   } catch (error) {
      console.log(error);
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const unlikeBook = async (req, res, next) => {
   try {
      const userId = req.user._id;
      const result = await BookService.unlikeBook(req.params.id, userId);
      if (result) {
         res.status(StatusCodes.OK).json({
            success: true,
            result,
         });
      } else
         res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Cannot unlike this book',
         });
   } catch (error) {
      console.log(error);
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const getBooksByFilter = async (req, res, next) => {
   try {
      const filter = req.query.filter;
      const result = await BookService.getBooksByFilter(filter);
      if (result) {
         res.status(StatusCodes.OK).json({
            success: true,
            result,
         });
      } else
         res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Books not found',
         });
   } catch (error) {
      console.log(error);
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const getBooksByCombinationFilters = async (req, res, next) => {
   try {
      const filters = req.query.filters;
      console.log(getBooksByCombinationFilters);
      // const result = await BookService.unlikeBook(req.params.id, userId);
      if (filters) {
         res.status(StatusCodes.OK).json({
            success: true,
            filters,
         });
      } else
         res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Books not found',
         });
   } catch (error) {
      console.log(error);
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

// const findOneById = async (req, res, next) => {
//    try {
//       const result = await bookService.findOneById(req.params.id);

//       res.status(StatusCodes.OK).json(result);
//    } catch (error) {
//       return next(
//          new ApiError(
//             StatusCodes.BAD_REQUEST,
//             'An error occurred while retrieving book by id.'
//          )
//       );
//    }
// };

// const updateOne = async (req, res, next) => {
//    try {
//       const result = await bookService.updateOne(req.params.id, req.body);
//       res.status(StatusCodes.OK).json(result);
//    } catch (error) {
//       return next(
//          new ApiError(
//             StatusCodes.BAD_REQUEST,
//             'An error occurred while updating book by id.'
//          )
//       );
//    }
// };

// const deleteOne = async (req, res, next) => {
//    try {
//       const result = await bookService.deleteOne(req.params.id);
//       res.status(StatusCodes.OK).json(result);
//    } catch (error) {
//       return next(
//          new ApiError(
//             StatusCodes.BAD_REQUEST,
//             'An error occurred while deleting book by id.'
//          )
//       );
//    }
// };

export const BookController = {
   createNew,
   getBooks,
   getBook,
   updateBook,
   deleteBook,
   uploadBookThumbnail,
   likeBook,
   unlikeBook,
   getBooksByFilter,
   getBooksByCombinationFilters,
};
