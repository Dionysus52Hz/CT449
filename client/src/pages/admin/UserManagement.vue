<template>
   <v-app-bar
      elevation="0"
      style="position: fixed"
   >
      <v-spacer></v-spacer>
      <v-btn
         @click="refreshUser"
         size="small"
         >Làm mới dữ liệu</v-btn
      >

      <v-btn
         size="small"
         @click="addFormDialog = true"
         >Thêm độc giả mới</v-btn
      >

      <v-spacer></v-spacer>
   </v-app-bar>

   <v-app-bar
      elevation="0"
      :height="84"
      style="position: fixed"
      class="bg-surface-light"
   >
      <div class="pa-4 w-100">
         <search-bar
            :filters="USER_SEARCH_FILTERS_FOR_ADMIN"
            @submit-search="submitSearch"
         ></search-bar>
      </div>
   </v-app-bar>

   <div
      class="loading-circular"
      v-if="!users"
   >
      <v-progress-circular
         :size="70"
         :width="7"
         color="primary"
         indeterminate
         v-if="!users"
      ></v-progress-circular>
   </div>

   <data-table
      :items="users"
      :itemProperties="
         userProperties.filter((prop) => prop !== '_id' && prop !== 'slug')
      "
      :itemsCount="usersCount"
      :tableHeaders="tableHeaders"
      :sort-by="USER_SORT_BY"
      :sort-type="SORT_TYPE"
      @item-active="setActiveUser"
      v-if="usersCount > 0"
   ></data-table>
   <p
      class="text-center subheading py-4"
      v-else
   >
      Không tìm thấy dữ liệu người dùng.
   </p>

   <div class="text-center pa-4">
      <v-dialog
         v-model="updateFormDialog"
         max-width="600"
         persistent
         scrollable
      >
         <v-card title="Sửa thông tin người dùng">
            <v-divider></v-divider>

            <v-card-text>
               <user-form
                  :user="userActive"
                  @submitUser="updateUser"
                  ref="updateForm"
               ></user-form>
            </v-card-text>

            <v-card-actions class="px-6">
               <v-spacer></v-spacer>
               <v-btn
                  text="Huỷ bỏ"
                  variant="plain"
                  @click="updateFormDialog = false"
               ></v-btn>

               <v-btn
                  color="primary"
                  text="Lưu"
                  variant="flat"
                  @click="submitUpdateUserForm"
               ></v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>

      <v-dialog
         v-model="addFormDialog"
         max-width="600"
         persistent
         scrollable
      >
         <v-card title="Thêm người dùng mới">
            <v-divider></v-divider>

            <v-card-text>
               <user-form
                  :user="{}"
                  ref="addForm"
                  @submitUser="addUser"
               ></user-form>
            </v-card-text>

            <v-card-actions class="px-6">
               <v-spacer></v-spacer>
               <v-btn
                  text="Huỷ bỏ"
                  variant="plain"
                  @click="addFormDialog = false"
               ></v-btn>

               <v-btn
                  color="primary"
                  text="Lưu"
                  variant="flat"
                  @click="submitAddUserForm"
               ></v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>

      <v-dialog
         v-model="requireLoginDialog"
         max-width="600"
         persistent
         scrollable
      >
         <v-card title="THÔNG BÁO">
            <v-divider></v-divider>

            <v-card-text>
               <p>Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại</p>
            </v-card-text>

            <v-card-actions class="px-6">
               <v-spacer></v-spacer>

               <v-btn
                  color="primary"
                  text="Đồng ý"
                  variant="flat"
                  @click="
                     (requireLoginDialog = false), logout(), goToLoginPage()
                  "
               ></v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>

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
   </div>
</template>

<script setup>
   import UserService from '~/services/UserService';
   import DataTable from '~/components/admin/DataTable.vue';
   import UserForm from '~/components/admin/UserForm.vue';
   import {
      USER_TABLE_HEADERS,
      USER_SEARCH_FILTERS_FOR_ADMIN,
      USER_SORT_BY,
      SORT_TYPE,
   } from '~/utils/constants';
   import { convertTimestamp } from '~/utils/algorithms';
   import { onMounted, ref } from 'vue';
   import { useRouter } from 'vue-router';
   import { useLoginStore, useSearchFilterForUserStore } from '~/stores';
   import { mdiClose } from '@mdi/js';
   import EmployeeService from '~/services/EmployeeService';
   import SearchBar from '~/components/user/SearchBar.vue';

   const users = ref(null);
   const usersCount = ref(0);
   const userProperties = Object.keys(USER_TABLE_HEADERS);
   const tableHeaders = Object.values(USER_TABLE_HEADERS);

   const addFormDialog = ref(false);
   const updateFormDialog = ref(false);
   const requireLoginDialog = ref(false);

   const addForm = ref(null);
   const updateForm = ref(null);
   const submitAddUserForm = () => {
      addForm.value.onSubmit();
   };
   const submitUpdateUserForm = () => {
      updateForm.value.onSubmit();
   };
   const router = useRouter();
   const loginStore = useLoginStore();
   const goToLoginPage = () => {
      router.replace({
         name: 'loginPage',
      });
   };

   const checkRequiredLogin = (error) => {
      const errorResponse = error.response.data;
      if (
         errorResponse.message === 'TokenExpiredError: jwt expired' &&
         errorResponse.statusCode === 400
      ) {
         requireLoginDialog.value = true;
      }
   };
   const snackbar = ref(false);
   const snackbarColor = ref(true);
   const snackbarContent = ref('');

   const userActive = ref(null);
   const setActiveUser = async (user) => {
      try {
         userActive.value = (await UserService.getUser(user._id)).user;
         updateFormDialog.value = true;
      } catch (error) {
         checkRequiredLogin(error);
      }
   };

   const convertUserTimestamp = () => {
      users.value?.map((user) => {
         user.birthday
            ? (user.birthday = new Date(user.birthday).toLocaleDateString(
                 'vi-VN'
              ))
            : null;

         user.createdAt = convertTimestamp(user.createdAt);

         user.updatedAt
            ? (user.updatedAt = convertTimestamp(user.updatedAt))
            : null;
      });
   };

   const logout = async () => {
      try {
         await EmployeeService.logout();
         loginStore.setLoginState({
            isLoggedIn: false,
            owner: null,
            role: null,
         });
      } catch (error) {
         console.log(error);
      }
   };

   const getUsers = async () => {
      try {
         users.value = (await UserService.getUsers()).users;
         usersCount.value = users.value.length;
      } catch (error) {
         const errorResponse = error.response.data;
         if (
            errorResponse.message === 'TokenExpiredError: jwt expired' &&
            errorResponse.statusCode === 400
         ) {
            requireLoginDialog.value = true;
         }
      }
   };

   const addUser = async (data) => {
      try {
         const { avatar, ...userData } = data;
         const idOfCreatedUser = (await UserService.create(userData))
            .createdUser._id;

         let formData = new FormData();
         if (avatar) {
            console.log(avatar);
            formData.append('avatar', avatar[0]);
            await UserService.uploadUserAvatar(idOfCreatedUser, formData);
         }
         addFormDialog.value = false;
         await refreshUser();
         snackbarColor.value = true;
         snackbarContent.value = 'Thêm thành công';
         snackbar.value = true;
         await refreshUser();
      } catch (error) {
         snackbarColor.value = false;
         snackbarContent.value = 'Người dùng đã tồn tại';
         snackbar.value = true;
         console.log(error);
         checkRequiredLogin(error);
      }
   };

   const updateUser = async (data) => {
      try {
         const { avatar, ...userData } = data;
         let formData = new FormData();
         if (avatar) {
            formData.append('avatar', avatar[0]);
            await UserService.uploadUserAvatar(data._id, formData);
         }
         updateFormDialog.value = false;
         await UserService.updateUser(data._id, userData);
         snackbarContent.value = 'Cập nhật thành công';
         snackbarColor.value = true;
         snackbar.value = true;
         await refreshUser();
      } catch (error) {
         console.log(error);
         snackbarContent.value = 'Có lỗi xảy ra, cập nhật không thành công';
         snackbarColor.value = false;
         snackbar.value = true;
         checkRequiredLogin(error);
      }
   };

   const submitSearch = async () => {
      const { searchFilter } = useSearchFilterForUserStore();
      console.log(searchFilter);

      const result = (await UserService.getUsersByFilter(searchFilter)).result;
      console.log(result);
      users.value = result;
      usersCount.value = result?.length;
      await convertUserTimestamp();
   };

   const refreshUser = async () => {
      await getUsers();
      await convertUserTimestamp();
      const { setSearchFilter } = useSearchFilterForUserStore();
      setSearchFilter({
         searchText: '',
         filterSelected: USER_SEARCH_FILTERS_FOR_ADMIN[0],
      });
   };

   onMounted(async () => {
      await refreshUser();
   });
</script>

<style scoped>
   @import url('~/assets/css/UserManagement.css');
</style>
