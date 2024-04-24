<template>
   <v-footer
      style="max-width: 1320px; margin: auto"
      color="primary"
      class="flex-column pa-0"
   >
      <v-row
         no-gutters=""
         class="w-100 justify-center pa-2 px-sm-6 py-sm-4"
      >
         <v-col
            cols="6"
            md="3"
            class="pa-2 pa-sm-4"
         >
            <v-sheet
               :height="40"
               rounded="lg"
               class="bg-surface-light"
            ></v-sheet>

            <p class="title text-center my-2">Read books change the world</p>

            <v-row class="justify-center">
               <v-btn
                  :icon="mdiFacebook"
                  variant="text"
                  size="small"
               ></v-btn>
               <v-btn
                  :icon="mdiYoutube"
                  variant="text"
                  size="small"
               ></v-btn>
               <v-btn
                  :icon="mdiInstagram"
                  variant="text"
                  size="small"
               ></v-btn>
            </v-row>
         </v-col>

         <v-col
            cols="12"
            md="9"
            class="pa-2 align-center d-flex"
         >
            <v-row>
               <v-col
                  cols="6"
                  sm="3"
               >
                  <p class="title">Trang</p>
                  <p class="text-body">Về chúng tôi</p>
                  <p class="text-body">Điều khoản sử dụng</p>
                  <p class="text-body">Chính sách bảo mật</p>
               </v-col>

               <v-col
                  cols="6"
                  sm="3"
               >
                  <p class="title">Hỗ trợ</p>
                  <p class="text-body">Trung tâm trợ giúp</p>
                  <p class="text-body">FAQ</p>
                  <p class="text-body">Phản hồi</p>
               </v-col>

               <v-col
                  cols="6"
                  sm="3"
               >
                  <p class="title">Liên kết</p>
                  <p class="text-body">Đại học Cần Thơ</p>
                  <p class="text-body">Trường CNTT & TT</p>
                  <p class="text-body">Hệ thống quản lý</p>
                  <p class="text-body">Elearning</p>
               </v-col>

               <v-col
                  cols="6"
                  sm="3"
               >
                  <p class="title">Liên hệ</p>
                  <p class="text-body">ntp@gmail.com</p>
                  <p class="text-body">0123 456 789</p>
               </v-col>
            </v-row>
         </v-col>
      </v-row>

      <v-sheet
         class="w-100 pa-2"
         color="surface-light"
      >
         <p class="caption text-center">
            Copyright 2024 CICT. All rights reserved.
         </p>
      </v-sheet>
   </v-footer>
</template>

<script setup>
   import { mdiFacebook, mdiYoutube, mdiInstagram } from '@mdi/js';
</script>
