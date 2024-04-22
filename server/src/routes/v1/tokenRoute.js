import express from 'express';
import { TokenController } from '~/controllers/tokenController';

const Router = express.Router();

Router.route('/create-new-access-token').post(
   TokenController.createNewAccessToken
);

export const tokenRoute = Router;
