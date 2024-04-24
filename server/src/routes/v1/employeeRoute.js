import express from 'express';
import { EmployeeController } from '~/controllers/employeeController';
import { verify } from '~/middlewares/verify';
import uploadCloud from '~/config/cloudinary.config';

const Router = express.Router();

Router.route('/login').post(EmployeeController.login);

Router.route('/current').get(
   verify.verifyAccessToken,
   EmployeeController.getCurrent
);

Router.route('/get-employees-by-filter').get(
   EmployeeController.getEmployeesByFilter
);

Router.route('/upload-employee-avatar/:id').put(
   verify.verifyAccessToken,
   uploadCloud.single('avatar'),
   EmployeeController.uploadEmployeeAvatar
);

Router.route('/logout').post(
   verify.verifyAccessToken,
   EmployeeController.logout
);

Router.route('/:id')
   .get(
      verify.verifyAccessToken,
      verify.isManager,
      EmployeeController.getEmployee
   )
   .put(
      verify.verifyAccessToken,
      verify.isManager,
      EmployeeController.updateEmployee
   )
   .delete(
      verify.verifyAccessToken,
      verify.isManager,
      EmployeeController.deleteEmployee
   );

Router.route('/')
   .get(
      verify.verifyAccessToken,
      verify.isManager,
      EmployeeController.getEmployees
   )
   .post(
      verify.verifyAccessToken,
      verify.isManager,
      EmployeeController.createNew
   );
export const employeeRoute = Router;
