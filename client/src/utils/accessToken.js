export const getAccessToken = async () => {
   const token = await window.localStorage.getItem('accessToken');
   return token;
};

export const setAccessToken = async (token) => {
   await window.localStorage.setItem('accessToken', token);
};
