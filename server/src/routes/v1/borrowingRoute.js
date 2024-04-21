import express from 'express';
import { BorrowingController } from '~/controllers/borrowingController';
import { verify } from '~/middlewares/verify';

const Router = express.Router();

Router.route('/find').post(
   verify.verifyAccessToken,
   BorrowingController.checkBorrowing
);

Router.route('/:id')
   .get(verify.verifyAccessToken, BorrowingController.getBorrowing)
   .put(verify.verifyAccessToken, BorrowingController.updateBorrowing)
   .delete(verify.verifyAccessToken, BorrowingController.deleteBorrowing);

Router.route('/')
   .get(
      verify.verifyAccessToken,
      verify.isAdmin,
      BorrowingController.getBorrowings
   )
   .post(verify.verifyAccessToken, BorrowingController.createNew);

export const borrowingRoute = Router;
