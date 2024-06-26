<template>
   <v-sheet
      class="bg-surface-light pa-3 pa-sm-6"
      rounded="lg"
   >
      <div
         class="d-flex pb-2 pb-sm-4 mb-3 mb-sm-6 border-b-sm"
         v-if="props.section"
      >
         <h1 class="text-uppercase font-weight-black heading">
            {{ props.section }}
         </h1>

         <v-spacer></v-spacer>

         <v-btn
            variant="text"
            color="primary"
            @click="directPage"
            >Xem tất cả</v-btn
         >
      </div>

      <v-row
         v-if="hasPagination"
         class="align-center mb-2"
      >
         <v-spacer></v-spacer>
         <p class="text-body">Số lượng hiển thị mỗi trang</p>
         <v-col
            cols="6"
            md="3"
         >
            <v-select
               v-if="hasPagination"
               v-model="documentsPerPageSelected"
               :items="documentsPerPage"
               label="Select"
               return-object
               single-line
               hide-details
               variant="outlined"
               color="primary"
               base-color="primary"
               density="compact"
            ></v-select>
         </v-col>
      </v-row>

      <div
         class="text-center mb-4"
         v-if="hasPagination"
      >
         <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
            :next-icon="mdiMenuRight"
            :prev-icon="mdiMenuLeft"
            density="comfortable"
         ></v-pagination>
      </div>

      <v-container
         fluid
         class="pa-0"
      >
         <v-row
            no-gutters
            class="ma-n1 ma-sm-n2"
         >
            <v-col
               cols="6"
               sm="4"
               md="3"
               lg="2"
               xl="2"
               class="pa-1 pa-sm-2"
               v-for="book in booksRendering"
            >
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
                     <p class="book-title title text-uppercase">
                        {{ book.title }}
                     </p>
                     <p class="subtitle py-1">{{ book.author }}</p>
                     <p class="title text-primary">{{ book.price }}</p>
                  </v-card-text>
               </v-card>
            </v-col>
         </v-row>
      </v-container>
   </v-sheet>
</template>

<script setup>
   import { mdiBook } from '@mdi/js';
   import { useRoute, useRouter } from 'vue-router';
   import { mdiMenuLeft, mdiMenuRight } from '@mdi/js';
   import { ref, watch } from 'vue';
   import { onMounted } from 'vue';

   const props = defineProps({
      section: String,
      books: Array,
      hasPagination: {
         type: Boolean,
         default: false,
      },
      documentsPerPage: Number,
   });

   const emits = defineEmits(['bookActive', 'directPage']);
   const directPage = () => {
      emits('directPage');
   };

   const router = useRouter();
   const route = useRoute();
   const pushPageToQuery = (page) => {
      router.replace({
         query: {
            ...route.query,
            page: page,
         },
      });
   };

   const documentsPerPage = [10, 25, 50];
   const currentPage = ref(1);
   const documentsPerPageSelected = ref(props.documentsPerPage);
   const documentsRange = ref();
   const totalPages = ref(1);
   const booksRendering = ref([]);
   const renderBooks = () => {
      totalPages.value = Math.ceil(
         props.books.length / documentsPerPageSelected.value
      );

      documentsRange.value = {
         startIdx: (currentPage.value - 1) * documentsPerPageSelected.value,
         endIdx: currentPage.value * documentsPerPageSelected.value - 1,
      };

      booksRendering.value = props.books.slice(
         documentsRange.value.startIdx,
         documentsRange.value.endIdx + 1
      );
   };

   watch([() => props.books, documentsPerPageSelected], () => {
      currentPage.value = 1;
   });

   watch([() => props.books, currentPage, documentsPerPageSelected], () => {
      renderBooks();
   });

   watch(currentPage, () => {
      pushPageToQuery(currentPage.value);
   });

   const goToBookDetailsPage = (book) => {
      router.push({
         name: 'bookDetailsPage',
         params: {
            slug: book.slug,
            id: book._id,
         },
      });
   };

   onMounted(() => {
      renderBooks();
   });
</script>

<style scoped>
   @import '~/assets/css/BookList.css';
</style>
