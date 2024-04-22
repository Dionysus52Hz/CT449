<template>
   <v-container class="page">
      <v-row>
         <v-col
            cols="12"
            lg="6"
            class="pa-1 pa-sm-4 pe-lg-3"
         >
            <v-card
               elevation="0"
               rounded="lg"
               color="surface-light"
               class="px-3 px-sm-4 px-md-6 pb-0"
            >
               <v-card-item
                  class="heading px-2 ps-0 py-4 border-b"
                  :prepend-icon="mdiClockOutline"
               >
                  <v-card-title class="heading text-uppercase font-weight-bold"
                     >Lịch sử mượn sách</v-card-title
                  >
               </v-card-item>

               <div class="d-flex flex-column ga-3">
                  <p
                     class="text-center py-6"
                     v-if="borrowings?.length <= 0"
                  >
                     Lịch sử mượn sách trống
                  </p>

                  <v-list
                     v-if="borrowings?.length > 0"
                     class="bg-transparent pt-4"
                  >
                     <v-list-item
                        v-for="item in borrowings"
                        class="pa-0 mb-2 mb-sm-4"
                     >
                        <v-card
                           class="bg-surface"
                           elevation="0"
                           rounded="lg"
                        >
                           <div
                              class="d-flex px-4 py-3 align-center border-b ga-1"
                           >
                              <div class="d-flex align-center">
                                 <div class="d-flex flex-column">
                                    <span class="title font-weight-bold"
                                       >Ngày mượn:
                                       {{
                                          convertTimestamp(item.borrowedDate)
                                       }}</span
                                    >

                                    <span
                                       v-if="item.returnedDate"
                                       class="title font-weight-bold"
                                       >Ngày trả:
                                       {{
                                          convertTimestamp(item?.returnedDate)
                                       }}</span
                                    >
                                 </div>
                              </div>

                              <v-spacer></v-spacer>

                              <v-btn
                                 v-if="item.state === 'pending'"
                                 color="primary"
                                 :prepend-icon="mdiClockOutline"
                                 variant="tonal"
                                 :ripple="false"
                                 size="small"
                                 >Chờ duyệt</v-btn
                              >

                              <v-btn
                                 v-if="item.state === 'approved'"
                                 color="success"
                                 :prepend-icon="mdiCheck"
                                 variant="tonal"
                                 :ripple="false"
                                 size="small"
                                 >Đã duyệt</v-btn
                              >

                              <v-btn
                                 v-if="item.state === 'returned'"
                                 color="success"
                                 :prepend-icon="mdiCheck"
                                 variant="tonal"
                                 :ripple="false"
                                 size="small"
                                 >Đã trả sách</v-btn
                              >
                           </div>
                           <v-card-text
                              class="d-flex align-center pa-2 pa-sm-4"
                           >
                              <v-img
                                 :width="120"
                                 :max-width="120"
                                 :aspect-ratio="3 / 4"
                                 rounded
                                 :src="
                                    item?.bookData?.thumbnail
                                       ? item?.bookData?.thumbnail
                                       : '/src/assets/images/bookAlterThumbnail.png'
                                 "
                                 cover
                                 color="indigo-lighten-4"
                              ></v-img>

                              <div
                                 class="book-item-details font-weight-regular ps-2 ps-sm-4 ga-1 ga-sm-2"
                              >
                                 <p class="title text-uppercase">
                                    {{ item?.bookData?.title }}
                                 </p>
                                 <p class="subtitle">
                                    Tác giả: {{ item?.bookData?.author }}
                                 </p>
                                 <p class="subtitle">
                                    Đơn giá:
                                    {{ convertCurrency(item?.bookData?.price) }}
                                 </p>
                                 <p class="subtitle">
                                    Nhà xuất bản:
                                    {{
                                       item?.bookData?.publisher.publisherName
                                    }}
                                 </p>
                                 <p class="subtitle">
                                    Năm xuất bản:
                                    {{ item?.bookData?.publishedYear }}
                                 </p>
                              </div>
                           </v-card-text>
                        </v-card>
                     </v-list-item>
                  </v-list>
               </div>
            </v-card>
         </v-col>

         <v-col
            cols="12"
            lg="6"
            class="pa-1 pa-sm-4 ps-lg-3"
         >
            <v-card
               elevation="0"
               rounded="lg"
               color="surface-light"
               class=""
            >
               <v-card-item
                  class="heading pa-3 px-sm-4 px-md-6 py-sm-4 border-b"
                  :prepend-icon="mdiBookHeartOutline"
               >
                  <v-card-title class="heading font-weight-bold text-uppercase"
                     >Sách yêu thích</v-card-title
                  >
               </v-card-item>

               <p
                  class="text-center py-6"
                  v-if="favoriteBook?.length <= 0"
               >
                  Danh sách yêu thích trống
               </p>

               <v-container
                  fluid
                  class="pa-2 pa-sm-2 pa-md-4"
               >
                  <v-row no-gutters>
                     <v-col
                        cols="6"
                        sm="4"
                        md="3"
                        lg="4"
                        class="pa-1 pa-sm-2"
                        style="position: relative"
                        v-for="book in favoriteBook"
                     >
                        <v-btn
                           :icon="mdiClose"
                           style="
                              position: absolute;
                              top: 0;
                              right: 0;
                              z-index: 100;
                           "
                           size="x-small"
                           color="error"
                           @click="
                              (confirmDeleteBookDialog = true),
                                 setActiveBook(book)
                           "
                        ></v-btn>
                        <v-card
                           @click="goToBookDetailsPage(book)"
                           rounded="lg"
                           elevation="0"
                           class="pa-2 pa-sm-3 h-100"
                        >
                           <v-img
                              :src="
                                 book.thumbnail
                                    ? book.thumbnail
                                    : '/src/assets/images/bookAlterThumbnail.png'
                              "
                              contain
                              :aspect-ratio="0.75"
                              color="surface-variant"
                              rounded
                           ></v-img>

                           <v-card-text class="text-center px-0 pb-0">
                              <p
                                 class="book-title subtitle font-weight-bold text-uppercase"
                              >
                                 {{ book.title }}
                              </p>
                              <p class="subtitle py-1">{{ book.author }}</p>
                              <p class="title text-primary">
                                 {{ convertCurrency(book.price) }}
                              </p>
                           </v-card-text>
                        </v-card>
                     </v-col>
                  </v-row>
               </v-container>
            </v-card>
         </v-col>
      </v-row>
   </v-container>

   <v-dialog
      v-model="confirmDeleteBookDialog"
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
            <p class="text-center">
               Bạn muốn xoá sách này khỏi danh sách yêu thích?
            </p>
         </v-card-text>

         <v-card-actions class="pa-4 pt-2">
            <v-spacer></v-spacer>

            <v-btn
               variant="tonal"
               @click="confirmLogoutDialog = false"
               >Quay lại</v-btn
            >
            <v-btn
               color="error"
               variant="flat"
               @click="(confirmDeleteBookDialog = false), deleteFavoriteBook()"
               >Xoá</v-btn
            >
         </v-card-actions>
      </v-card>
   </v-dialog>

   <v-snackbar
      v-model="snackbar"
      multi-line
      timeout="2500"
      close-on-back
      position="fixed"
      :color="deleteSuccess ? 'success' : 'danger'"
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
</template>

<script setup>
   import { onActivated, onBeforeMount, ref } from 'vue';
   import { useCurrentPageStore, useLoginStore } from '~/stores';
   import UserService from '~/services/UserService';
   import { storeToRefs } from 'pinia';
   import {
      mdiClockOutline,
      mdiCheck,
      mdiBookHeartOutline,
      mdiClose,
   } from '@mdi/js';
   import { convertTimestamp, convertCurrency } from '~/utils/algorithms';
   import BookService from '~/services/BookService';

   const currentPageStore = useCurrentPageStore();
   const requireLoginDialog = ref(false);
   const loginStore = useLoginStore();
   const { loginState } = storeToRefs(loginStore);
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
   const borrowings = ref(null);
   const getBorrowings = async () => {
      try {
         await getCurrentUser();
         borrowings.value = currentUser.value.borrowedBook;
         console.log(borrowings.value);
         borrowings.value.map(async (item) => {
            item['bookData'] = (await BookService.getBook(item.bookId)).result;
         });
      } catch (error) {
         console.log(error);
         requireLoginDialog.value = true;
      }
   };

   const favoriteBook = ref([]);
   const getFavoriteBooks = async () => {
      try {
         await getCurrentUser();
         console.log(currentUser.value);
         favoriteBook.value = currentUser.value.favoriteBook;
         console.log(favoriteBook.value);
      } catch (error) {
         console.log(error);
      }
   };

   const snackbar = ref(false);
   const snackbarContent = ref('');
   const deleteSuccess = ref(false);
   const confirmDeleteBookDialog = ref(false);
   const activeBook = ref(null);
   const setActiveBook = async (book) => {
      try {
         activeBook.value = book;
         console.log(activeBook.value);
      } catch (error) {
         console.log(error);
      }
   };
   const deleteFavoriteBook = async () => {
      try {
         const result = (await BookService.unlikeBook(activeBook.value._id))
            .result;
         if (result) {
            deleteSuccess.value = true;
            snackbarContent.value = 'Xoá khỏi danh sách yêu thích thành công';
            snackbar.value = true;
         }
         await getFavoriteBooks();
      } catch (error) {
         console.log(error);
         const errorResponse = error.response;
         if (
            errorResponse.data?.message ===
            'Error: This book is already unliked'
         ) {
            deleteSuccess.value = false;
            snackbarContent.value = 'Không tồn tại trong danh sách yêu thích';
            snackbar.value = true;
         } else {
            deleteSuccess.value = false;
            snackbarContent.value =
               'Có lỗi xảy ra, xoá khỏi danh sách yêu thích không thành công';
            snackbar.value = true;
         }
      }
   };

   onBeforeMount(async () => {
      currentPageStore.setCurrentPage('library');
      await getBorrowings();
      await getFavoriteBooks();
   });

   onActivated(async () => {
      currentPageStore.setCurrentPage('library');
      await getBorrowings();
      await getFavoriteBooks();
   });
</script>

<style scoped>
   @import url('~/assets/css/MyLibrary.css');
</style>
