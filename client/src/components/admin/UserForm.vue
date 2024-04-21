<script setup>
   import { useForm } from 'vee-validate';
   import * as yup from 'yup';
   import { USER_GENDER } from '~/utils/constants';

   const props = defineProps({
      user: Object,
   });

   const emit = defineEmits(['submitUser', 'cancel']);

   const schema = yup.object().shape({
      userId: yup.string().required('Tên đăng nhập không thể để trống.'),
      email: yup
         .string()
         .required('Email không thể để trống')
         .email('Email không đúng định dạng')
         .matches(
            /^[\w-\.]+@([\w-]+\.)+(com|vn)$/,
            'Email không đúng định dạng'
         )
         .max(50, 'Email dài tối đa 50 kí tự'),

      lastName: yup.string().required('Họ và tên đệm không thể để trống.'),
      firstName: yup.string().required('Tên không thể để trống.'),
      birthday: yup.date().nullable(),
      address: yup.string(),
      gender: yup.object(),
      phone: yup
         .string()
         .required('Số điện thoại không thể để trống')
         .matches(
            /((09|03|07|08|05)+([0-9]{8})\b)/g,
            'Số điện thoại không hợp lệ.'
         ),
   });

   const { defineField, handleSubmit, resetForm } = useForm({
      validationSchema: schema,
      initialValues: {
         userId: props.user.userId,
         email: props.user.email,
         lastName: props.user.lastName,
         firstName: props.user.firstName,
         birthday: props.user.birthday,
         address: props.user.address,
         gender: USER_GENDER.find(
            (gender) => gender.value === props.user.gender
         ),
         phone: props.user.phone,
      },
   });

   const vuetifyConfig = (state) => ({
      props: {
         'error-messages': state.errors,
      },
   });

   const [userId, userIdProps] = defineField('userId', vuetifyConfig);
   const [email, emailProps] = defineField('email', vuetifyConfig);
   const [lastName, lastNameProps] = defineField('lastName', vuetifyConfig);
   const [firstName, firstNameProps] = defineField('firstName', vuetifyConfig);
   const [birthday, birthdayProps] = defineField('birthday', vuetifyConfig);
   const [address, addressProps] = defineField('address', vuetifyConfig);
   const [gender, genderProps] = defineField('gender', vuetifyConfig);
   const [phone, phoneProps] = defineField('phone', vuetifyConfig);

   const onSubmit = handleSubmit((values) => {
      if (!props.user?.password) {
         values.password = '123456';
      }
      console.log(values);
      values.gender = values?.gender?.value;
      const updateUser = { ...props.user, ...values };
      console.log(values);
      emit('submitUser', updateUser);
   });

   defineExpose({ onSubmit });
</script>

<template>
   <v-form
      @submit="onSubmit"
      @keyup.enter="onSubmit"
      class="px-4"
   >
      <v-text-field
         counter
         v-model="userId"
         v-bind="userIdProps"
         label="Tên đăng nhập"
      />

      <v-text-field
         counter
         v-model="email"
         v-bind="emailProps"
         label="Email"
         type="text"
      />

      <v-text-field
         counter
         v-model="lastName"
         v-bind="lastNameProps"
         label="Họ và tên đệm"
         type="text"
      />

      <v-text-field
         counter
         v-model="firstName"
         v-bind="firstNameProps"
         label="Tên"
         type="text"
      />

      <v-text-field
         counter
         v-model="birthday"
         v-bind="birthdayProps"
         label="Ngày sinh"
         type="date"
      >
      </v-text-field>

      <v-select
         v-model="gender"
         v-bind="genderProps"
         :items="USER_GENDER"
         item-title="text"
         item-value="value"
         label="Giới tính"
         return-object
         density="default"
      ></v-select>

      <v-text-field
         counter
         v-model="address"
         v-bind="addressProps"
         label="Địa chỉ"
         type="text"
      />

      <v-text-field
         counter
         v-model="phone"
         v-bind="phoneProps"
         label="Số điện thoại"
         type="text"
      />
   </v-form>
</template>
