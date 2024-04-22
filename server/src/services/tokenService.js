import { env } from '~/config/environment';
import { jwtMiddleware } from '~/middlewares/jwt';
import jwt from 'jsonwebtoken';
import UserModel from '~/models/userModel';
import EmployeeModel from '~/models/employeeModel';

const createNewAccessToken = async (refreshToken) => {
   try {
      const verified = jwt.verify(refreshToken, env.JWT_SECRET_KEY);

      const user = await UserModel.findOne({
         _id: verified._id,
         refreshToken: refreshToken,
      });

      const employee = await EmployeeModel.findOne({
         _id: verified._id,
         refreshToken: refreshToken,
      });

      let newAccessToken;
      if (user) {
         newAccessToken = jwtMiddleware.generateAccessToken(
            user._id,
            user.role
         );
      } else if (employee) {
         newAccessToken = jwtMiddleware.generateAccessToken(
            employee._id,
            employee.role
         );
      } else newAccessToken = null;

      return newAccessToken;
   } catch (error) {
      throw new Error(error);
   }
};

export const TokenService = {
   createNewAccessToken,
};
