import mongoose, { Schema } from 'mongoose';

const employeeSchema = new Schema(
   {
      employeeId: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
      role: {
         type: String,
         default: 'employee',
      },
      fullName: {
         type: String,
         required: true,
      },
      position: {
         type: String,
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
      refreshToken: {
         type: String,
      },
   },
   { timestamps: true }
);

const EmployeeModel = mongoose.model('employees', employeeSchema);

export default EmployeeModel;
