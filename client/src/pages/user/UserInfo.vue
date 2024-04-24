<template>
   <v-container
      class="page"
      style="position: relative"
   >
      <v-row class="justify-center">
         <v-col
            md="8"
            class="pa-4 pa-md-6"
         >
            <v-sheet
               rounded="lg"
               elevation="2"
            >
               <div class="pa-4">
                  <p class="heading text-uppercase">
                     Chỉnh sửa thông tin cá nhân
                  </p>
               </div>
               <v-divider></v-divider>
               <v-form
                  class="pa-4"
                  method="post"
                  enctype="multipart/form-data"
                  @submit="onSubmit"
                  @keyup.enter="onSubmit"
               >
                  <p class="title mb-1">Tên đăng nhập</p>
                  <v-text-field
                     counter
                     v-model="userId"
                     v-bind="userIdProps"
                     placeholder="Nhập tên đăng nhập"
                     variant="outlined"
                     bg-color="surface-light"
                  />
                  <p class="title mb-1">Email</p>
                  <v-text-field
                     counter
                     v-model="email"
                     v-bind="emailProps"
                     placeholder="Nhập email"
                     type="text"
                     variant="outlined"
                     bg-color="surface-light"
                  />

                  <v-row>
                     <v-col>
                        <p class="title mb-1">Họ và tên đệm</p>
                        <v-text-field
                           counter
                           v-model="lastName"
                           v-bind="lastNameProps"
                           placeholder="Nhập họ và tên đệm"
                           type="text"
                           variant="outlined"
                           bg-color="surface-light"
                        />
                     </v-col>
                     <v-col>
                        <p class="title mb-1">Tên</p>
                        <v-text-field
                           counter
                           v-model="firstName"
                           v-bind="firstNameProps"
                           placeholder="Nhập tên"
                           type="text"
                           variant="outlined"
                           bg-color="surface-light"
                        />
                     </v-col>
                  </v-row>

                  <p class="title mb-1">Ảnh đại diện</p>
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

                  <v-row>
                     <v-col>
                        <p class="title mb-1">Ngày sinh</p>
                        <v-text-field
                           counter
                           v-model="birthday"
                           v-bind="birthdayProps"
                           type="date"
                           variant="outlined"
                           bg-color="surface-light"
                        >
                        </v-text-field>
                     </v-col>
                     <v-col>
                        <p class="title mb-1">Giới tính</p>
                        <v-select
                           v-model="gender"
                           v-bind="genderProps"
                           :items="USER_GENDER"
                           item-title="text"
                           item-value="value"
                           placeholder="Giới tính"
                           return-object
                           density="default"
                           variant="outlined"
                           bg-color="surface-light"
                        ></v-select>
                     </v-col>
                  </v-row>

                  <p class="title mb-1">Địa chỉ</p>
                  <v-text-field
                     counter
                     v-model="address"
                     v-bind="addressProps"
                     placeholder="Nhập địa chỉ"
                     type="text"
                     variant="outlined"
                     bg-color="surface-light"
                  />
                  <p class="title mb-1">Số điện thoại</p>
                  <v-text-field
                     counter
                     v-model="phone"
                     v-bind="phoneProps"
                     placeholder="Nhập số điện thoại"
                     type="text"
                     variant="outlined"
                     bg-color="surface-light"
                  />
               </v-form>

               <div class="d-flex pa-4 pt-0">
                  <v-spacer></v-spacer>
                  <v-btn
                     color="primary"
                     flat
                     @click="onSubmit"
                     >Cập nhật</v-btn
                  >
               </div>
            </v-sheet>
         </v-col>
      </v-row>
   </v-container>

   <v-snackbar
      v-model="snackbar"
      multi-line
      timeout="2500"
      close-on-back
      position="fixed"
      location="bottom right"
      :color="snackbarColor ? 'success' : 'danger'"
   >
      {{ snackbarContent }}

      <template v-slot:actions>
         <v-btn
            variant="text"
            @click="snackbar = false"
            :icon="mdiClose"
         >
         </v-btn>
      </template>
   </v-snackbar>
   <div
      v-if="!updateUserSuccess"
      class="loading-circular d-flex flex-column ga-4"
      style="width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.3)"
   >
      <v-progress-circular
         :size="70"
         :width="7"
         color="primary"
         indeterminate
      ></v-progress-circular>
      <p class="subheading">Đang cập nhật</p>
   </div>
</template>

<script setup>
   import { useForm } from 'vee-validate';
   import * as yup from 'yup';
   import { USER_GENDER } from '~/utils/constants';
   import { onActivated, onMounted, ref } from 'vue';
   import UserService from '~/services/UserService';
   import { useCurrentUserStore, useCurrentPageStore } from '~/stores';
   import { mdiClose } from '@mdi/js';

   const currentPageStore = useCurrentPageStore();
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
   const { setCurrentUser } = useCurrentUserStore();
   const currentUser = ref(null);
   const getCurrentUser = async () => {
      try {
         setCurrentUser((await UserService.getCurrent()).userData);
         currentUser.value = useCurrentUserStore().currentUser;
      } catch (error) {
         console.log(error);
      }
   };
   const { defineField, handleSubmit, resetForm } = useForm({
      validationSchema: schema,
      initialValues: {
         userId: currentUser.userId,
         email: currentUser.email,
         lastName: currentUser.lastName,
         firstName: currentUser.firstName,
         birthday: currentUser.birthday,
         address: currentUser.address,
         gender: USER_GENDER.find(
            (gender) => gender.value === currentUser.gender
         ),
         phone: currentUser.phone,
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
   const [avatar, avatarProps] = defineField('avatar', vuetifyConfig);
   const [birthday, birthdayProps] = defineField('birthday', vuetifyConfig);
   const [address, addressProps] = defineField('address', vuetifyConfig);
   const [gender, genderProps] = defineField('gender', vuetifyConfig);
   const [phone, phoneProps] = defineField('phone', vuetifyConfig);

   const snackbar = ref(false);
   const snackbarColor = ref(true);
   const snackbarContent = ref('');
   const updateUserSuccess = ref(true);
   const onSubmit = handleSubmit(async (values) => {
      try {
         updateUserSuccess.value = false;
         values.gender = values?.gender?.value;
         console.log(values);
         const { avatar, ...userData } = values;
         let formData = new FormData();
         await UserService.updateCurrent(userData);
         if (avatar) {
            formData.append('avatar', avatar[0]);
            await UserService.uploadUserAvatar(currentUser.value._id, formData);
         }
         updateUserSuccess.value = true;
         snackbarContent.value = 'Cập nhật thành công';
         snackbarColor.value = true;
         snackbar.value = true;
      } catch (error) {
         updateUserSuccess.value = true;
         console.log(error);
         snackbarContent.value =
            'Tên đăng nhập hoặc email hoặc số điện thoại đã được sử dụng';
         snackbarColor.value = false;
         snackbar.value = true;
      }
   });

   onMounted(async () => {
      await getCurrentUser();
      resetForm({
         values: {
            userId: currentUser.value.userId,
            email: currentUser.value.email,
            lastName: currentUser.value.lastName,
            firstName: currentUser.value.firstName,
            birthday: currentUser.value.birthday,
            address: currentUser.value.address,
            gender: USER_GENDER.find(
               (gender) => gender.value === currentUser.value.gender
            ),
            phone: currentUser.value.phone,
         },
      });
   });

   onActivated(async () => {
      currentPageStore.setCurrentPage('user-info');
      await getCurrentUser();
      resetForm({
         values: {
            userId: currentUser.value.userId,
            email: currentUser.value.email,
            lastName: currentUser.value.lastName,
            firstName: currentUser.value.firstName,
            birthday: currentUser.value.birthday,
            address: currentUser.value.address,
            gender: USER_GENDER.find(
               (gender) => gender.value === currentUser.value.gender
            ),
            phone: currentUser.value.phone,
         },
      });
   });
</script>

<style scope>
   @import url('~/assets/css/UserInfo.css');
</style>
