<template>
   <v-app-bar
      elevation="0"
      style="position: fixed"
   >
      <v-spacer></v-spacer>
      <v-btn
         @click="refreshEmployee"
         size="small"
         >Làm mới dữ liệu</v-btn
      >

      <v-btn
         size="small"
         @click="addFormDialog = true"
         >Thêm nhân viên mới</v-btn
      >

      <v-spacer></v-spacer>
   </v-app-bar>

   <v-app-bar
      elevation="0"
      :height="84"
      style="position: fixed"
      class="bg-surface-light justify-center"
   >
      <div
         class="pa-4 w-100"
         style="max-width: 1440px; margin: auto"
      >
         <search-bar
            :filters="EMPLOYEE_SEARCH_FILTERS_FOR_ADMIN"
            @submit-search="submitSearch"
         ></search-bar>
      </div>
   </v-app-bar>

   <div
      class="loading-circular"
      v-if="!employees"
   >
      <v-progress-circular
         :size="70"
         :width="7"
         color="primary"
         indeterminate
         v-if="!employees"
      ></v-progress-circular>
   </div>

   <data-table
      :items="employees"
      :itemProperties="
         employeeProperties.filter((prop) => prop !== '_id' && prop !== 'slug')
      "
      :itemsCount="employeesCount"
      :tableHeaders="tableHeaders"
      :sort-by="EMPLOYEE_SORT_BY"
      :sort-type="SORT_TYPE"
      @item-active="setActiveEmployee"
      @deleteItem="confirmDeleteEmployee"
      v-if="employeesCount > 0"
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
         <v-card title="Sửa thông tin nhân viên">
            <div
               v-if="!updateEmployeeSuccess"
               class="loading-circular d-flex flex-column ga-4"
               style="
                  width: 100%;
                  height: 100%;
                  background-color: rgba(0, 0, 0, 0.3);
               "
            >
               <v-progress-circular
                  :size="70"
                  :width="7"
                  color="primary"
                  indeterminate
               ></v-progress-circular>
               <p class="subheading">Đang cập nhật</p>
            </div>
            <v-divider></v-divider>

            <v-card-text>
               <employee-form
                  :employee="employeeActive"
                  @submitEmployee="updateEmployee"
                  ref="updateForm"
               ></employee-form>
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
                  @click="submitUpdateEmployeeForm"
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
         <v-card title="Thêm nhân viên mới">
            <v-divider></v-divider>

            <v-card-text>
               <employee-form
                  :employee="{}"
                  ref="addForm"
                  @submitEmployee="addEmployee"
               ></employee-form>
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
                  @click="submitAddEmployeeForm"
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

      <v-dialog
         v-model="confirmDeleteEmployeeDialog"
         max-width="600"
         persistent
         scrollable
      >
         <v-card title="THÔNG BÁO">
            <v-divider></v-divider>

            <v-card-text>
               <p>Xác nhận muốn xoá tài khoản này?</p>
            </v-card-text>

            <v-card-actions class="pa-4">
               <v-spacer></v-spacer>

               <v-btn
                  text="Huỷ bỏ"
                  variant="tonal"
                  @click="confirmDeleteEmployeeDialog = false"
               ></v-btn>

               <v-btn
                  color="danger"
                  text="Đồng ý"
                  variant="flat"
                  @click="deleteEmployee(employeeActive)"
               ></v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
   </div>
</template>

<script setup>
   import DataTable from '~/components/admin/DataTable.vue';
   import EmployeeForm from '~/components/admin/EmployeeForm.vue';
   import {
      EMPLOYEE_SEARCH_FILTERS_FOR_ADMIN,
      EMPLOYEE_TABLE_HEADERS,
      EMPLOYEE_SORT_BY,
      SORT_TYPE,
   } from '~/utils/constants';
   import { convertTimestamp } from '~/utils/algorithms';
   import { onMounted, ref } from 'vue';
   import { useRouter } from 'vue-router';
   import { useLoginStore, useSearchFilterForUserStore } from '~/stores';
   import { mdiClose } from '@mdi/js';
   import EmployeeService from '~/services/EmployeeService';
   import SearchBar from '~/components/user/SearchBar.vue';

   const employees = ref(null);
   const employeesCount = ref(0);
   const employeeProperties = Object.keys(EMPLOYEE_TABLE_HEADERS);
   const tableHeaders = Object.values(EMPLOYEE_TABLE_HEADERS);

   const addFormDialog = ref(false);
   const updateFormDialog = ref(false);
   const requireLoginDialog = ref(false);

   const addForm = ref(null);
   const updateForm = ref(null);
   const submitAddEmployeeForm = () => {
      addForm.value.onSubmit();
   };
   const submitUpdateEmployeeForm = () => {
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

   const employeeActive = ref(null);
   const setActiveEmployee = async (employee) => {
      try {
         employeeActive.value = (
            await EmployeeService.getEmployee(employee._id)
         ).employee;
         updateFormDialog.value = true;
      } catch (error) {
         checkRequiredLogin(error);
      }
   };

   const convertEmployeeTimestamp = () => {
      employees.value?.map((employee) => {
         employee.createdAt = convertTimestamp(employee.createdAt);

         employee.updatedAt
            ? (employee.updatedAt = convertTimestamp(employee.updatedAt))
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

   const getEmployees = async () => {
      try {
         employees.value = (await EmployeeService.getEmployees()).employees;
         employeesCount.value = employees.value.length;
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

   const addEmployee = async (data) => {
      try {
         const { avatar, ...employeeData } = data;
         const idOfCreatedEmployee = (
            await EmployeeService.create(employeeData)
         ).createdEmployee._id;

         let formData = new FormData();
         if (avatar) {
            formData.append('avatar', avatar[0]);
            await EmployeeService.uploadEmployeeAvatar(
               idOfCreatedEmployee,
               formData
            );
         }
         addFormDialog.value = false;
         await refreshEmployee();
         snackbarColor.value = true;
         snackbarContent.value = 'Thêm thành công';
         snackbar.value = true;
         await refreshEmployee();
      } catch (error) {
         snackbarColor.value = false;
         snackbarContent.value = 'Người dùng đã tồn tại';
         snackbar.value = true;
         console.log(error);
         checkRequiredLogin(error);
      }
   };

   const updateEmployeeSuccess = ref(true);
   const updateEmployee = async (data) => {
      try {
         updateEmployeeSuccess.value = false;
         const { avatar, ...employeeData } = data;
         let formData = new FormData();
         if (avatar) {
            formData.append('avatar', avatar[0]);
            await EmployeeService.uploadEmployeeAvatar(data._id, formData);
         }
         updateFormDialog.value = false;
         await EmployeeService.updateEmployee(data._id, employeeData);
         updateEmployeeSuccess.value = true;
         snackbarContent.value = 'Cập nhật thành công';
         snackbarColor.value = true;
         snackbar.value = true;
         await refreshEmployee();
      } catch (error) {
         console.log(error);
         updateEmployeeSuccess.value = true;
         snackbarContent.value = 'Có lỗi xảy ra, cập nhật không thành công';
         snackbarColor.value = false;
         snackbar.value = true;
         checkRequiredLogin(error);
      }
   };

   const submitSearch = async () => {
      const { searchFilter } = useSearchFilterForUserStore();

      const result = (await EmployeeService.getEmployeesByFilter(searchFilter))
         .result;

      employees.value = result;
      employeesCount.value = result?.length;
      await convertEmployeeTimestamp();
   };

   const refreshEmployee = async () => {
      await getEmployees();
      await convertEmployeeTimestamp();
      const { setSearchFilter } = useSearchFilterForUserStore();
      setSearchFilter({
         searchText: '',
         filterSelected: EMPLOYEE_SEARCH_FILTERS_FOR_ADMIN[0],
      });
   };

   const confirmDeleteEmployeeDialog = ref(false);
   const confirmDeleteEmployee = (employee) => {
      confirmDeleteEmployeeDialog.value = true;
      employeeActive.value = employee;
   };
   const deleteEmployee = async (employee) => {
      try {
         confirmDeleteEmployeeDialog.value = false;
         await EmployeeService.deleteEmployee(employee._id);
         await refreshEmployee();
         confirmDeleteEmployee.value = false;
         snackbarColor.value = true;
         snackbarContent.value = 'Xoá thành công';
         snackbar.value = true;
      } catch (error) {
         console.log(error);
         snackbarContent.value = 'Xảy ra lỗi, xoá không thành công';
         snackbarColor.value = false;
         snackbar.value = true;
         checkRequiredLogin(error);
      }
   };
   onMounted(async () => {
      await refreshEmployee();
   });
</script>

<style scoped>
   @import url('~/assets/css/UserManagement.css');
</style>
