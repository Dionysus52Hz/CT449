import { StatusCodes } from 'http-status-codes';
import { UserService } from '~/services/userService';
import ApiError from '~/utils/ApiError';

const createNew = async (req, res, next) => {
   try {
      const createdUser = await UserService.createNew(req.body);

      res.status(StatusCodes.CREATED).json({
         success: true,
         createdUser,
      });
   } catch (error) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const getUsers = async (req, res, next) => {
   try {
      const users = await UserService.getUsers();
      res.status(StatusCodes.OK).json({
         success: true,
         users,
      });
   } catch (error) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const getUser = async (req, res, next) => {
   try {
      const user = await UserService.getUser(req.params.id);
      res.status(StatusCodes.OK).json({
         success: true,
         user,
      });
   } catch (error) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const updateUser = async (req, res, next) => {
   try {
      const result = await UserService.updateUser(req.params.id, req.body);
      res.status(StatusCodes.OK).json({
         success: true,
         result,
      });
   } catch (error) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const deleteUser = async (req, res, next) => {
   try {
      const result = await UserService.deleteUser(req.params.id);
      if (result) {
         res.status(StatusCodes.OK).json({
            success: true,
            result,
         });
      } else
         res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'This user does not exist!',
         });
   } catch (error) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const login = async (req, res, next) => {
   try {
      const { userId, password } = req.body;
      if (!userId || !password) {
         return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Missing user ID or password',
         });
      }

      const result = await UserService.login(userId, password);
      res.cookie('refreshToken', result.userData.refreshToken, {
         httpOnly: true,
         maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(StatusCodes.OK).json({
         success: true,
         message: 'Login successfully!',
         result,
      });
   } catch (error) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const getCurrent = async (req, res, next) => {
   try {
      const { _id } = req.user;
      const user = await UserService.getUser(_id);
      if (user) {
         const { password, role, refreshToken, ...userData } = user.toObject();
         return res.status(StatusCodes.OK).json({
            success: true,
            userData,
         });
      } else {
         res.status(StatusCodes.OK).json({
            success: false,
            message: 'User not found',
         });
      }
   } catch (error) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const createNewAccessToken = async (req, res, next) => {
   try {
      const cookie = req.cookies;
      const refreshToken = cookie.refreshToken;
      if (!cookie || !refreshToken) {
         res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'No refresh token in cookies',
         });
      }
      const newAccessToken = await UserService.createNewAccessToken(
         refreshToken
      );

      res.status(StatusCodes.OK).json({
         success: true,
         accessToken: newAccessToken,
      });
   } catch (error) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const logout = async (req, res, next) => {
   try {
      const cookie = req.cookies;
      if (!cookie || !cookie.refreshToken) {
         throw new Error('No refresh token in cookie');
      }

      await UserService.logout(cookie.refreshToken);
      res.clearCookie('refreshToken', {
         httpOnly: true,
         secure: true,
      });

      res.status(StatusCodes.OK).json({
         message: 'Logout successfully!',
      });
   } catch (error) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

export const UserController = {
   createNew,
   getUsers,
   getUser,
   updateUser,
   deleteUser,
   login,
   logout,
   getCurrent,
   createNewAccessToken,
};
