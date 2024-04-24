import express from 'express';
import { UserController } from '~/controllers/userController';
import { verify } from '~/middlewares/verify';
import uploadCloud from '~/config/cloudinary.config';

const Router = express.Router();

Router.route('/login').post(UserController.login);

Router.route('/current')
   .get(verify.verifyAccessToken, UserController.getCurrent)
   .put(verify.verifyAccessToken, UserController.updateCurrent);

Router.route('/get-users-by-filter').get(UserController.getUsersByFilter);

Router.route('/upload-user-avatar/:id').put(
   verify.verifyAccessToken,
   uploadCloud.single('avatar'),
   UserController.uploadUserAvatar
);

Router.route('/logout').post(verify.verifyAccessToken, UserController.logout);

Router.route('/:id')
   .get(verify.verifyAccessToken, verify.isAdmin, UserController.getUser)
   .put(verify.verifyAccessToken, verify.isAdmin, UserController.updateUser)
   .delete(verify.verifyAccessToken, verify.isAdmin, UserController.deleteUser);

Router.route('/')
   .get(verify.verifyAccessToken, verify.isAdmin, UserController.getUsers)
   .post(UserController.createNew);
export const userRoute = Router;
