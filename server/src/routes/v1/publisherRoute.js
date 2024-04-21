import express from 'express';
import { PublisherController } from '~/controllers/publisherController';
import { verify } from '~/middlewares/verify';

const Router = express.Router();

Router.route('/:id')
   .get(PublisherController.getPublisher)
   .put(
      verify.verifyAccessToken,
      verify.isAdmin,
      PublisherController.updatePublisher
   )
   .delete(
      verify.verifyAccessToken,
      verify.isAdmin,
      PublisherController.deletePublisher
   );

Router.route('/')
   .get(PublisherController.getPublishers)
   .post(
      verify.verifyAccessToken,
      verify.isAdmin,
      PublisherController.createNew
   );

export const publisherRoute = Router;
