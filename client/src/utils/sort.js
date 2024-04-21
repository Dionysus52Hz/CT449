export const sortAscending = (array, condition) => {
   return array.sort((a, b) => {
      if (typeof a[condition] === 'number') {
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
      if (typeof a[condition] === 'number') {
         return b[condition] - a[condition];
      } else
         return (b[condition] || '')
            .toString()
            .localeCompare((a[condition] || '').toString(), 'vi', {
               sensitivity: 'base',
            });
   });
};
