<template>
   <v-container fluid>
      <v-row>
         <v-col
            cols="12"
            lg="6"
            class="pa-1 pa-sm-4"
         >
            <v-sheet
               elevation="0"
               rounded="lg"
               color="surface-light"
               class="px-2 px-sm-4 pb-2 pb-sm-4"
            >
               <div class="d-flex align-center pa-2 pa-sm-4">
                  <!-- <v-icon
                     :icon="mdiClockOutline"
                     class="heading me-2"
                  ></v-icon> -->
                  <p class="font-weight-bold heading">
                     Yêu cầu đăng kí mượn sách
                  </p>
               </div>

               <div class="d-flex flex-column ga-3">
                  <p
                     class="text-center py-2"
                     v-if="borrowings?.length <= 0"
                  >
                     Không có yêu cầu mượn sách nào
                  </p>
                  <v-card
                     v-for="(item, i) in borrowings"
                     class="px-2 px-sm-4 mb-md-3"
                     :key="i"
                     rounded="lg"
                     elevation="0"
                  >
                     <div class="d-flex py-2 py-md-3 align-center border-b">
                        <div class="d-flex align-center">
                           <div class="d-flex flex-column">
                              <span class="title font-weight-bold"
                                 >Ngày mượn:
                                 {{ convertTimestamp(item.borrowedDate) }}</span
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

                     <v-card-text class="pa-0">
                        <v-row no-gutters>
                           <v-col
                              class="py-2 py-md-3 border-dashed border-0 border-b pe-sm-2"
                              cols="12"
                              sm="6"
                              md="4"
                           >
                              <div class="d-flex align-start ga-3">
                                 <v-img
                                    :width="75"
                                    :max-width="75"
                                    :aspect-ratio="0.65"
                                    rounded
                                    :src="
                                       item.bookId.thumbnail
                                          ? item.bookId.thumbnail
                                          : '/src/assets/images/bookAlterThumbnail.png'
                                    "
                                    cover
                                    color="indigo-lighten-4"
                                 ></v-img>

                                 <div
                                    class="d-flex flex-column justify-center ga-1"
                                 >
                                    <p class="book-title title text-uppercase">
                                       {{ item.bookId?.title }}
                                    </p>
                                    <p
                                       class="book-author text-medium-emphasis subtitle"
                                    >
                                       {{ item.bookId?.author }}
                                    </p>
                                 </div>
                              </div>
                           </v-col>

                           <v-col
                              cols="12"
                              sm="6"
                              md="4"
                              class="py-2 border-dashed border-0 border-b ps-sm-2"
                           >
                              <div
                                 class="d-flex ga-3 align-start overflow-hidden"
                              >
                                 <v-avatar :size="75">
                                    <v-img
                                       :src="
                                          item.userId.avatar
                                             ? item.userId.avatar
                                             : '/src/assets/images/bookAlterThumbnail.png'
                                       "
                                       color="indigo-lighten-4"
                                    ></v-img>
                                 </v-avatar>

                                 <div class="d-flex flex-column ga-1">
                                    <p class="username title">
                                       {{
                                          item.userId?.lastName +
                                          ' ' +
                                          item.userId?.firstName
                                       }}
                                    </p>
                                    <p
                                       class="email text-medium-emphasis subtitle"
                                    >
                                       {{ item.userId?.email }}
                                    </p>
                                    <p
                                       class="phone text-medium-emphasis subtitle"
                                    >
                                       {{ item.userId?.phone }}
                                    </p>
                                 </div>
                              </div>
                           </v-col>

                           <v-col
                              cols="12"
                              md="2"
                              class="d-flex flex-center py-2 py-sm-4 ps-md-3"
                           >
                              <div
                                 class="d-flex flex-md-column flex-fill ga-2 ga-sm-4"
                              >
                                 <v-btn
                                    v-if="item?.state === 'pending'"
                                    color="primary"
                                    @click="approveRequestBorrowing(item)"
                                    size="small"
                                    class="flex-1-1"
                                    >Duyệt</v-btn
                                 >
                                 <v-btn
                                    v-if="item?.state === 'pending'"
                                    color="danger"
                                    @click="denyRequestBorrowing(item)"
                                    size="small"
                                    class="flex-fill"
                                    >Từ chối</v-btn
                                 >

                                 <v-btn
                                    v-if="item?.state !== 'pending'"
                                    :disabled="item?.state === 'returned'"
                                    color="primary"
                                    @click="returnBook(item)"
                                    size="small"
                                    class="flex-fill"
                                    >Trả sách</v-btn
                                 >
                              </div>
                           </v-col>
                        </v-row>
                     </v-card-text>
                  </v-card>
               </div>
            </v-sheet>
         </v-col>

         <v-col
            cols="12"
            lg="6"
         >
            <v-card>
               <v-card-item :prepend-icon="mdiClockOutline">
                  <v-card-title>Quá hạn trả tài liệu</v-card-title>
               </v-card-item>
            </v-card>
         </v-col>
      </v-row>
   </v-container>

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
               @click="(requireLoginDialog = false), logout(), goToLoginPage()"
            ></v-btn>
         </v-card-actions>
      </v-card>
   </v-dialog>
</template>

<script setup>
   import BorrowingService from '~/services/BorrowingService';
   import { onActivated, onBeforeMount, ref, watch } from 'vue';
   import {
      mdiClockOutline,
      mdiBookClockOutline,
      mdiCheck,
      mdiClose,
   } from '@mdi/js';
   import { useDisplay } from 'vuetify/lib/framework.mjs';
   import { convertTimestamp } from '~/utils/algorithms';

   const requireLoginDialog = ref(false);
   const checkRequiredLogin = (error) => {
      const errorResponse = error.response.data;
      if (
         errorResponse.message === 'TokenExpiredError: jwt expired' &&
         errorResponse.statusCode === 400
      ) {
         requireLoginDialog.value = true;
      }
   };

   const borrowings = ref(null);
   const getBorrowings = async () => {
      try {
         borrowings.value = (await BorrowingService.getBorrowings()).borrowings;
         console.log(borrowings.value);
      } catch (error) {
         console.log(error);
         checkRequiredLogin(error);
      }
   };

   onBeforeMount(async () => {
      await getBorrowings();
   });

   onActivated(async () => {
      await getBorrowings();
   });
</script>

<style scoped>
   @import url('~/assets/css/BorrowingManagement.css');
</style>
