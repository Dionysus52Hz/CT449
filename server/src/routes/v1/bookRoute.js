import express from 'express';
import { BookController } from '~/controllers/bookController';
import { verify } from '~/middlewares/verify';
import uploadCloud from '~/config/cloudinary.config';

const Router = express.Router();

Router.route('/get-books-by-filter').get(BookController.getBooksByFilter);

Router.route('/get-books-by-combination-filters').get(
   BookController.getBooksByCombinationFilters
);

Router.route('/upload-book-thumbnail/:id').put(
   verify.verifyAccessToken,
   verify.isAdmin,
   uploadCloud.single('thumbnail'),
   BookController.uploadBookThumbnail
);

Router.route('/like-book/:id').put(
   verify.verifyAccessToken,
   BookController.likeBook
);

Router.route('/unlike-book/:id').put(
   verify.verifyAccessToken,
   BookController.unlikeBook
);

Router.route('/:id')
   .get(BookController.getBook)
   .put(verify.verifyAccessToken, verify.isAdmin, BookController.updateBook)
   .delete(verify.verifyAccessToken, verify.isAdmin, BookController.deleteBook);

Router.route('/')
   .get(BookController.getBooks)
   .post(verify.verifyAccessToken, verify.isAdmin, BookController.createNew);

export const bookRoute = Router;
