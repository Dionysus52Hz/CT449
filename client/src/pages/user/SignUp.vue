<template>
   <v-container class="page pa-6">
      <v-sheet
         max-width="800"
         class="ma-auto overflow-hidden"
         rounded="lg"
      >
         <v-container
            fluid
            class="pa-3"
         >
            <v-row>
               <v-col class="pa-0 v-col-6 d-none d-md-block">
                  <v-card
                     class="sign-up-form-bg"
                     color="indigo-lighten-4"
                     elevation="0"
                     rounded="0"
                  ></v-card>
               </v-col>
               <v-col class="pa-0">
                  <v-card
                     class="rounded-0 rounded-e-lg"
                     elevation="0"
                  >
                     <v-card-item class="py-4 ps-6">
                        <v-card-title class="font-weight-bold"
                           >TẠO TÀI KHOẢN MỚI</v-card-title
                        >
                     </v-card-item>

                     <v-divider></v-divider>

                     <v-card-text class="pa-6">
                        <v-form
                           @submit="onSubmit"
                           @keyup.enter="onSubmit"
                        >
                           <div class="font-weight-bold mb-2">
                              Tên đăng nhập
                           </div>

                           <v-text-field
                              v-model="userId"
                              counter="8"
                              v-bind="userIdProps"
                              placeholder="Nhập tên đăng nhập"
                              variant="outlined"
                           />

                           <div class="font-weight-bold mt-3 mb-2">Email</div>

                           <v-text-field
                              counter="50"
                              v-model="email"
                              v-bind="emailProps"
                              placeholder="Địa chỉ email"
                              hint="Chỉ chấp nhận email có đuôi .com hoặc .vn"
                              type="email"
                              variant="outlined"
                              autocomplete="null"
                           />

                           <div class="font-weight-bold mt-3 mb-2">
                              Số điện thoại
                           </div>

                           <v-text-field
                              counter="50"
                              v-model="phone"
                              v-bind="phoneProps"
                              placeholder="Nhập số điện thoại"
                              type="text"
                              variant="outlined"
                              autocomplete="null"
                           />

                           <v-row no-gutters>
                              <v-col
                                 cols="12"
                                 sm="6"
                                 class="d-flex flex-column pe-sm-3"
                              >
                                 <div class="font-weight-bold mt-3 mb-2">
                                    Họ và tên đệm
                                 </div>
                                 <v-text-field
                                    counter="50"
                                    v-model="lastName"
                                    v-bind="lastNameProps"
                                    placeholder="Nhập họ và tên đệm"
                                    type="text"
                                    variant="outlined"
                                    autocomplete="null"
                                 />
                              </v-col>

                              <v-col
                                 cols="12"
                                 sm="6"
                                 class="d-flex flex-column ps-sm-3"
                              >
                                 <div class="font-weight-bold mt-3 mb-2">
                                    Tên
                                 </div>
                                 <v-text-field
                                    counter="50"
                                    v-model="firstName"
                                    v-bind="firstNameProps"
                                    placeholder="Nhập tên"
                                    type="text"
                                    variant="outlined"
                                    autocomplete="null"
                                 />
                              </v-col>
                           </v-row>

                           <div class="font-weight-bold mt-3 mb-2">
                              Mật khẩu
                           </div>

                           <v-text-field
                              v-model="password"
                              v-bind="passwordProps"
                              :type="showPassword ? 'text' : 'password'"
                              hint="Mật khẩu có ít nhất 8 kí tự"
                              placeholder="Nhập mật khẩu"
                              counter
                              variant="outlined"
                           >
                              <template v-slot:append-inner>
                                 <v-btn
                                    variant="text"
                                    :icon="showPassword ? mdiEye : mdiEyeOff"
                                    @click="showPassword = !showPassword"
                                 ></v-btn>
                              </template>
                           </v-text-field>

                           <div class="font-weight-bold mt-3 mb-2">
                              Nhập lại mật khẩu
                           </div>

                           <v-text-field
                              v-model="passwordConfirmation"
                              v-bind="passwordConfirmationProps"
                              :type="
                                 showPasswordConfirmation ? 'text' : 'password'
                              "
                              placeholder="Nhập lại mật khẩu"
                              counter
                              variant="outlined"
                           >
                              <template v-slot:append-inner>
                                 <v-btn
                                    variant="text"
                                    :icon="
                                       showPasswordConfirmation
                                          ? mdiEye
                                          : mdiEyeOff
                                    "
                                    @click="
                                       showPasswordConfirmation =
                                          !showPasswordConfirmation
                                    "
                                 ></v-btn>
                              </template>
                           </v-text-field>
                        </v-form>
                     </v-card-text>

                     <v-card-item class="pa-6 pt-2">
                        <v-btn
                           color="primary"
                           block
                           height="48"
                           rounded="lg"
                           @click="onSubmit"
                           >Tạo tài khoản mới</v-btn
                        >

                        <div class="flex-center mt-2">
                           <span class="ma-2 me-1"> Đã có tài khoản? </span>
                           <router-link
                              class="text-primary font-weight-bold text-decoration-underline ma-2 ms-1"
                              :to="{
                                 name: 'loginPage',
                              }"
                              >Đăng nhập ngay</router-link
                           >
                        </div>
                     </v-card-item>
                  </v-card>
               </v-col>
            </v-row>
         </v-container>
      </v-sheet>

      <v-dialog
         v-model="signUpDone"
         width="auto"
      >
         <v-card
            class=""
            rounded="lg"
         >
            <v-card-item class="pa-4">
               <template v-slot:prepend>
                  <p class="subheading text-uppercase">Thông báo</p>
               </template>
               <template v-slot:append>
                  <v-icon
                     :icon="mdiClose"
                     @click="signUpDone = !signUpDone"
                  ></v-icon>
               </template>
            </v-card-item>
            <v-divider></v-divider>
            <v-card-text class="flex-center flex-column px-8">
               <v-btn
                  style="font-size: 3rem"
                  :icon="signUpSucess ? mdiCheck : mdiClose"
                  :color="signUpSucess ? 'success' : 'error'"
                  size="90"
                  flat
               ></v-btn>

               <p class="subheading mt-5 text-center">
                  {{ signUpNotification }}
               </p>
            </v-card-text>
            <v-card-item class="pa-5 pa-sm-8 pt-sm-5">
               <v-btn
                  v-if="signUpSucess"
                  color="primary"
                  flat
                  block
                  :to="{
                     name: 'loginPage',
                  }"
                  @click="signUpDone = !signUpDone"
                  >ĐĂNG NHẬP NGAY</v-btn
               >
               <v-btn
                  v-if="signUpSucess"
                  class="mt-4"
                  color="primary"
                  variant="tonal"
                  block
                  :to="{
                     name: 'userHomePage',
                  }"
                  >QUAY VỀ TRANG CHỦ</v-btn
               >
               <v-btn
                  v-if="!signUpSucess"
                  class=""
                  color="primary"
                  variant="tonal"
                  block
                  @click="signUpDone = !signUpDone"
                  >ĐĂNG KÝ LẠI</v-btn
               >
            </v-card-item>
         </v-card>
      </v-dialog>
   </v-container>
</template>

<script setup>
   import { useForm } from 'vee-validate';
   import * as yup from 'yup';
   import { ref } from 'vue';
   import { mdiCheck, mdiClose, mdiEye, mdiEyeOff } from '@mdi/js';
   import UserService from '~/services/UserService';
   import { onBeforeUnmount } from 'vue';
   import { onMounted } from 'vue';
   import { useCurrentPageStore } from '~/stores';

   const currentPageStore = useCurrentPageStore();
   currentPageStore.setCurrentPage('signup');
   const schema = yup.object().shape({
      userId: yup.string().required('Tên đăng nhập không thể để trống'),

      email: yup
         .string()
         .required('Email không thể để trống')
         .email('Email không đúng định dạng')
         .matches(
            /^[\w-\.]+@([\w-]+\.)+(com|vn)$/,
            'Email không đúng định dạng'
         )
         .max(50, 'Email dài tối đa 50 kí tự'),

      phone: yup
         .string()
         .required('Số điện thoại không thể để trống')
         .matches(
            /((09|03|07|08|05)+([0-9]{8})\b)/g,
            'Số điện thoại không hợp lệ.'
         ),

      lastName: yup.string().required('Họ và tên đệm không thể để trống'),

      lastName: yup.string().required('Tên không thể để trống'),

      password: yup
         .string()
         .required('Mật khẩu không thể để trống')
         .min(6, 'Mật khẩu phải có ít nhất 6 kí tự')
         .max(255, 'Mật khẩu dài tối đa 255 kí tự'),

      passwordConfirmation: yup
         .string()
         .required('Mật khẩu không thể để trống')
         .oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
   });

   const { defineField, handleSubmit, resetForm } = useForm({
      validationSchema: schema,
   });
   const vuetifyConfig = (state) => ({
      props: {
         'error-messages': state.errors,
      },
   });
   const [userId, userIdProps] = defineField('userId', vuetifyConfig);
   const [email, emailProps] = defineField('email', vuetifyConfig);
   const [password, passwordProps] = defineField('password', vuetifyConfig);
   const [phone, phoneProps] = defineField('phone', vuetifyConfig);
   const [lastName, lastNameProps] = defineField('lastName', vuetifyConfig);
   const [firstName, firstNameProps] = defineField('firstName', vuetifyConfig);
   const [passwordConfirmation, passwordConfirmationProps] = defineField(
      'passwordConfirmation',
      vuetifyConfig
   );
   const showPassword = ref(false);
   const showPasswordConfirmation = ref(false);
   const signUpDone = ref(false);
   const signUpSucess = ref(false);
   const signUpNotification = ref('');
   const onSubmit = handleSubmit(async (values) => {
      try {
         const { passwordConfirmation, ...dataSubmited } = values;
         await UserService.create(dataSubmited);
         signUpNotification.value = 'Đăng ký thành công';
         signUpSucess.value = true;
         signUpDone.value = true;
      } catch (error) {
         const errorResponse = error.response;
         console.log(errorResponse);
         if (
            errorResponse?.data.status === 400 ||
            errorResponse?.data?.message === 'Error: User is existed!'
         ) {
            console.log(123);
            signUpNotification.value =
               'Tên đăng nhập hoặc email hoặc số điện thoại đã tồn tại';
            signUpSucess.value = false;
            signUpDone.value = true;
         }
      }
   });
</script>

<style scoped>
   @import '~/assets/css/SignUp.css';
</style>
