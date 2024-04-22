import express from 'express';
import { EmployeeController } from '~/controllers/employeeController';
import { verify } from '~/middlewares/verify';

const Router = express.Router();

Router.route('/login').post(EmployeeController.login);

Router.route('/current').get(
   verify.verifyAccessToken,
   EmployeeController.getCurrent
);

// Router.route('/create-new-access-token').post(
//    EmployeeController.createNewAccessToken
// );

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
