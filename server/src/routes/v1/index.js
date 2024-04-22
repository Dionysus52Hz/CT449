import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { bookRoute } from '~/routes/v1/bookRoute';
import { userRoute } from '~/routes/v1/userRoute';
import { borrowingRoute } from '~/routes/v1/borrowingRoute';
import { publisherRoute } from '~/routes/v1/publisherRoute';
import { employeeRoute } from './employeeRoute';
import { tokenRoute } from './tokenRoute';

const Router = express.Router();

Router.get('/status', (req, res) => {
   res.status(StatusCodes.OK).json({
      message: 'APIs V1 are ready to use.',
      code: StatusCodes.OK,
   });
});

Router.use('/books', bookRoute);
Router.use('/users', userRoute);
Router.use('/borrowings', borrowingRoute);
Router.use('/publishers', publisherRoute);
Router.use('/employees', employeeRoute);
Router.use('/tokens', tokenRoute);

export const APIs_V1 = Router;
