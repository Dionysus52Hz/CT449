<template>
   <div>
      <v-app-bar
         prominent
         height="68"
         color="primary"
         style="position: fixed; max-width: 1320px; right: 0; margin: auto"
         :class="{
            'v-app-bar__large-screen': mdAndUp,
         }"
      >
         <!-- Tabs in large screen -->
         <template v-slot:prepend>
            <a class="ms-4 me-2">
               <v-icon :icon="mdiVuejs"></v-icon>
            </a>
            <v-tabs
               v-model="tab"
               align-tabs="center"
               class="d-none d-md-block"
            >
               <v-tab
                  v-for="(page, index) in pages.slice(0, 4)"
                  :value="index"
                  @click="page.direct"
                  >{{ page.text }}</v-tab
               >
            </v-tabs>
         </template>

         <template v-slot:append>
            <v-menu
               v-if="!smAndUp"
               :close-on-content-click="false"
               v-model="showSearchBar"
               location="bottom"
               transition="slide-y-transition"
               :width="450"
               :max-width="450"
            >
               <template v-slot:activator="{ props }">
                  <v-btn
                     v-bind="props"
                     :icon="mdiMagnify"
                     :ripple="false"
                  >
                  </v-btn>
               </template>

               <search-bar
                  @submit-search="submitSearch"
                  :filters="SEARCH_FILTERS_FOR_USER"
                  :rounded="'pill'"
               ></search-bar>
            </v-menu>

            <v-sheet
               v-if="currentPage !== 'result' && smAndUp"
               :width="mdAndDown ? 250 : 500"
               color="transparent"
               class="me-4"
            >
               <search-bar
                  @submit-search="submitSearch"
                  :filters="SEARCH_FILTERS_FOR_USER"
                  :rounded="'pill'"
               ></search-bar>
            </v-sheet>

            <v-btn
               v-if="!loginState.isLoggedIn"
               @click="goToSignUpPage"
               rounded
               variant="tonal"
               height="32"
               class="me-4 d-none d-md-flex"
               :append-icon="mdiChevronRight"
               >Đăng ký</v-btn
            >
            <v-btn
               v-if="!loginState.isLoggedIn"
               @click="goToLoginPage"
               rounded
               variant="tonal"
               height="32"
               class="me-4 d-none d-md-flex"
               :append-icon="mdiChevronRight"
               >Đăng nhập</v-btn
            >

            <v-app-bar-nav-icon
               variant="text"
               class="d-md-none"
               @click.stop="drawerIsOpen = !drawerIsOpen"
            ></v-app-bar-nav-icon>

            <v-app-bar-nav-icon
               v-if="loginState.isLoggedIn && currentUser"
               class="d-none d-md-block"
               variant="text"
               :icon="mdiAccount"
               @click.stop="showAccountInfo = !showAccountInfo"
            ></v-app-bar-nav-icon>
         </template>
      </v-app-bar>

      <v-navigation-drawer
         class="d-md-none"
         v-model="drawerIsOpen"
         location="right"
         temporary
      >
         <template v-slot:prepend>
            <v-card-item class="pa-4">
               <v-row>
                  <v-col class="menu-logo">
                     <v-icon :icon="mdiHome"></v-icon>
                  </v-col>

                  <v-spacer></v-spacer>

                  <v-col class="d-flex justify-end">
                     <v-icon
                        :icon="mdiClose"
                        @click.stop="drawerIsOpen = !drawerIsOpen"
                     ></v-icon>
                  </v-col>
               </v-row>
            </v-card-item>
            <v-divider></v-divider>
         </template>

         <v-card elevation="0">
            <v-list
               density="compact"
               mandatory
            >
               <v-list-item
                  v-for="(page, index) in pages"
                  :key="index"
                  :value="page.value"
                  @click="page.direct"
                  color="primary"
                  :active="currentPage === page.value ? true : false"
               >
                  <template v-slot:prepend>
                     <v-icon
                        :icon="page.icon"
                        color="primary"
                     ></v-icon>
                  </template>

                  <v-list-item-title
                     v-text="page.text"
                     class="text-uppercase"
                  ></v-list-item-title>
               </v-list-item>
            </v-list>

            <v-divider v-if="loginState.isLoggedIn"></v-divider>

            <v-list
               v-if="loginState.isLoggedIn && currentUser"
               density="compact"
               class="pa-4"
               mandatory
            >
               <v-list-item-title class="text-uppercase title"
                  >Tài khoản của tôi</v-list-item-title
               >

               <v-list-item
                  class="px-0"
                  :prepend-avatar="
                     currentUser?.avatar
                        ? currentUser?.avatar
                        : 'https://cdn.vuetifyjs.com/images/john.png'
                  "
               >
                  <v-list-item-title class="subtitle">{{
                     currentUser?.lastName
                  }}</v-list-item-title>

                  <v-list-item-subtitle class="subtitle">{{
                     currentUser?.email
                  }}</v-list-item-subtitle>
               </v-list-item>

               <v-list-item
                  value="borrowingHistory"
                  color="primary"
                  class="subtitle px-3"
                  rounded="lg"
                  :value="currentPage"
                  :active="currentPage === 'library' ? true : false"
                  @click="goToMyLibraryPage"
               >
                  <template v-slot:prepend>
                     <v-icon
                        :icon="mdiBookClock"
                        color="primary"
                     ></v-icon>
                  </template>

                  <v-list-item-title
                     class="subtitle"
                     v-text="'Lịch sử mượn sách'"
                  ></v-list-item-title>
               </v-list-item>

               <v-list-item
                  value="myAccount"
                  color="primary"
                  class="subtitle px-3"
                  rounded="lg"
                  @click="goToUserInfoPage"
                  :active="currentPage === 'user-info' ? true : false"
               >
                  <template v-slot:prepend>
                     <v-icon
                        :icon="mdiAccountCog"
                        color="primary"
                     ></v-icon>
                  </template>

                  <v-list-item-title
                     class="subtitle"
                     v-text="'Sửa thông tin cá nhân'"
                  ></v-list-item-title>
               </v-list-item>

               <v-list-item
                  value="myAccount"
                  color="primary"
                  class="subtitle px-3"
                  rounded="lg"
                  :active="currentPage === 'change-password' ? true : false"
               >
                  <template v-slot:prepend>
                     <v-icon
                        :icon="mdiAccountCog"
                        color="primary"
                     ></v-icon>
                  </template>

                  <v-list-item-title
                     class="subtitle"
                     v-text="'Đổi mật khẩu'"
                  ></v-list-item-title>
               </v-list-item>
            </v-list>
         </v-card>

         <template v-slot:append>
            <v-divider v-if="loginState.isLoggedIn"></v-divider>
            <v-card-actions class="flex-column align-center pa-4">
               <v-btn
                  v-if="!loginState.isLoggedIn"
                  @click="goToSignUpPage"
                  rounded="lg"
                  variant="tonal"
                  block
                  color="primary"
                  :append-icon="mdiChevronRight"
                  >Đăng ký</v-btn
               >

               <v-btn
                  v-if="!loginState.isLoggedIn"
                  @click="goToLoginPage"
                  rounded="lg"
                  variant="flat"
                  block
                  color="primary"
                  :append-icon="mdiChevronRight"
                  class="ma-0 mt-4"
                  >Đăng nhập</v-btn
               >

               <v-btn
                  v-if="loginState.isLoggedIn"
                  block
                  variant="flat"
                  color="primary"
                  :append-icon="mdiChevronRight"
                  @click="confirmLogoutDialog = true"
                  >Đăng xuất</v-btn
               >
            </v-card-actions>
         </template>
      </v-navigation-drawer>

      <v-navigation-drawer
         class="show-account-info"
         v-model="showAccountInfo"
         location="right"
         temporary
         :width="'auto'"
      >
         <template v-slot:prepend>
            <div class="pa-4 d-flex">
               <p class="title text-uppercase">Tài khoản của tôi</p>
               <v-spacer></v-spacer>
               <v-icon
                  :icon="mdiClose"
                  @click.stop="showAccountInfo = !showAccountInfo"
               ></v-icon>
            </div>
            <v-divider></v-divider>
         </template>

         <v-card elevation="0">
            <v-list
               v-if="loginState.isLoggedIn && currentUser"
               density="compact"
               class="pa-4"
            >
               <v-list-item
                  class="pa-0 pb-4"
                  :prepend-avatar="
                     currentUser?.avatar
                        ? currentUser?.avatar
                        : 'https://cdn.vuetifyjs.com/images/john.png'
                  "
               >
                  <v-list-item-title class="subtitle">{{
                     currentUser?.lastName
                  }}</v-list-item-title>

                  <v-list-item-subtitle class="subtitle">{{
                     currentUser?.email
                  }}</v-list-item-subtitle>
               </v-list-item>

               <v-list-item
                  value="borrowingHistory"
                  color="primary"
                  class="subtitle px-3"
                  rounded="lg"
                  :active="currentPage === 'library' ? true : false"
                  @click="goToMyLibraryPage"
               >
                  <template v-slot:prepend>
                     <v-icon
                        :icon="mdiBookClock"
                        color="primary"
                     ></v-icon>
                  </template>

                  <v-list-item-title
                     class="subtitle"
                     v-text="'Lịch sử mượn sách'"
                  ></v-list-item-title>
               </v-list-item>

               <v-list-item
                  value="myAccount"
                  color="primary"
                  class="subtitle px-3"
                  rounded="lg"
                  :active="currentPage === 'user-info' ? true : false"
                  @click="goToUserInfoPage"
               >
                  <template v-slot:prepend>
                     <v-icon
                        :icon="mdiAccountCog"
                        color="primary"
                     ></v-icon>
                  </template>

                  <v-list-item-title
                     class="subtitle"
                     v-text="'Sửa thông tin cá nhân'"
                  ></v-list-item-title>
               </v-list-item>

               <v-list-item
                  value="changePassword"
                  color="primary"
                  class="subtitle px-3"
                  rounded="lg"
                  :active="currentPage === 'change-password' ? true : false"
               >
                  <template v-slot:prepend>
                     <v-icon
                        :icon="mdiAccountCog"
                        color="primary"
                     ></v-icon>
                  </template>

                  <v-list-item-title
                     class="subtitle"
                     v-text="'Đổi mật khẩu'"
                  ></v-list-item-title>
               </v-list-item>
            </v-list>
         </v-card>

         <template v-slot:append>
            <v-divider v-if="loginState.isLoggedIn"></v-divider>
            <v-card-actions class="flex-column align-center pa-4">
               <v-btn
                  v-if="!loginState.isLoggedIn"
                  @click="goToSignUpPage"
                  rounded="lg"
                  variant="tonal"
                  block
                  color="primary"
                  :append-icon="mdiChevronRight"
                  >Đăng ký</v-btn
               >

               <v-btn
                  v-if="!loginState.isLoggedIn"
                  @click="goToLoginPage"
                  rounded="lg"
                  variant="flat"
                  block
                  color="primary"
                  :append-icon="mdiChevronRight"
                  class="ma-0 mt-4"
                  >Đăng nhập</v-btn
               >

               <v-btn
                  v-if="loginState.isLoggedIn"
                  block
                  variant="flat"
                  color="primary"
                  :append-icon="mdiChevronRight"
                  @click="confirmLogoutDialog = true"
                  >Đăng xuất</v-btn
               >
            </v-card-actions>
         </template>
      </v-navigation-drawer>

      <v-dialog
         v-model="requireLoginDialog"
         max-width="600"
         persistent
         scrollable
      >
         <v-card>
            <v-card-item class="px-4 py-2">
               <v-card-title class="subheading">THÔNG BÁO</v-card-title>
            </v-card-item>
            <v-divider></v-divider>

            <v-card-text>
               <p class="text-center">
                  Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại
               </p>
            </v-card-text>

            <v-card-actions class="pa-4 pt-2">
               <v-spacer></v-spacer>

               <v-btn
                  color="primary"
                  variant="tonal"
                  @click="(requireLoginDialog = false), logout()"
                  >Để sau</v-btn
               >
               <v-btn
                  color="primary"
                  variant="flat"
                  @click="
                     (requireLoginDialog = false), logout(), goToLoginPage()
                  "
                  >Đồng ý</v-btn
               >
            </v-card-actions>
         </v-card>
      </v-dialog>

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
                  @click="
                     (confirmLogoutDialog = false), logout(), goToHomePage()
                  "
                  >Đăng xuất</v-btn
               >
            </v-card-actions>
         </v-card>
      </v-dialog>
   </div>
</template>

<script setup>
   import {
      mdiHome,
      mdiBookMultiple,
      mdiVuejs,
      mdiBookshelf,
      mdiChevronRight,
      mdiClose,
      mdiMagnify,
      mdiBookClock,
      mdiAccountCog,
      mdiAccount,
   } from '@mdi/js';
   import SearchBar from '~/components/user/SearchBar.vue';
   import { SEARCH_FILTERS_FOR_USER } from '~/utils/constants';
   import { storeToRefs } from 'pinia';
   import { onActivated, onBeforeMount, onMounted, ref, watch } from 'vue';
   import { onBeforeRouteUpdate, useRouter } from 'vue-router';
   import { useDisplay } from 'vuetify/lib/framework.mjs';
   import {
      useCurrentPageStore,
      useLoginStore,
      useSearchFilterForUserStore,
   } from '~/stores';
   import UserService from '~/services/UserService';
   import { setAccessToken } from '~/utils/accessToken';

   const drawerIsOpen = ref(false);
   const showAccountInfo = ref(false);
   const tab = ref(null);
   const { mdAndUp, smAndUp, mdAndDown, smAndDown } = useDisplay();
   const router = useRouter();
   const emits = defineEmits(['reload']);
   const pages = [
      {
         text: 'Trang chủ',
         value: 'home',
         icon: mdiHome,
         direct: () => {
            router.push({ name: 'userHomePage' });
            window.scrollTo({
               top: 0,
               left: 0,
               behavior: 'smooth',
            });
            emits('reload');
         },
      },
      {
         text: 'Sách',
         value: 'categories',
         icon: mdiBookMultiple,
         direct: () => {
            router.push({
               name: 'bookCategoriesPage',
            });
            window.scrollTo({
               top: 0,
               left: 0,
               behavior: 'smooth',
            });
         },
      },

      // {
      //    text: 'Tác giả',
      //    value: 'authors',
      //    icon: mdiBookshelf,
      //    direct: () => {
      //       // router.push({ name: 'myLibraryPage' });
      //    },
      // },
   ];
   const goToHomePage = () => {
      router.push({ name: 'userHomePage' });
   };

   const goToSignUpPage = () => {
      router.push({ name: 'signUpPage' });
   };

   const goToLoginPage = () => {
      router.push({ name: 'loginPage' });
   };

   const goToMyLibraryPage = () => {
      router.push({ name: 'myLibraryPage' });
   };

   const goToUserInfoPage = () => {
      router.push({
         name: 'userInfoPage',
      });
   };
   const showSearchBar = ref(false);
   const searchFilterStore = useSearchFilterForUserStore();
   const { searchFilter } = storeToRefs(searchFilterStore);
   searchFilterStore.setSearchFilter({
      searchText: '',
      filterSelected: SEARCH_FILTERS_FOR_USER[0],
   });

   const goToResultPage = () => {
      router.push({
         name: 'resultPage',
         params: {
            filter: searchFilter.value.filterSelected.filter,
         },
         query: {
            searchText: searchFilter.value.searchText,
         },
      });
   };

   const submitSearch = () => {
      searchFilterStore.setSearchFilter(searchFilter.value);
      goToResultPage();
   };

   const currentPageStore = useCurrentPageStore();
   const { currentPage } = storeToRefs(currentPageStore);
   const loginStore = useLoginStore();
   const { loginState } = storeToRefs(loginStore);
   const requireLoginDialog = ref(false);
   const currentUser = ref(null);
   const getCurrentUser = async () => {
      try {
         if (loginState.value.isLoggedIn) {
            currentUser.value = (await UserService.getCurrent()).userData;
         }
      } catch (error) {
         console.log(error);
         requireLoginDialog.value = true;
      }
   };

   const confirmLogoutDialog = ref(false);
   const logout = async () => {
      try {
         await UserService.logout();
         setAccessToken(null);
         loginStore.setLoginState({
            isLoggedIn: false,
            owner: null,
            role: null,
         });
      } catch (error) {
         console.log(error);
         setAccessToken(null);
         loginStore.setLoginState({
            isLoggedIn: false,
            owner: null,
            role: null,
         });
      }
   };

   onBeforeRouteUpdate(async () => {
      await getCurrentUser();
   });

   onBeforeMount(async () => {
      await getCurrentUser();
   });
   onActivated(async () => {
      await getCurrentUser();
   });
</script>

<style scoped>
   @import '~/assets/css/UserHeader.css';
</style>
