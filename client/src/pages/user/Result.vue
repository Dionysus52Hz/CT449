<template>
   <v-container class="page">
      <v-row>
         <v-col
            cols="12"
            class="pa-1 pa-sm-4 pb-sm-1"
         >
            <v-card
               rounded="lg"
               color="background"
               class="search-tab bg-surface-light mb-2"
               elevation="0"
            >
               <v-tabs
                  v-model="searchTab"
                  color="primary"
               >
                  <v-tab
                     value="basic-search"
                     @click="goToBasicSearch"
                     >Tìm kiếm cơ bản</v-tab
                  >
                  <v-tab
                     value="advanced-search"
                     @click="goToAdvancedSearch"
                     >Tìm kiếm nâng cao</v-tab
                  >
               </v-tabs>

               <v-window
                  v-model="searchTab"
                  class="border-primary border-0 border-dashed border-t-sm"
               >
                  <v-window-item value="basic-search">
                     <v-container
                        fluid
                        class="pa-2 pa-sm-4"
                     >
                        <search-bar
                           :filters="SEARCH_FILTERS_FOR_USER"
                           @submit-search="submitBasicSearch"
                        ></search-bar>
                     </v-container>
                  </v-window-item>
                  <v-window-item value="advanced-search">
                     <advanced-search
                        @submit-search="submitAdvancedSearch"
                     ></advanced-search>
                  </v-window-item>
               </v-window>
            </v-card>
         </v-col>

         <v-col
            cols="12"
            class="pa-1 pa-sm-4"
         >
            <book-list
               :has-pagination="true"
               :section="searchFilter.searchText"
               :books="books"
               @book-active="getBookActive"
            >
               <template v-slot:result-heading>
                  <h2
                     class="heading text-center font-weight-black justify-center pt-1"
                  >
                     KẾT QUẢ TÌM KIẾM
                     {{ searchTab === 'basic-search' ? 'CHO TỪ KHOÁ:' : '' }}
                     {{ useRoute().query.searchText }}
                  </h2>
               </template>
               <div
                  class="loading-circular bg-surface-light"
                  v-if="booksChange"
               >
                  <v-progress-circular
                     :size="70"
                     :width="7"
                     color="primary"
                     indeterminate
                  >
                  </v-progress-circular>
               </div>
            </book-list>
         </v-col>
      </v-row>
   </v-container>
</template>

<script setup>
   import BookService from '~/services/BookService';
   import SearchBar from '~/components/user/SearchBar.vue';
   import BookList from '~/components/user/BookList.vue';
   import AdvancedSearch from '~/components/user/AdvancedSearch.vue';
   import { SEARCH_FILTERS_FOR_USER } from '~/utils/constants';
   import { useSearchFilterForUserStore, useCurrentPageStore } from '~/stores';
   import { ref, onBeforeMount, onMounted, onActivated } from 'vue';
   import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';

   const currentPageStore = useCurrentPageStore();
   const searchFilterStore = useSearchFilterForUserStore();
   const searchFilter = searchFilterStore.searchFilter;

   const searchTab = ref(null);
   const booksChange = ref(true);
   const books = ref([]);
   const getBooksByFilter = async () => {
      try {
         booksChange.value = true;
         books.value = [];
         books.value = (
            await BookService.getBooksByFilter(searchFilter)
         ).result;
         booksChange.value = false;
      } catch (error) {
         console.log(error);
      }
   };

   const router = useRouter();
   const goToBasicSearch = () => {
      router.replace({
         params: { filter: 'keyword' },
         query: {
            searchText: '',
         },
      });
   };
   const goToAdvancedSearch = () => {
      router.replace({
         path: 'advanced-search',
      });
   };
   const changeRouteBasicSearch = () => {
      router.push({
         params: { filter: searchFilter.filterSelected.filter },
         query: {
            searchText: searchFilter.searchText,
         },
      });
   };

   const submitBasicSearch = () => {
      changeRouteBasicSearch();
   };
   const bookActive = ref(null);
   const BookDetailsRef = ref(null);
   const getBookActive = (book) => {
      bookActive.value = book;
      BookDetailsRef.value.openDialog();
   };

   onBeforeMount(() => {
      getBooksByFilter();
   });

   onBeforeRouteUpdate((to, from) => {
      const currentFilterSelected = SEARCH_FILTERS_FOR_USER.find(
         (filter) => filter.filter === to.params.filter
      );
      searchFilter.searchText = to.query.searchText;
      searchFilter.filterSelected = currentFilterSelected;

      if (to.params.filter === 'advanced-search') {
         books.value = [];
         searchTab.value = 'advanced-search';
      } else if (
         to.query.searchText !== from.query.searchText ||
         to.params.filter !== from.params.filter
      ) {
         searchTab.value = 'basic-search';
         getBooksByFilter();
      }
   });

   const getBooksByCombinationFilters = async (filters) => {
      try {
         booksChange.value = true;
         books.value = [];
         books.value = await BookService.getBooksByCombinationFilters(filters);
         booksChange.value = false;
      } catch (error) {
         console.log(error);
      }
   };

   const submitAdvancedSearch = (filters) => {
      getBooksByCombinationFilters(filters);
   };

   onMounted(() => {
      currentPageStore.setCurrentPage('result');
      const currentRouterParam = router.currentRoute.value.params.filter;
      if (currentRouterParam === 'advanced-search') {
         searchTab.value = currentRouterParam;
         console.log(searchTab.value);
      }
   });

   onActivated(() => {
      currentPageStore.setCurrentPage('result');
      const currentRouterParam = router.currentRoute.value.params.filter;
      if (currentRouterParam === 'advanced-search') {
         searchTab.value = currentRouterParam;
      }
   });
</script>

<style scoped>
   @import '~/assets/css/Result.css';
</style>
