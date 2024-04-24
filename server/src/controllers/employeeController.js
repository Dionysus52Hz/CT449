import { StatusCodes } from 'http-status-codes';
import { EmployeeService } from '~/services/employeeService';
import { UserService } from '~/services/userService';
import ApiError from '~/utils/ApiError';

const createNew = async (req, res, next) => {
   try {
      const createdEmployee = await EmployeeService.createNew(req.body);

      res.status(StatusCodes.CREATED).json({
         success: true,
         createdEmployee,
      });
   } catch (error) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const getEmployees = async (req, res, next) => {
   try {
      const employees = await EmployeeService.getEmployees();
      res.status(StatusCodes.OK).json({
         success: true,
         employees,
      });
   } catch (error) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const getEmployee = async (req, res, next) => {
   try {
      const employee = await EmployeeService.getEmployee(req.params.id);
      res.status(StatusCodes.OK).json({
         success: true,
         employee,
      });
   } catch (error) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const updateEmployee = async (req, res, next) => {
   try {
      const result = await EmployeeService.updateEmployee(
         req.params.id,
         req.body
      );
      res.status(StatusCodes.OK).json({
         success: true,
         result,
      });
   } catch (error) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const deleteEmployee = async (req, res, next) => {
   try {
      const result = await EmployeeService.deleteEmployee(req.params.id);
      if (result) {
         res.status(StatusCodes.OK).json({
            success: true,
            result,
         });
      } else
         res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'This employee does not exist!',
         });
   } catch (error) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const login = async (req, res, next) => {
   try {
      const { employeeId, password } = req.body;
      if (!employeeId || !password) {
         return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Missing employee ID or password',
         });
      }

      const result = await EmployeeService.login(employeeId, password);
      res.cookie('refreshToken', result.employeeData.refreshToken, {
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
      const employee = await EmployeeService.getEmployee(_id);
      if (employee) {
         const { password, role, refreshToken, ...employeeData } =
            employee.toObject();
         return res.status(StatusCodes.OK).json({
            success: true,
            employeeData,
         });
      } else {
         res.status(StatusCodes.OK).json({
            success: false,
            message: 'Employee not found',
         });
      }
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

      await EmployeeService.logout(cookie.refreshToken);
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

const uploadEmployeeAvatar = async (req, res, next) => {
   try {
      console.log(req.file);
      if (!req.file) {
         res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Missing images',
         });
      } else {
         console.log(req.file);
         const result = await EmployeeService.uploadEmployeeAvatar(
            req.params.id,
            req.file
         );
         res.status(StatusCodes.OK).json({
            success: true,
            result,
         });
      }
   } catch (error) {
      console.log(error);
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

const getEmployeesByFilter = async (req, res, next) => {
   try {
      const filter = req.query.filter;
      const result = await EmployeeService.getEmployeesByFilter(filter);
      if (result) {
         res.status(StatusCodes.OK).json({
            success: true,
            result,
         });
      } else
         res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Books not found',
         });
   } catch (error) {
      console.log(error);
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
   }
};

export const EmployeeController = {
   createNew,
   getEmployees,
   getEmployee,
   updateEmployee,
   deleteEmployee,
   login,
   logout,
   getCurrent,
   uploadEmployeeAvatar,
   getEmployeesByFilter,
};
