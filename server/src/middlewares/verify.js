import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { env } from '~/config/environment';

const verifyAccessToken = async (req, res, next) => {
   if (req?.headers?.authorization?.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];

      jwt.verify(token, env.JWT_SECRET_KEY, (error, decode) => {
         if (error && error.name === 'TokenExpiredError') {
            return res.status(StatusCodes.UNAUTHORIZED).json({
               success: false,
               message: 'Invalid access token!',
            });
         }
         req.user = decode;
         next();
      });
   } else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
         success: false,
         message: 'Require authentication!',
      });
   }
};

const isAdmin = async (req, res, next) => {
   if (req.user.role !== 'admin' && req.user.role !== 'employee') {
      return res.status(StatusCodes.FORBIDDEN).json({
         success: false,
         message: 'Permission denied',
      });
   }
   next();
};

const isManager = async (req, res, next) => {
   if (req?.user?.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({
         success: false,
         message: 'Permission denied',
      });
   }
   next();
};

export const verify = {
   verifyAccessToken,
   isAdmin,
   isManager,
};
