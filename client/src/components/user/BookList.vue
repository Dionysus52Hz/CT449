<template>
   <v-sheet
      class="bg-surface-light px-3"
      rounded="lg"
   >
      <v-card
         fluid
         class="border-b py-4"
         elevation="0"
         color="surface-light"
         rounded="0"
      >
         <v-row
            no-gutters
            class="sort-bar justify-md-space-between"
         >
            <v-col
               cols="6"
               md="auto"
               class="d-flex align-center title"
            >
               <p>Sắp xếp theo</p>
            </v-col>

            <v-col
               cols="6"
               md="auto"
            >
               <v-select
                  v-model="sortBySelected"
                  :items="
                     BOOK_SORT_BY.filter(
                        (e) =>
                           e.value !== '_id' &&
                           e.value !== 'stock' &&
                           e.value !== 'createdAt' &&
                           e.value !== 'updatedAt'
                     )
                  "
                  item-title="text"
                  item-value="value"
                  :hide-details="true"
                  variant="outlined"
                  color="primary"
                  base-color="primary"
                  density="compact"
               ></v-select>
            </v-col>

            <v-col
               cols="6"
               md="auto"
               class="d-flex align-center title"
            >
               <p>Thứ tự</p>
            </v-col>

            <v-col
               cols="6"
               md="auto"
               class="py-2 py-md-0"
            >
               <v-select
                  v-model="sortTypeSelected"
                  :items="SORT_TYPE"
                  item-title="text"
                  item-value="value"
                  :hide-details="true"
                  variant="outlined"
                  color="primary"
                  base-color="primary"
                  density="compact"
               ></v-select>
            </v-col>

            <v-col
               cols="6"
               md="auto"
               class="d-flex align-center title"
            >
               <p>Số lượng hiển thị mỗi trang</p>
            </v-col>

            <v-col
               cols="6"
               md="auto"
            >
               <v-select
                  v-if="hasPagination"
                  v-model="documentsPerPageSelected"
                  :items="documentsPerPage"
                  :hide-details="true"
                  variant="outlined"
                  color="primary"
                  base-color="primary"
                  density="compact"
               ></v-select>
            </v-col>
         </v-row>
      </v-card>

      <v-list class="bg-surface-light">
         <slot name="result-heading"></slot>
         <div
            class="text-center pa-1 pa-sm-4 mb-4"
            v-if="hasPagination && books && books.length > 0"
         >
            <v-pagination
               v-model="currentPage"
               :length="totalPages"
               :total-visible="5"
               :next-icon="mdiMenuRight"
               :prev-icon="mdiMenuLeft"
               density="comfortable"
               active-color="primary"
            ></v-pagination>
         </div>
         <div style="position: relative">
            <slot></slot>
            <v-list-item
               v-for="book in booksRendering"
               class="pa-0 mb-2 mb-sm-4"
            >
               <v-card
                  class="bg-surface"
                  @click="goToBookDetailsPage(book)"
                  elevation="0"
               >
                  <v-card-text class="d-flex align-center pa-2 pa-sm-4">
                     <v-img
                        :width="120"
                        :max-width="120"
                        :aspect-ratio="3 / 4"
                        rounded
                        :src="
                           book.thumbnail
                              ? book.thumbnail
                              : '/src/assets/images/bookAlterThumbnail.png'
                        "
                        cover
                        color="indigo-lighten-4"
                     ></v-img>

                     <div
                        class="book-item-details font-weight-regular ps-2 ps-sm-4 ga-1 ga-md-2"
                     >
                        <p class="title text-uppercase">
                           {{ book.title }}
                        </p>
                        <p class="subtitle">Tác giả: {{ book.author }}</p>
                        <p class="subtitle">Đơn giá: {{ book.price }}</p>
                        <p class="subtitle">
                           Số quyển còn lại: {{ book.stockLeft }}
                        </p>
                        <p class="subtitle">
                           Nhà xuất bản: {{ book.publisher.publisherName }}
                        </p>
                        <p class="subtitle">
                           Năm xuất bản: {{ book.publishedYear }}
                        </p>
                     </div>
                  </v-card-text>
               </v-card>
            </v-list-item>

            <v-list-item
               v-if="books && books.length === 0"
               class="text-center"
               min-height="100"
            >
               <p>Không tìm thấy kết quả phù hợp</p>
            </v-list-item>
         </div>

         <div
            class="text-center pa-4"
            v-if="hasPagination"
         >
            <v-pagination
               v-model="currentPage"
               :length="totalPages"
               :total-visible="5"
               :next-icon="mdiMenuRight"
               :prev-icon="mdiMenuLeft"
               density="comfortable"
               active-color="primary"
            ></v-pagination>
         </div>
      </v-list>
   </v-sheet>
</template>

<script setup>
   import { mdiBook } from '@mdi/js';
   import { useRoute, useRouter } from 'vue-router';
   import { mdiMenuLeft, mdiMenuRight } from '@mdi/js';
   import { ref, watch } from 'vue';
   import { onMounted } from 'vue';
   import { BOOK_SORT_BY, SORT_TYPE } from '~/utils/constants';
   import { sortAscending, sortDescending } from '~/utils/sort';

   const props = defineProps({
      section: String,
      books: Array,
      hasPagination: {
         type: Boolean,
         default: false,
      },
   });
   const router = useRouter();

   const sortBySelected = ref(BOOK_SORT_BY[0].value);
   const sortTypeSelected = ref(SORT_TYPE[0].value);
   const sortBooks = () => {
      if (sortTypeSelected.value === 1) {
         sortAscending(props.books, sortBySelected.value);
      } else sortDescending(props.books, sortBySelected.value);
      renderBooks();
   };

   watch([sortBySelected, sortTypeSelected], () => {
      sortBooks();
   });

   const documentsPerPage = [10, 25, 50];
   const currentPage = ref(1);
   const documentsPerPageSelected = ref(documentsPerPage[0]);
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

   watch(
      () => props.books,
      () => {
         console.log(123);
         sortBooks();
      }
   );

   watch([() => props.books, documentsPerPageSelected], () => {
      currentPage.value = 1;
   });

   watch([() => props.books, currentPage, documentsPerPageSelected], () => {
      renderBooks();
      sortBooks();
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
