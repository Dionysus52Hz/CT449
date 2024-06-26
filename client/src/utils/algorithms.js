export const convertTimestamp = (timestamp) => {
   const date = new Date(timestamp);
   return date.toLocaleString('vi-VN');
};

export const convertCurrency = (value) => {
   const config = {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 9,
   };
   return new Intl.NumberFormat('vi-VN', config).format(value);
};
