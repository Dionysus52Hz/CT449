<template>
   <!-- <v-app-bar
      style="
         max-width: 1320px;
         position: fixed;
         right: 0;
         margin-left: auto;
         margin-right: auto;
      "
      flat
      height="68"
   >
   </v-app-bar> -->
   <div
      class="loading-circular"
      v-if="!books"
   >
      <v-progress-circular
         :size="70"
         :width="7"
         color="primary"
         indeterminate
      ></v-progress-circular>
   </div>

   <v-container class="page">
      <v-row class="justify-center">
         <v-col
            cols="12"
            class="pa-1 pa-sm-3"
         >
            <book-grid
               :books="books"
               :has-pagination="true"
               :documents-per-page="10"
               :section="'Tất cả sách'"
            ></book-grid>
         </v-col>
      </v-row>
   </v-container>
</template>

<script setup>
   import BookService from '~/services/BookService';
   import BookGrid from '~/components/user/BookGrid.vue';
   import BookDetails from '~/pages/user/BookDetails.vue';
   import { useCurrentPageStore } from '~/stores';
   import { ref, onBeforeMount, watch } from 'vue';
   import { onBeforeRouteLeave, useRouter } from 'vue-router';
   import { onBeforeUnmount } from 'vue';
   import { onDeactivated } from 'vue';
   import { onActivated } from 'vue';

   const currentPageStore = useCurrentPageStore();
   const books = ref([]);
   const getBooks = async () => {
      try {
         books.value = (await BookService.getBooks()).books;
      } catch (error) {
         console.log(error);
      }
   };

   onBeforeMount(async () => {
      await getBooks();
   });

   onActivated(async () => {
      await getBooks();
      currentPageStore.setCurrentPage('categories');
   });
</script>

<style scoped>
   @import '~/assets/css/BookCategories.css';
</style>
