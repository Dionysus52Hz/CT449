export const sortAscending = (array, condition) => {
   return array.sort((a, b) => {
      if (condition === 'birthday') {
         return new Date(a[condition]) - new Date(b[condition]);
      } else if (typeof a[condition] === 'number') {
         return a[condition] - b[condition];
      } else
         return (a[condition] || '')
            .toString()
            .localeCompare((b[condition] || '').toString(), 'vi', {
               sensitivity: 'base',
            });
   });
};

export const sortDescending = (array, condition) => {
   return array.sort((a, b) => {
      if (condition === 'birthday') {
         console.log(new Date(a[condition]));
         return new Date(b[condition]) - new Date(a[condition]);
      } else if (typeof a[condition] === 'number') {
         return b[condition] - a[condition];
      } else
         return (b[condition] || '')
            .toString()
            .localeCompare((a[condition] || '').toString(), 'vi', {
               sensitivity: 'base',
            });
   });
};
