<template>
   <v-container
      class="page pa-6"
      style="min-height: 100vh"
   >
      <v-sheet
         max-width="720"
         class="ma-auto overflow-hidden"
         rounded="lg"
      >
         <v-container
            fluid
            class="pa-3"
         >
            <v-row>
               <v-col class="pa-0">
                  <v-tabs
                     v-model="loginTab"
                     color="primary"
                  >
                     <v-tab value="userLogin"
                        >Đăng nhập với tư cách độc giả</v-tab
                     >
                     <v-tab value="employeeLogin"
                        >Đăng nhập với tư cách nhân viên</v-tab
                     >
                  </v-tabs>

                  <div>
                     <v-window v-model="loginTab">
                        <v-window-item value="userLogin">
                           <v-card
                              class=""
                              elevation="0"
                           >
                              <v-card-text class="pa-6">
                                 <v-form
                                    @submit="onUserSubmit"
                                    @keyup.enter="onUserSubmit"
                                 >
                                    <div class="font-weight-bold mb-2">
                                       Tên đăng nhập
                                    </div>
                                    <v-text-field
                                       v-model="userId"
                                       v-bind="userIdProps"
                                       placeholder="Tên đăng nhập"
                                       hide-details
                                       variant="outlined"
                                    />
                                    <div class="font-weight-bold mt-5 mb-2">
                                       Mật khẩu
                                    </div>
                                    <v-text-field
                                       v-model="password"
                                       v-bind="passwordProps"
                                       :type="
                                          showPassword ? 'text' : 'password'
                                       "
                                       placeholder="Nhập mật khẩu"
                                       variant="outlined"
                                    >
                                       <template v-slot:append-inner>
                                          <v-btn
                                             variant="text"
                                             :icon="
                                                showPassword
                                                   ? mdiEye
                                                   : mdiEyeOff
                                             "
                                             @click.stop.prevent="
                                                showPassword = !showPassword
                                             "
                                          ></v-btn>
                                       </template>
                                    </v-text-field>
                                 </v-form>
                              </v-card-text>
                              <v-card-item class="pa-6">
                                 <v-btn
                                    color="primary"
                                    block
                                    height="48"
                                    rounded="lg"
                                    :disabled="inputsAreEmpty ? true : false"
                                    @click="onUserSubmit"
                                    >Đăng nhập</v-btn
                                 >

                                 <div class="flex-center mt-2">
                                    <span class="ma-2 me-1">
                                       Chưa có tài khoản?
                                    </span>
                                    <router-link
                                       class="text-primary font-weight-bold text-decoration-underline ma-2 ms-1"
                                       :to="{
                                          name: 'signUpPage',
                                       }"
                                       >Đăng ký ngay</router-link
                                    >
                                 </div>
                              </v-card-item>
                           </v-card></v-window-item
                        >

                        <v-window-item value="employeeLogin">
                           <v-card
                              class=""
                              elevation="0"
                           >
                              <v-card-text class="pa-6">
                                 <v-form
                                    @submit="onEmployeeSubmit"
                                    @keyup.enter="onEmployeeSubmit"
                                 >
                                    <div class="font-weight-bold mb-2">
                                       Tên đăng nhập
                                    </div>
                                    <v-text-field
                                       v-model="userId"
                                       v-bind="userIdProps"
                                       placeholder="Tên đăng nhập"
                                       hide-details
                                       variant="outlined"
                                    />
                                    <div class="font-weight-bold mt-5 mb-2">
                                       Mật khẩu
                                    </div>
                                    <v-text-field
                                       v-model="password"
                                       v-bind="passwordProps"
                                       :type="
                                          showPassword ? 'text' : 'password'
                                       "
                                       placeholder="Nhập mật khẩu"
                                       variant="outlined"
                                    >
                                       <template v-slot:append-inner>
                                          <v-btn
                                             variant="text"
                                             :icon="
                                                showPassword
                                                   ? mdiEye
                                                   : mdiEyeOff
                                             "
                                             @click.stop.prevent="
                                                showPassword = !showPassword
                                             "
                                          ></v-btn>
                                       </template>
                                    </v-text-field>
                                 </v-form>
                              </v-card-text>
                              <v-card-item class="pa-6">
                                 <v-btn
                                    color="primary"
                                    block
                                    height="48"
                                    rounded="lg"
                                    :disabled="inputsAreEmpty ? true : false"
                                    @click="onEmployeeSubmit"
                                    >Đăng nhập</v-btn
                                 >
                              </v-card-item>
                           </v-card>
                        </v-window-item>
                     </v-window>
                  </div>
               </v-col>
               <v-col class="pa-0 v-col-6 d-none d-md-block">
                  <v-card
                     color="indigo-lighten-4"
                     class="login-form-bg rounded-0 rounded-e-lg"
                     elevation="0"
                  ></v-card>
               </v-col>
            </v-row>
         </v-container>
      </v-sheet>

      <v-dialog
         v-model="loginDone"
         width="auto"
         max-height="540"
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
                     @click="loginDone = !loginDone"
                  ></v-icon>
               </template>
            </v-card-item>
            <v-divider></v-divider>
            <v-card-text class="flex-center flex-column px-8">
               <v-btn
                  style="font-size: 3rem"
                  :icon="mdiClose"
                  color="error"
                  size="90"
               ></v-btn>

               <p class="subheading mt-8">
                  Tên đăng nhập hoặc mật khẩu không đúng
               </p>
            </v-card-text>
            <v-card-item class="pa-8 pt-5">
               <v-btn
                  color="primary"
                  variant="tonal"
                  block
                  @click="loginDone = !loginDone"
                  >THỬ LẠI</v-btn
               >
            </v-card-item>
         </v-card>
      </v-dialog>
   </v-container>
</template>

<script setup>
   import UserService from '~/services/UserService';
   import EmployeeService from '~/services/EmployeeService';
   import { useForm } from 'vee-validate';
   import { mdiCheck, mdiClose, mdiEye, mdiEyeOff } from '@mdi/js';
   import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
   import { useCurrentPageStore, useLoginStore } from '~/stores';
   import { setAccessToken } from '~/utils/accessToken';
   import { useRouter } from 'vue-router';

   const currentPageStore = useCurrentPageStore();
   currentPageStore.setCurrentPage('login');

   const loginTab = ref(null);

   const { defineField, handleSubmit, resetForm } = useForm();
   const [userId, userIdProps] = defineField('userId');
   const [password, passwordProps] = defineField('password');
   const showPassword = ref(false);
   const loginDone = ref(false);
   const loginSuccess = ref(false);
   const loginStore = useLoginStore();
   const inputsAreEmpty = ref(true);
   watch([userId, password], () => {
      if (
         userId.value !== '' &&
         password.value !== '' &&
         typeof userId.value === 'string' &&
         typeof password.value === 'string'
      ) {
         inputsAreEmpty.value = false;
      } else inputsAreEmpty.value = true;
   });

   const router = useRouter();

   const onUserSubmit = handleSubmit(async (values) => {
      try {
         const { result } = await UserService.login(values);
         const userData = result?.userData;
         const accessToken = result?.accessToken;
         loginSuccess.value = true;

         let state = {
            isLoggedIn: true,
            owner: userData._id,
            role: userData.role,
         };

         setAccessToken(accessToken);

         loginStore.setLoginState(state);
         if (userData.role === 'admin' || userData.role === 'employee') {
            router.replace({
               name: 'adminHomePage',
            });
         } else {
            router.replace({
               name: 'userHomePage',
            });
         }
      } catch (error) {
         console.log(error);
         loginDone.value = true;
         loginSuccess.value = false;
      }
   });

   const onEmployeeSubmit = handleSubmit(async (values) => {
      try {
         const newValues = Object.assign(
            { password: values.password },
            { employeeId: values.userId }
         );
         const { result } = await EmployeeService.login(newValues);
         console.log(result);
         const employeeData = result?.employeeData;
         const accessToken = result?.accessToken;
         loginSuccess.value = true;

         let state = {
            isLoggedIn: true,
            owner: employeeData._id,
            role: employeeData.role,
         };

         setAccessToken(accessToken);

         loginStore.setLoginState(state);

         router.replace({
            name: 'adminOverviewPage',
         });
      } catch (error) {
         console.log(error);
         loginDone.value = true;
         loginSuccess.value = false;
      }
   });

   watch(loginTab, () => {
      resetForm();
   });
</script>

<style scoped>
   @import '~/assets/css/Login.css';
</style>
