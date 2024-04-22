import { StatusCodes } from 'http-status-codes';
import { TokenService } from '~/services/tokenService';
import ApiError from '~/utils/ApiError';

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
      const newAccessToken = await TokenService.createNewAccessToken(
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

export const TokenController = {
   createNewAccessToken,
};
