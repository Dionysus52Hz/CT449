import axiosInstance from './ApiService';

class TokenService {
   constructor(baseURL = '/v1/tokens') {
      this.API = axiosInstance(baseURL);
   }

   async getNewAccessToken() {
      return (await this.API.post('/create-new-access-token')).data;
   }
}

export default new TokenService();
