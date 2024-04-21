<template>
   <v-container class="page">
      <v-row>
         <v-col
            cols="12"
            lg="6"
            class="pa-1 pa-sm-4"
         >
            <v-card
               elevation="0"
               rounded="lg"
               color="surface-light"
               class="px-2 px-sm-4 pb-0"
            >
               <!-- <div class="d-flex align-center pa-2 pa-sm-4">
                  <p class="font-weight-bold heading">Lịch sử mượn sách</p>
               </div> -->

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
                     class="text-center py-2"
                     v-if="borrowings?.length <= 0"
                  >
                     Lịch sử mượn sách trống
                  </p>
                  <v-list class="bg-transparent pt-4">
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
                                 variant="outlined"
                                 :ripple="false"
                                 size="small"
                                 >Chờ duyệt</v-btn
                              >

                              <v-btn
                                 v-if="item.state === 'approved'"
                                 color="success"
                                 :prepend-icon="mdiCheck"
                                 variant="outlined"
                                 :ripple="false"
                                 size="small"
                                 >Đã duyệt</v-btn
                              >

                              <v-btn
                                 v-if="item.state === 'returned'"
                                 color="success"
                                 :prepend-icon="mdiCheck"
                                 variant="outlined"
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
                                    Đơn giá: {{ item?.bookData?.price }}
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
            class="pa-1 pa-sm-4"
         >
            <v-card
               elevation="0"
               rounded="lg"
               color="surface-light"
               class="px-2 px-sm-4 pb-0"
            >
               <v-card-item
                  class="heading px-2 ps-0 py-4 border-b"
                  :prepend-icon="mdiBookHeartOutline"
               >
                  <v-card-title class="heading font-weight-bold text-uppercase"
                     >Sách yêu thích</v-card-title
                  >
               </v-card-item>

               <book-grid :books="[]"></book-grid>
            </v-card>
         </v-col>
      </v-row>
   </v-container>
</template>

<script setup>
   import { onActivated, onBeforeMount, ref } from 'vue';
   import { useCurrentPageStore, useLoginStore } from '~/stores';
   const currentPageStore = useCurrentPageStore();
   import UserService from '~/services/UserService';
   import { storeToRefs } from 'pinia';
   import { mdiClockOutline, mdiCheck, mdiBookHeartOutline } from '@mdi/js';
   import { convertTimestamp } from '~/utils/algorithms';
   import BookService from '~/services/BookService';
   import BookGrid from '~/components/user/BookGrid.vue';

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
         favoriteBook.value = currentUser.value.favoriteBook;
         console.log(favoriteBook.value);
      } catch (error) {
         console.log(error);
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
