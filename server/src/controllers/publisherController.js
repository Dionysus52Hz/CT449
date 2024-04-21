import { StatusCodes } from 'http-status-codes';
import { PublisherService } from '~/services/publisherService';
import ApiError from '~/utils/ApiError';

const createNew = async (req, res, next) => {
   try {
      const createdPublisher = await PublisherService.createNew(req.body);
      res.status(StatusCodes.CREATED).json(createdPublisher);
   } catch (error) {
      next(error);
   }
};

const getPublishers = async (req, res, next) => {
   try {
      const publishers = await PublisherService.getPublishers();
      res.status(StatusCodes.OK).json({
         success: true,
         publishers,
      });
   } catch (error) {
      console.log(error);
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const getPublisher = async (req, res, next) => {
   try {
      const result = await PublisherService.getPublisher(req.params.id);

      res.status(StatusCodes.OK).json({
         success: true,
         result,
      });
   } catch (error) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const updatePublisher = async (req, res, next) => {
   try {
      const result = await PublisherService.updatePublisher(
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
            message: 'This publisher does not exist',
         });
   } catch (error) {
      console.log(error);
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const deletePublisher = async (req, res, next) => {
   try {
      const result = await PublisherService.deletePublisher(req.params.id);
      if (result) {
         res.status(StatusCodes.OK).json({
            success: true,
            result,
         });
      } else
         res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'This publisher does not exist',
         });
   } catch (error) {
      console.log(error);
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

export const PublisherController = {
   createNew,
   getPublishers,
   getPublisher,
   updatePublisher,
   deletePublisher,
};
