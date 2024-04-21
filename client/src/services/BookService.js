import createApiClient from './ApiService';
import { setAccessToken, getAccessToken } from '~/utils/accessToken';
import UserService from './UserService';

class BookService {
   constructor(baseURL = '/v1/books') {
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
               const newAccessToken = (await UserService.getNewAccessToken())
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

   async getBooks() {
      return (await this.API.get('/')).data;
   }

   async create(data) {
      return (await this.API.post('/', data)).data;
   }

   async getBook(id) {
      return (await this.API.get(`/${id}`)).data;
   }

   async updateBook(id, data) {
      return (await this.API.put(`/${id}`, data)).data;
   }

   async uploadBookThumbnail(id, file) {
      console.log(id, file);
      return await this.API.put(`/upload-book-thumbnail/${id}`, file, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      });
   }

   async deleteBook(id) {
      return (await this.API.delete(`/${id}`)).data;
   }

   async getBooksByFilter(filter) {
      return (
         await this.API.get('/get-books-by-filter', {
            params: {
               filter,
            },
         })
      ).data;
   }

   async getBooksByCombinationFilters(filters) {
      return (
         await this.API.get('/get-books-by-combination-filters', {
            params: {
               filters,
            },
         })
      ).data;
   }

   async likeBook(id) {
      return (await this.API.put(`/like-book/${id}`)).data;
   }

   async unlikeBook(id) {
      return (await this.API.put(`/unlike-book/${id}`)).data;
   }
}

export default new BookService();
