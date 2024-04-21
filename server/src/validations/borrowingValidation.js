import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

const createNew = async (req, res, next) => {
   const correctCondition = Joi.object({
      userId: Joi.string().required().trim().strict(),
      bookId: Joi.string().required().min(7).max(255).default('').allow(''),
   });

   try {
      await correctCondition.validateAsync(req.body, {
         abortEarly: false,
      });

      next();
   } catch (error) {
      const errorMessage = new Error(error).message;
      const customError = new ApiError(
         StatusCodes.UNPROCESSABLE_ENTITY,
         errorMessage
      );
      next(customError);
   }
};

export const borrowingValidation = {
   createNew,
};
