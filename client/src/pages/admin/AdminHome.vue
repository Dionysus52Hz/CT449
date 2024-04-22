<template>
   <v-layout>
      <v-app-bar
         color="primary"
         prominent
         style="position: fixed"
      >
         <a class="ms-4 me-2">
            <v-icon
               :icon="mdiVuejs"
               color="white"
            ></v-icon>
         </a>
         <v-app-bar-nav-icon
            variant="text"
            @click.stop="drawerIsOpen = !drawerIsOpen"
         ></v-app-bar-nav-icon>

         <v-spacer></v-spacer>
         <v-btn>
            <v-icon :icon="mdiHome"></v-icon>
         </v-btn>
      </v-app-bar>

      <v-navigation-drawer
         v-model="drawerIsOpen"
         location="left"
         style="position: fixed"
      >
         <v-list
            class="pa-3"
            density="comfortable"
            mandatory
         >
            <v-list-item
               v-for="(item, index) in items"
               :key="index"
               :value="item"
               color="primary"
               @click="item.direct"
               rounded="lg"
            >
               <template v-slot:prepend>
                  <v-icon :icon="item.icon"></v-icon>
               </template>

               <v-list-item-title
                  class="subheading"
                  v-text="item.text"
               ></v-list-item-title>
            </v-list-item>
         </v-list>

         <v-list v-if="currentEmployee">
            <v-list-item
               :prepend-avatar="
                  currentEmployee?.avatar
                     ? currentEmployee?.avatar
                     : 'https://cdn.vuetifyjs.com/images/john.png'
               "
               :title="currentEmployee?.fullName"
               :subtitle="currentEmployee?.position"
            >
               <template v-slot:append>
                  <v-btn
                     :icon="mdiMenuDown"
                     size="small"
                     variant="text"
                  ></v-btn>
               </template>
            </v-list-item>
         </v-list>

         <v-divider></v-divider>

         <v-list
            :lines="false"
            density="compact"
            nav
         >
            <!-- <v-list-item
               v-for="(item, i) in items"
               :key="i"
               :value="item"
               color="primary"
            >
               <template v-slot:prepend>
                  <v-icon :icon="item.icon"></v-icon>
               </template>

               <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item> -->
         </v-list>

         <v-sheet
            v-if="currentEmployee"
            class="px-4"
         >
            <v-btn
               block
               color="primary"
               flat
               @click="confirmLogoutDialog = true"
               >Đăng xuất</v-btn
            >
         </v-sheet>
      </v-navigation-drawer>

      <v-main>
         <router-view></router-view>
      </v-main>
   </v-layout>

   <v-dialog
      v-model="confirmLogoutDialog"
      max-width="600"
      persistent
      scrollable
   >
      <v-card>
         <v-card-item class="px-4 py-2">
            <v-card-title class="subheading font-weight-bold"
               >THÔNG BÁO</v-card-title
            >
         </v-card-item>
         <v-divider></v-divider>

         <v-card-text>
            <p class="text-center">Bạn muốn đăng xuất tài khoản này?</p>
         </v-card-text>

         <v-card-actions class="pa-4 pt-2">
            <v-spacer></v-spacer>

            <v-btn
               variant="tonal"
               @click="confirmLogoutDialog = false"
               class="me-2"
               >Huỷ</v-btn
            >
            <v-btn
               color="error"
               variant="flat"
               @click="(confirmLogoutDialog = false), logout(), goToHomePage()"
               >Đăng xuất</v-btn
            >
         </v-card-actions>
      </v-card>
   </v-dialog>
</template>

<script setup>
   import {
      mdiHome,
      mdiBookMultiple,
      mdiAccount,
      mdiVuejs,
      mdiBookshelf,
      mdiMenuDown,
   } from '@mdi/js';
   import { onActivated, onBeforeMount, ref } from 'vue';
   import { useDisplay } from 'vuetify/lib/framework.mjs';
   import { useRouter } from 'vue-router';
   import EmployeeService from '~/services/EmployeeService';
   import { useLoginStore } from '~/stores';
   import { setAccessToken } from '~/utils/accessToken';

   const { mobile } = useDisplay();
   const drawerIsOpen = ref(!mobile.value);
   const confirmLogoutDialog = ref(false);

   const router = useRouter();
   const goToHomePage = () => {
      router.push({ name: 'userHomePage' });
   };

   const items = [
      {
         text: 'Tổng quan',
         icon: mdiHome,
         direct: () => {
            router.push({ name: 'adminOverviewPage' });
         },
      },
      {
         text: 'Quản lí sách',
         icon: mdiBookMultiple,
         direct: () => {
            router.push({ name: 'adminBookManagementPage' });
         },
      },
      {
         text: 'Quản lí độc giả',
         icon: mdiAccount,
         direct: () => {
            router.push({ name: 'adminUserManagementPage' });
         },
      },
      {
         text: 'Quản lí mượn sách',
         icon: mdiBookshelf,
         direct: () => {
            router.push({ name: 'adminBorrowingManagementPage' });
         },
      },

      {
         text: 'Quản lí nhân viên',
         icon: mdiAccount,
         direct: () => {
            router.push({ name: 'adminUserManagementPage' });
         },
      },
   ];
   const currentEmployee = ref(null);
   const getCurrentEmployee = async () => {
      try {
         currentEmployee.value = (
            await EmployeeService.getCurrent()
         ).employeeData;
      } catch (error) {
         console.log(error);
      }
   };

   const loginStore = useLoginStore();
   const logout = async () => {
      try {
         await EmployeeService.logout();
         currentEmployee.value = null;
         loginStore.setLoginState({
            isLoggedIn: false,
            owner: null,
            role: null,
         });
         setAccessToken(null);
      } catch (error) {
         console.log(error);
      }
   };

   onBeforeMount(async () => {
      await getCurrentEmployee();
   });

   onActivated(async () => {
      await getCurrentEmployee();
   });
</script>

<style scoped>
   @import '~/assets/css/AdminHome.css';
</style>
