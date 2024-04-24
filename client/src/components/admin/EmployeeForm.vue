<script setup>
   import { useForm } from 'vee-validate';
   import * as yup from 'yup';
   import { EMPLOYEE_ROLE } from '~/utils/constants';

   const props = defineProps({
      employee: Object,
   });

   const emit = defineEmits(['submitEmployee', 'cancel']);

   const schema = yup.object().shape({
      employeeId: yup.string().required('Tên đăng nhập không thể để trống.'),
      fullName: yup.string().required('Họ và tên không thể để trống.'),
      role: yup.object(),
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
         employeeId: props.employee.employeeId,
         fullName: props.employee.fullName,
         address: props.employee.address,
         role: EMPLOYEE_ROLE.find((role) => role.value === props.employee.role),
         phone: props.employee.phone,
      },
   });

   const vuetifyConfig = (state) => ({
      props: {
         'error-messages': state.errors,
      },
   });

   const [employeeId, employeeIdProps] = defineField(
      'employeeId',
      vuetifyConfig
   );
   const [fullName, fullNameProps] = defineField('fullName', vuetifyConfig);
   const [avatar, avatarProps] = defineField('avatar', vuetifyConfig);
   const [address, addressProps] = defineField('address', vuetifyConfig);
   const [role, roleProps] = defineField('role', vuetifyConfig);
   const [phone, phoneProps] = defineField('phone', vuetifyConfig);

   const onSubmit = handleSubmit((values) => {
      let updateEmployee;
      if (!props.employee?.password) {
         values.password = '123456';
      }
      console.log(values);
      values.role = values?.role?.value;
      const { avatar, ...employeeData } = props.employee;
      updateEmployee = { ...employeeData, ...values };
      console.log(values);
      emit('submitEmployee', updateEmployee);
   });

   defineExpose({ onSubmit });
</script>

<template>
   <v-form
      method="post"
      enctype="multipart/form-data"
      @submit="onSubmit"
      @keyup.enter="onSubmit"
      class="px-4"
   >
      <v-text-field
         counter
         v-model="employeeId"
         v-bind="employeeIdProps"
         label="Tên đăng nhập"
         variant="outlined"
         bg-color="surface-light"
      />

      <v-text-field
         counter
         v-model="fullName"
         v-bind="fullNameProps"
         label="Tên"
         type="text"
         variant="outlined"
         bg-color="surface-light"
      />

      <p class="title">Ảnh đại diện</p>
      <v-file-input
         accept="image/png, image/jpg, image/jpeg"
         v-model="avatar"
         v-bind="avatarProps"
         :prepend-icon="null"
         clearable
         variant="outlined"
         bg-color="surface-light"
         type="file"
      >
         <template v-slot:prepend-inner>
            <v-btn
               color="primary"
               variant="tonal"
               >Chọn file</v-btn
            >
         </template>
      </v-file-input>

      <v-select
         v-model="role"
         v-bind="roleProps"
         :items="EMPLOYEE_ROLE"
         item-title="text"
         item-value="value"
         label="Quyền hạn"
         return-object
         density="default"
         variant="outlined"
         bg-color="surface-light"
      ></v-select>

      <v-text-field
         counter
         v-model="address"
         v-bind="addressProps"
         label="Địa chỉ"
         type="text"
         variant="outlined"
         bg-color="surface-light"
      />

      <v-text-field
         counter
         v-model="phone"
         v-bind="phoneProps"
         label="Số điện thoại"
         type="text"
         variant="outlined"
         bg-color="surface-light"
      />
   </v-form>
</template>
