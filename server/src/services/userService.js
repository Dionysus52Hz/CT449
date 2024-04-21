import bcrypt from 'bcrypt';
import { env } from '~/config/environment';
import { jwtMiddleware } from '~/middlewares/jwt';
import jwt from 'jsonwebtoken';
import UserModel from '~/models/userModel';

const createNew = async (reqBody) => {
   try {
      const user = await UserModel.findOne({
         $or: [{ userId: reqBody.userId }, { email: reqBody.email }],
      });

      if (user) {
         throw new Error('User is existed!');
      }

      const hashPassword = await bcrypt.hash(reqBody.password, 10);
      reqBody.password = hashPassword;
      const createdUser = await UserModel.create(reqBody);
      return createdUser;
   } catch (error) {
      throw new Error(error);
   }
};

const getUsers = async () => {
   try {
      const users = await UserModel.find().populate('borrowedBook');
      return users;
   } catch (error) {
      throw new Error(error);
   }
};

const getUser = async (id) => {
   try {
      const user = await UserModel.findById(id).populate('borrowedBook');
      return user;
   } catch (error) {
      throw new Error(error);
   }
};

const updateUser = async (id, data) => {
   try {
      const hashPassword = await bcrypt.hash(data.password, 10);
      data.password = hashPassword;
      const result = await UserModel.findByIdAndUpdate(id, data, {
         returnDocument: 'after',
         runValidators: true,
      });
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const deleteUser = async (id) => {
   try {
      const result = await UserModel.findByIdAndDelete(id);
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const login = async (userId, pass) => {
   try {
      const user = await UserModel.findOne({
         userId,
      });
      if (!user) {
         throw new Error('This user does not exist');
      }
      const checkPassword = await bcrypt.compare(pass, user.password);
      if (checkPassword) {
         const accessToken = jwtMiddleware.generateAccessToken(
            user._id,
            user.role
         );
         const refreshToken = jwtMiddleware.generateRefreshToken(user._id);
         const result = await UserModel.findByIdAndUpdate(
            user._id,
            { refreshToken },
            { returnDocument: 'after' }
         );
         const { password, ...userData } = result.toObject();

         return {
            userData,
            accessToken,
         };
      } else {
         throw new Error('Invalid credentials!');
      }
   } catch (error) {
      throw new Error(error);
   }
};

const createNewAccessToken = async (refreshToken) => {
   try {
      const verified = jwt.verify(refreshToken, env.JWT_SECRET_KEY);

      const result = await UserModel.findOne({
         _id: verified._id,
         refreshToken: refreshToken,
      });

      const newAccessToken = result
         ? jwtMiddleware.generateAccessToken(result._id, result.role)
         : 'Invalid refresh token';

      return newAccessToken;
   } catch (error) {
      throw new Error(error);
   }
};

const logout = async (refreshToken) => {
   try {
      await UserModel.findOneAndUpdate(
         {
            refreshToken,
         },
         { refreshToken: '' },
         { returnDocument: 'after' }
      );
   } catch (error) {
      throw new Error(error);
   }
};

export const UserService = {
   createNew,
   getUsers,
   getUser,
   updateUser,
   deleteUser,
   login,
   logout,
   createNewAccessToken,
};
