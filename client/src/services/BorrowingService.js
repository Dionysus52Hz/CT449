import createApiClient from './ApiService';
import EmployeeService from './EmployeeService';
import TokenService from './TokenService';
import { getAccessToken, setAccessToken } from '~/utils/accessToken';

class BorrowingService {
   constructor(baseURL = '/v1/borrowings') {
      this.API = createApiClient(baseURL);
      this.API.interceptors.request.use(
         async (config) => {
            if (
               config.url.indexOf('/login') >= 0 ||
               config.url.indexOf('/create-new-access-token') >= 0
            ) {
               return config;
            }
            const token = await getAccessToken();
            config.headers.Authorization = `Bearer ${token}`;
            return config;
         },
         (error) => {
            console.log(error);
            return Promise.reject(error);
         }
      );

      this.API.interceptors.response.use(
         async (response) => {
            const config = response.config;
            if (
               config.url.indexOf('/login') >= 0 ||
               config.url.indexOf('/create-new-access-token') >= 0
            ) {
               return response;
            }
            return response;
         },
         async (error) => {
            const originalRequest = error.config;
            const errorResponse = error.response;
            if (
               errorResponse.data.message === 'Invalid access token!' &&
               errorResponse.status === 401
            ) {
               const newAccessToken = (await TokenService.getNewAccessToken())
                  .accessToken;
               await setAccessToken(newAccessToken);

               return new Promise((resolve, reject) => {
                  originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                  resolve(this.API(originalRequest));
                  reject(error);
               });
            }
            return Promise.reject(error);
         }
      );
   }

   async getBorrowings() {
      return (await this.API.get('/')).data;
   }

   async create(data) {
      return (await this.API.post('/', data)).data;
   }

   async getBorrowing(id) {
      return (await this.API.get(`/${id}`)).data;
   }

   async checkBorrowing(data) {
      return (await this.API.post('/find', data)).data;
   }

   async updateBorrowing(id, data) {
      return (await this.API.put(`/${id}`, data)).data;
   }

   async deleteBorrowing(id) {
      return (await this.API.delete(`/${id}`)).data;
   }
}

export default new BorrowingService();
