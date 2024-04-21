export const checkRequiredLogin = (error) => {
   const errorResponse = error.response.data;
   if (
      errorResponse.message === 'TokenExpiredError: jwt expired' &&
      errorResponse.statusCode === 400
   ) {
      return true;
   } else return false;
};
