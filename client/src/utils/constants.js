export const CURRENT_YEAR = new Date().getFullYear();

export const SEARCH_FILTERS_FOR_USER = [
   {
      filter: 'keyword',
      text: 'Từ khoá bất kỳ',
   },
   {
      filter: 'title',
      text: 'Tựa đề',
   },
   {
      filter: 'author',
      text: 'Tác giả',
   },
   {
      filter: 'publishedYear',
      text: 'Năm xuất bản',
   },
];

export const BOOK_TOPICS = [];

export const PUBLISHERS = [
   {
      name: 'Dân Trí',
      id: 'DT',
   },
   {
      name: 'Hà Nội',
      id: 'HN',
   },
   {
      name: 'Hội Nhà Văn',
      id: 'HNV',
   },
   {
      name: 'Hồng Đức',
      id: 'HD',
   },
   {
      name: 'Lao Động',
      id: 'LD',
   },
   {
      name: 'Phụ Nữ',
      id: 'PN',
   },
   {
      name: 'Thế Giới',
      id: 'TG',
   },
   {
      name: 'Tổng hợp TPHCM',
      id: 'THTPHCM',
   },
   {
      name: 'Tri Thức',
      id: 'TT',
   },
   {
      name: 'Văn học',
      id: 'VH',
   },
];

export const BOOK_TABLE_HEADERS = {
   _id: 'Mã sách',
   thumbnail: 'Ảnh bìa',
   title: 'Tựa đề',
   description: 'Mô tả',
   price: 'Đơn giá',
   stock: 'Số quyển',
   stockLeft: 'Số quyển còn lại',
   publishedYear: 'Năm xuất bản',
   publisher: 'Nhà xuất bản',
   author: 'Tác giả',
   createdAt: 'Tạo lúc',
   updatedAt: 'Cập nhật lúc',
};

export const BOOK_SORT_BY = [
   {
      text: 'Tựa đề',
      value: 'title',
   },
   {
      text: 'Mã sách',
      value: '_id',
   },
   {
      text: 'Đơn giá',
      value: 'price',
   },
   {
      text: 'Số quyển',
      value: 'stock',
   },
   {
      text: 'Số quyển còn lại',
      value: 'stockLeft',
   },
   {
      text: 'Năm xuất bản',
      value: 'publishedYear',
   },
   {
      text: 'Nhà xuất bản',
      value: 'publisher',
   },
   {
      text: 'Tác giả',
      value: 'author',
   },
   {
      text: 'Thời gian tạo',
      value: 'createdAt',
   },
   {
      text: 'Thời gian chỉnh sửa',
      value: 'updatedAt',
   },
];

export const SORT_TYPE = [
   {
      text: 'Tăng dần (A-Z)',
      value: 1,
   },
   {
      text: 'Giảm dần (Z-A)',
      value: -1,
   },
];

export const USER_TABLE_HEADERS = {
   avatar: 'Ảnh đại diện',
   userId: 'Tên đăng nhập',
   email: 'Email',
   lastName: 'Họ và tên đệm',
   firstName: 'Tên',
   birthday: 'Ngày sinh',
   gender: 'Giới tính',
   phone: 'Số điện thoại',
   createdAt: 'Tạo lúc',
   updatedAt: 'Cập nhật lúc',
};

export const USER_GENDER = [
   { text: 'Nam', value: 'male' },
   { text: 'Nữ', value: 'female' },
];

export const USER_SORT_BY = [
   {
      text: 'Tên đăng nhập',
      value: 'userId',
   },
   {
      text: 'Email',
      value: 'email',
   },
   {
      text: 'Họ và tên đệm',
      value: 'lastName',
   },
   {
      text: 'Tên',
      value: 'firstName',
   },
   {
      text: 'Ngày sinh',
      value: 'birthday',
   },
   {
      text: 'Số điện thoại',
      value: 'phone',
   },
   {
      text: 'Thời gian tạo',
      value: 'createdAt',
   },
   {
      text: 'Thời gian chỉnh sửa',
      value: 'updatedAt',
   },
];
