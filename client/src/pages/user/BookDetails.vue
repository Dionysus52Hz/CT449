<template>
   <v-container
      class="page pa-md-6"
      fluid
      v-if="book"
   >
      <p class="heading pb-2 pb-md-4">THÔNG TIN CHI TIẾT</p>
      <v-row
         class="ma-0"
         style="position: relative"
      >
         <v-col
            cols="4"
            sm="3"
            md="2"
            class="pa-sm-4"
            style="position: absolute; top: 0; left: 0; z-index: 100"
         >
            <v-img
               :src="
                  book.thumbnail
                     ? book.thumbnail
                     : '/src/assets/images/bookAlterThumbnail.png'
               "
               :aspect-ratio="0.65"
               contain
               rounded="lg"
               color="indigo-lighten-4"
            >
            </v-img>

            <v-btn
               block
               stack
               size="x-small"
               class="mt-2 mt-sm-3 caption"
               height="28"
               variant="tonal"
               color="primary"
               @click="likeBook"
               >Yêu thích</v-btn
            >

            <v-btn
               block
               color="primary"
               size="x-small"
               class="mt-2 mt-sm-3 caption"
               height="28"
               @click="requestBorrowing"
               >Đăng ký mượn</v-btn
            >
         </v-col>

         <v-col
            style="position: relative"
            cols="12"
            class="pa-0"
         >
            <v-container
               fluid
               class="bg-indigo-darken-1 rounded-lg pa-0"
            >
               <v-row class="ma-0">
                  <v-col
                     cols="4"
                     sm="3"
                     md="2"
                  ></v-col>

                  <v-col class="px-2 pa-sm-4 px-sm-0">
                     <div class="">
                        <p class="title text-uppercase">{{ book.title }}</p>
                        <p class="caption my-2 my-sm-3">
                           Tác giả: {{ book.author }}
                        </p>
                     </div>
                  </v-col>
               </v-row>
            </v-container>
         </v-col>

         <v-col
            style="position: relative"
            cols="12"
            class="pa-0"
         >
            <v-card
               class="pa-0 d-flex justify-space-between"
               elevation="0"
            >
               <v-col
                  cols="4"
                  sm="3"
                  md="2"
               ></v-col>

               <v-col class="px-0 pt-0">
                  <v-row class="ma-0">
                     <v-col
                        cols="12"
                        sm="6"
                        class="px-2 px-sm-0"
                     >
                        <p class="title">Mô tả</p>
                        <p class="text-body">
                           Lorem ipsum, dolor sit amet consectetur adipisicing
                           elit. Nihil quasi numquam architecto vel officia quae
                           nostrum cumque doloribus tenetur eligendi magnam nam,
                           recusandae vero minus rem, consectetur molestiae
                           velit id?
                        </p>
                     </v-col>
                     <v-col
                        cols="12"
                        sm="6"
                        class="py-0 py-sm-4"
                     >
                        <v-row class="">
                           <v-col
                              cols="6"
                              class="pa-2"
                           >
                              <p class="title">Giá</p>
                              <p class="text-body">{{ book.price }}</p>
                           </v-col>
                           <v-col
                              cols="6"
                              class="pa-2"
                           >
                              <p class="title">Số quyển còn lại</p>
                              <p class="text-body">{{ book.stockLeft }}</p>
                           </v-col>
                           <v-col
                              cols="6"
                              class="pa-2"
                           >
                              <p class="title">Nhà xuất bản</p>
                              <p class="text-body">
                                 {{ book.publisher.publisherName }}
                              </p>
                           </v-col>
                           <v-col
                              cols="6"
                              class="pa-2"
                           >
                              <h6 class="title">Năm xuất bản</h6>
                              <p class="text-body">{{ book.publishedYear }}</p>
                           </v-col>
                        </v-row>
                     </v-col>
                  </v-row>
               </v-col>
            </v-card>
         </v-col>
      </v-row>

      <v-dialog
         v-model="requireLoginDialog"
         max-width="600"
         scrollable
      >
         <v-card>
            <v-card-item class="pa-4">
               <v-card-title>Yêu cầu đăng nhập</v-card-title>
            </v-card-item>
            <v-divider></v-divider>

            <v-card-text class="text-center">
               <p>Vui lòng đăng nhập để tiếp tục</p>
            </v-card-text>

            <v-card-actions class="pa-4">
               <v-spacer></v-spacer>
               <v-btn
                  color="primary"
                  text="Từ chối"
                  variant="tonal"
                  @click="requireLoginDialog = false"
               ></v-btn>
               <v-btn
                  color="primary"
                  text="Đăng nhập ngay"
                  variant="flat"
                  @click="requireLoginDialog = false"
                  :to="{
                     name: 'loginPage',
                  }"
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
         :color="requestSuccess ? 'success' : 'danger'"
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
   </v-container>
</template>

<script setup>
   import { mdiClose } from '@mdi/js';
   import BookService from '~/services/BookService';
   import UserService from '~/services/UserService';
   import BorrowingService from '~/services/BorrowingService';
   import { onActivated, onBeforeMount, onDeactivated, ref, watch } from 'vue';
   import { useRoute } from 'vue-router';
   import { useLoginStore } from '~/stores';
   import { storeToRefs } from 'pinia';

   const route = useRoute();
   const book = ref(null);
   const getBook = async () => {
      try {
         book.value = (await BookService.getBook(route.params.id)).result;
         console.log(book.value);
      } catch (error) {
         console.log(error);
      }
   };

   const requireLoginDialog = ref(false);
   const snackbar = ref(false);
   const snackbarContent = ref('');
   const loginStore = useLoginStore();
   const { loginState } = storeToRefs(loginStore);
   const getCurrentUser = async () => {
      try {
         if (loginState.value.isLoggedIn) {
            return (await UserService.getCurrent()).userData;
         }
      } catch (error) {
         console.log(error);
      }
   };
   const requestSuccess = ref(false);
   const requestBorrowing = async () => {
      try {
         if (!loginState.value.isLoggedIn) {
            requireLoginDialog.value = true;
            throw new Error('Required login');
         }
         const currentUser = await getCurrentUser();
         const requestData = {
            userId: currentUser._id,
            bookId: route.params.id,
         };

         const checkRequest = (
            await BorrowingService.checkBorrowing(requestData)
         ).result;

         if (!checkRequest) {
            await BorrowingService.create(requestData);
            snackbar.value = true;
            requestSuccess.value = true;
            snackbarContent.value = 'Đăng ký mượn sách thành công';
         } else {
            requestSuccess.value = false;
            snackbarContent.value =
               'Yêu cầu đăng ký mượn cho sách này đang được chờ duyệt';
            snackbar.value = true;
         }
      } catch (error) {
         requestSuccess.value = false;
         snackbar.value = true;
         snackbarContent.value =
            'Có lỗi không mong muốn, đăng ký mượn thất bại';
         console.log(error);
      }
   };

   const likeBook = async () => {
      try {
         if (!loginState.value.isLoggedIn) {
            requireLoginDialog.value = true;
            throw new Error('Required login');
         }

         const result = (await BookService.likeBook(route.params.id)).result;
         console.log(result);

         if (result) {
            snackbar.value = true;
            requestSuccess.value = true;
            snackbarContent.value = 'Thêm vào danh sách yêu thích thành công';
         }
      } catch (error) {
         const errorResponse = error.response;
         if (
            errorResponse?.data?.message === 'Error: This book is already liked'
         ) {
            requestSuccess.value = false;
            snackbarContent.value =
               'Quyển sách này đã có trong danh sách yêu thích';
            snackbar.value = true;
         } else {
            requestSuccess.value = false;
            snackbarContent.value =
               'Có lỗi xảy ra, thêm vào danh sách yêu thích không thành công';
            snackbar.value = true;
         }
      }
   };

   onBeforeMount(async () => {
      await getBook();
   });

   onActivated(async () => {
      await getBook();
   });

   onDeactivated(() => {
      book.value = null;
   });
</script>

<style scoped>
   p {
      font-size: 12px;
   }
</style>
