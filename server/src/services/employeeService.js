import bcrypt from 'bcrypt';
import { env } from '~/config/environment';
import { jwtMiddleware } from '~/middlewares/jwt';
import jwt from 'jsonwebtoken';
import EmployeeModel from '~/models/employeeModel';

const createNew = async (reqBody) => {
   try {
      const employee = await EmployeeModel.findOne({
         employee: reqBody.employeeId,
      });

      if (employee) {
         throw new Error('Employee is existed!');
      }

      const hashPassword = await bcrypt.hash(reqBody.password, 10);
      reqBody.password = hashPassword;
      const createdEmployee = await EmployeeModel.create(reqBody);
      return createdEmployee;
   } catch (error) {
      throw new Error(error);
   }
};

const getEmployees = async () => {
   try {
      const employees = await EmployeeModel.find();
      return employees;
   } catch (error) {
      throw new Error(error);
   }
};

const getEmployee = async (id) => {
   try {
      const employee = await EmployeeModel.findById(id);
      return employee;
   } catch (error) {
      throw new Error(error);
   }
};

const updateEmployee = async (id, data) => {
   try {
      const hashPassword = await bcrypt.hash(data.password, 10);
      data.password = hashPassword;
      const result = await EmployeeModel.findByIdAndUpdate(id, data, {
         returnDocument: 'after',
         runValidators: true,
      });
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const deleteEmployee = async (id) => {
   try {
      const result = await EmployeeModel.findByIdAndDelete(id);
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const login = async (employeeId, pass) => {
   try {
      const employee = await EmployeeModel.findOne({
         employeeId,
      });

      if (!employee) {
         throw new Error('This employee does not exist');
      }
      const checkPassword = await bcrypt.compare(pass, employee.password);
      if (checkPassword) {
         const accessToken = jwtMiddleware.generateAccessToken(
            employee._id,
            employee.role
         );
         const refreshToken = jwtMiddleware.generateRefreshToken(employee._id);
         const result = await EmployeeModel.findByIdAndUpdate(
            employee._id,
            { refreshToken },
            { returnDocument: 'after' }
         );
         const { password, ...employeeData } = result.toObject();

         return {
            employeeData,
            accessToken,
         };
      } else {
         throw new Error('Invalid credentials!');
      }
   } catch (error) {
      throw new Error(error);
   }
};

// const createNewAccessToken = async (refreshToken) => {
//    try {
//       const verified = jwt.verify(refreshToken, env.JWT_SECRET_KEY);

//       console.log(verified);

//       const result = await EmployeeModel.findOne({
//          _id: verified._id,
//          refreshToken: refreshToken,
//       });

//       const newAccessToken = result
//          ? jwtMiddleware.generateAccessToken(result._id, result.role)
//          : 'Invalid refresh token';

//       return newAccessToken;
//    } catch (error) {
//       throw new Error(error);
//    }
// };

const logout = async (refreshToken) => {
   try {
      await EmployeeModel.findOneAndUpdate(
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

export const EmployeeService = {
   createNew,
   getEmployees,
   getEmployee,
   updateEmployee,
   deleteEmployee,
   login,
   logout,
};
