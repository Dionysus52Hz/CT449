import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
   {
      userId: {
         type: String,
         required: true,
         unique: true,
      },
      email: {
         type: String,
         validate: {
            validator: function (value) {
               // eslint-disable-next-line no-useless-escape
               return /^[\w-\.]+@([\w-]+\.)+(com|vn)$/.test(value);
            },
            message: (props) => `${props.value} is not a valid email`,
         },
         required: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
         default: '123456',
      },
      role: {
         type: String,
         default: 'user',
      },
      firstName: {
         type: String,
         required: true,
      },
      lastName: {
         type: String,
         required: true,
      },
      birthday: {
         type: Date,
      },
      gender: {
         type: String,
         enum: ['male', 'female'],
      },
      address: {
         type: String,
      },
      phone: {
         type: String,
         validate: {
            validator: function (value) {
               return /((09|03|07|08|05)+([0-9]{8})\b)/g.test(value);
            },
            message: (props) => `${props.value} is not a valid phone number`,
         },
         required: true,
         unique: true,
      },
      avatar: {
         type: String,
      },
      favoriteBook: [
         {
            type: Schema.Types.ObjectId,
            ref: 'books',
         },
      ],
      borrowedBook: [
         {
            type: Schema.Types.ObjectId,
            ref: 'borrowings',
         },
      ],
      isBlocked: {
         type: Boolean,
         default: false,
      },
      refreshToken: {
         type: String,
      },
      passwordChangedAt: {
         type: Date,
      },
      resetPasswordToken: {
         type: String,
      },
      resetPasswordTokenExpires: {
         type: Date,
      },
   },
   { timestamps: true }
);

const UserModel = mongoose.model('users', userSchema);

export default UserModel;
