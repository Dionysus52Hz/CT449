import { StatusCodes } from 'http-status-codes';
import { BorrowingService } from '~/services/borrowingService';
import ApiError from '~/utils/ApiError';

const createNew = async (req, res, next) => {
   try {
      const createdBorrowing = await BorrowingService.createNew(req.body);
      res.status(StatusCodes.CREATED).json(createdBorrowing);
   } catch (error) {
      console.log(error);
      next(error);
   }
};

const getBorrowings = async (req, res, next) => {
   try {
      const borrowings = await BorrowingService.getBorrowings();
      res.status(StatusCodes.OK).json({
         success: true,
         borrowings,
      });
   } catch (error) {
      console.log(error);
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const getBorrowing = async (req, res, next) => {
   try {
      const result = await BorrowingService.getBorrowing(req.params.id);

      res.status(StatusCodes.OK).json({
         success: true,
         result,
      });
   } catch (error) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const checkBorrowing = async (req, res, next) => {
   try {
      const result = await BorrowingService.checkBorrowing(req.body);

      res.status(StatusCodes.OK).json({
         success: true,
         result,
      });
   } catch (error) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const updateBorrowing = async (req, res, next) => {
   try {
      const result = await BorrowingService.updateBorrowing(
         req.params.id,
         req.body
      );
      if (result) {
         res.status(StatusCodes.OK).json({
            success: true,
            result,
         });
      } else
         res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'This borrowing does not exist',
         });
   } catch (error) {
      console.log(error);
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const deleteBorrowing = async (req, res, next) => {
   try {
      const result = await BorrowingService.deleteBorrowing(req.params.id);
      if (result) {
         res.status(StatusCodes.OK).json({
            success: true,
            result,
         });
      } else
         res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'This borrowing does not exist',
         });
   } catch (error) {
      console.log(error);
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

export const BorrowingController = {
   createNew,
   getBorrowings,
   getBorrowing,
   checkBorrowing,
   updateBorrowing,
   deleteBorrowing,
};
