import axiosInstance from './ApiService';
import { getAccessToken, setAccessToken } from '~/utils/accessToken';

class EmployeeService {
   constructor(baseURL = '/v1/employees') {
      this.API = axiosInstance(baseURL);
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
               const newAccessToken = (await this.getNewAccessToken())
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

   async getEmployees() {
      return (await this.API.get('/')).data;
   }

   async create(data) {
      return (await this.API.post('/', data)).data;
   }

   async getEmployee(id) {
      return (await this.API.get(`/${id}`)).data;
   }

   async updateEmployee(id, data) {
      return (await this.API.put(`/${id}`, data)).data;
   }

   async deleteEmployee(id) {
      return (await this.API.delete(`/${id}`)).data;
   }

   async login(data) {
      return (await this.API.post('/login', data)).data;
   }

   async getNewAccessToken() {
      return (await this.API.post('/create-new-access-token')).data;
   }

   async logout() {
      return (await this.API.post('/logout')).data;
   }

   async getCurrent() {
      return (await this.API.get('/current')).data;
   }
}

export default new EmployeeService();
