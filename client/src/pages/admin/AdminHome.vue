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
               @click="logout"
               :to="{
                  name: 'userHomePage',
               }"
               >Đăng xuất</v-btn
            >
         </v-sheet>
      </v-navigation-drawer>

      <v-main>
         <router-view></router-view>
      </v-main>
   </v-layout>
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
   import AdminOverview from '~/pages/admin/Overview.vue';

   const { mobile } = useDisplay();
   const drawerIsOpen = ref(!mobile.value);

   const router = useRouter();

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
         text: 'Quản lí mượn tài liệu',
         icon: mdiBookshelf,
         direct: () => {
            router.push({ name: 'adminBorrowingManagementPage' });
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
