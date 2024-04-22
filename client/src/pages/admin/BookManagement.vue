<template>
   <v-app-bar
      elevation="0"
      style="position: fixed"
   >
      <v-spacer></v-spacer>
      <v-btn
         class="px-2 px-sm-4"
         @click="refreshBook"
         size="small"
         >Làm mới dữ liệu</v-btn
      >

      <v-btn
         class="px-2 px-sm-4"
         size="small"
         @click="addFormDialog = true"
         >Thêm sách mới</v-btn
      >

      <v-spacer></v-spacer>
   </v-app-bar>

   <v-app-bar
      elevation="0"
      :height="84"
      style="position: fixed"
      class="bg-surface-light"
   >
      <div class="pa-4 w-100">
         <search-bar
            :filters="searchFilters"
            @submit-search="submitSearch"
         ></search-bar>
      </div>
   </v-app-bar>

   <div
      class="loading-circular"
      v-if="!books"
   >
      <v-progress-circular
         :size="70"
         :width="7"
         color="primary"
         indeterminate
         v-if="!books"
      ></v-progress-circular>
   </div>

   <data-table
      :sortBy="sortBy"
      :sortType="sortType"
      :items="books"
      :itemProperties="bookProperties.filter((prop) => prop !== 'slug')"
      :itemsCount="booksCount"
      :tableHeaders="tableHeaders"
      @itemActive="setActiveBook"
      @deleteItem="confirmDeleteBook"
      v-if="booksCount > 0"
   ></data-table>

   <p
      class="text-center subheading py-4"
      v-else
   >
      Không tìm thấy dữ liệu sách.
   </p>

   <div class="text-center pa-4">
      <v-dialog
         v-model="updateFormDialog"
         max-width="600"
         persistent
         scrollable
      >
         <v-card title="Sửa thông tin sách">
            <div
               v-if="!updateBookSuccess"
               class="loading-circular d-flex flex-column ga-4"
               style="
                  width: 100%;
                  height: 100%;
                  background-color: rgba(0, 0, 0, 0.3);
               "
            >
               <v-progress-circular
                  :size="70"
                  :width="7"
                  color="primary"
                  indeterminate
               ></v-progress-circular>
               <p class="subheading">Đang cập nhật</p>
            </div>
            <v-divider></v-divider>

            <v-card-text>
               <book-form
                  :book="bookActive"
                  @submitBook="updateBook"
                  ref="updateForm"
               ></book-form>
            </v-card-text>

            <v-card-actions class="px-6">
               <v-spacer></v-spacer>
               <v-btn
                  text="Huỷ bỏ"
                  variant="plain"
                  @click="updateFormDialog = false"
               ></v-btn>

               <v-btn
                  color="primary"
                  text="Lưu"
                  variant="flat"
                  @click="submitUpdateBookForm"
               ></v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>

      <v-dialog
         v-model="addFormDialog"
         max-width="600"
         persistent
         scrollable
      >
         <v-card title="Thêm sách mới">
            <div
               v-if="!createNewBookSuccess"
               class="loading-circular d-flex flex-column ga-4"
               style="
                  width: 100%;
                  height: 100%;
                  background-color: rgba(0, 0, 0, 0.3);
               "
            >
               <v-progress-circular
                  :size="70"
                  :width="7"
                  color="primary"
                  indeterminate
               ></v-progress-circular>
               <p class="subheading">Đang tạo sách mới...</p>
            </div>
            <v-divider></v-divider>

            <v-card-text>
               <book-form
                  :book="{}"
                  ref="addForm"
                  @submitBook="addBook"
               ></book-form>
            </v-card-text>

            <v-card-actions class="px-6">
               <v-spacer></v-spacer>
               <v-btn
                  text="Huỷ bỏ"
                  variant="plain"
                  @click="addFormDialog = false"
               ></v-btn>

               <v-btn
                  color="primary"
                  text="Lưu"
                  variant="flat"
                  @click="submitAddBookForm"
               ></v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
   </div>

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

   <v-dialog
      v-model="confirmDeleteBookDialog"
      max-width="600"
      persistent
      scrollable
   >
      <v-card title="THÔNG BÁO">
         <v-divider></v-divider>

         <v-card-text>
            <p>Xác nhận muốn xoá sách này?</p>
         </v-card-text>

         <v-card-actions class="pa-4">
            <v-spacer></v-spacer>

            <v-btn
               text="Huỷ bỏ"
               variant="tonal"
               @click="confirmDeleteBookDialog = false"
            ></v-btn>

            <v-btn
               color="danger"
               text="Đồng ý"
               variant="flat"
               @click="deleteBook(bookActive)"
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
      location="bottom right"
      :color="snackbarColor ? 'success' : 'danger'"
   >
      {{ snackbarContent }}

      <template v-slot:actions>
         <v-btn
            variant="text"
            @click="snackbar = false"
            :icon="icon.mdiClose"
         >
         </v-btn>
      </template>
   </v-snackbar>
</template>

<script>
   import BookService from '~/services/BookService';
   import DataTable from '~/components/admin/DataTable.vue';
   import BookForm from '~/components/admin/BookForm.vue';
   import {
      BOOK_SORT_BY,
      SORT_TYPE,
      BOOK_TABLE_HEADERS,
      BOOK_SEARCH_FILTERS_FOR_ADMIN,
   } from '~/utils/constants';
   import { convertTimestamp } from '~/utils/algorithms';
   import { checkRequiredLogin } from '~/middlewares/requireReLogin';
   import { useRouter } from 'vue-router';
   import { mdiClose } from '@mdi/js';
   import EmployeeService from '~/services/EmployeeService';
   import SearchBar from '~/components/user/SearchBar.vue';
   import { useSearchFilterForUserStore } from '~/stores';

   export default {
      components: {
         DataTable,
         BookForm,
         SearchBar,
      },
      data() {
         return {
            tableHeaders: [],
            books: null,
            booksCount: 0,
            bookProperties: [],
            bookActive: {},
            updateFormDialog: false,
            addFormDialog: false,
            sortBy: BOOK_SORT_BY,
            sortType: SORT_TYPE,
            requireLoginDialog: false,
            router: useRouter(),
            createNewBookSuccess: true,
            updateBookSuccess: true,
            confirmDeleteBookDialog: false,
            deleteBookSucess: true,
            snackbar: false,
            snackbarContent: '',
            snackbarColor: true,
            icon: {
               mdiClose,
            },
            searchFilters: BOOK_SEARCH_FILTERS_FOR_ADMIN,
            searchFilterStore: useSearchFilterForUserStore(),
         };
      },

      methods: {
         async logout() {
            try {
               await EmployeeService.logout();
            } catch (error) {
               console.log(error);
            }
         },

         goToLoginPage() {
            try {
               this.router.replace({
                  name: 'loginPage',
               });
            } catch (error) {
               console.log(error);
            }
         },

         convertBookTimestamp() {
            this.books.map((book) => {
               book.createdAt = convertTimestamp(book.createdAt);
               book.updatedAt
                  ? (book.updatedAt = convertTimestamp(book.updatedAt))
                  : null;
            });
         },

         async getBooks() {
            try {
               this.books = (await BookService.getBooks()).books;
               this.books.map((book) => {
                  book.publisher = book.publisher.publisherName;
               });
               this.booksCount = this.books.length;
               this.bookProperties = Object.keys(BOOK_TABLE_HEADERS);
               this.tableHeaders = Object.values(BOOK_TABLE_HEADERS);
            } catch (error) {
               console.log(error);
            }
         },

         async addBook(data) {
            try {
               this.createNewBookSuccess = false;
               const { thumbnail, ...bookData } = data;
               const idOfCreatedBook = (await BookService.create(bookData))
                  .createdBook._id;

               let formData = new FormData();
               if (thumbnail) {
                  formData.append('thumbnail', thumbnail[0]);
                  await BookService.uploadBookThumbnail(
                     idOfCreatedBook,
                     formData
                  );
               }
               this.snackbarColor = true;
               this.createNewBookSuccess = true;
               this.snackbarContent = 'Thêm thành công';
               this.snackbar = true;
               this.addFormDialog = false;
               await this.refreshBook();
            } catch (error) {
               this.createNewBookSuccess = true;
               this.snackbarColor = false;
               this.snackbarContent = 'Tiêu đề này đã tồn tại';
               this.snackbar = true;
               this.requireLoginDialog = checkRequiredLogin(error);
            }
         },

         async updateBook(data) {
            try {
               this.updateBookSuccess = false;
               const { thumbnail, ...bookData } = data;
               let formData = new FormData();
               if (thumbnail) {
                  formData.append('thumbnail', thumbnail[0]);
                  await BookService.uploadBookThumbnail(data._id, formData);
               }
               await BookService.updateBook(data._id, bookData);
               this.updateBookSuccess = true;
               this.snackbarColor = true;
               this.snackbarContent = 'Cập nhật thành công';
               this.snackbar = true;
               this.updateFormDialog = false;

               await this.refreshBook();
            } catch (error) {
               console.log(error);
               this.updateBookSuccess = true;
               this.snackbarContent = 'Xảy ra lỗi, cập nhật không thành công';
               this.snackbar = true;
               this.snackbarColor = false;
               this.requireLoginDialog = checkRequiredLogin(error);
            }
         },

         submitUpdateBookForm() {
            if (this.$refs.updateForm) {
               this.$refs.updateForm.onSubmit();
            }
         },

         submitAddBookForm() {
            if (this.$refs.addForm) {
               this.$refs.addForm.onSubmit();
            }
         },

         async setActiveBook(book) {
            this.bookActive = (await BookService.getBook(book._id)).result;
            this.updateFormDialog = true;
         },

         async refreshBook() {
            await this.getBooks();
            await this.convertBookTimestamp();
            const { setSearchFilter } = this.searchFilterStore;
            setSearchFilter({
               searchText: '',
               filterSelected: BOOK_SEARCH_FILTERS_FOR_ADMIN[0],
            });
         },

         confirmDeleteBook(book) {
            this.bookActive = book;
            this.confirmDeleteBookDialog = true;
         },

         async deleteBook(book) {
            try {
               await BookService.deleteBook(book._id);
               await this.refreshBook();
               this.confirmDeleteBookDialog = false;
               this.deleteBookSucess = true;
               this.snackbarColor = true;
               this.snackbarContent = 'Xoá thành công';
               this.snackbar = true;
            } catch (error) {
               console.log(error);
               this.snackbarContent = 'Xảy ra lỗi, xoá không thành công';
               this.snackbarColor = false;
               this.snackbar = true;
            }
         },

         async submitSearch() {
            const { searchFilter } = this.searchFilterStore;

            const result = (await BookService.getBooksByFilter(searchFilter))
               .result;

            this.books = result;
            this.books.map((book) => {
               book.publisher = book.publisher.publisherName;
            });
            this.booksCount = result?.length;
            this.convertBookTimestamp();
         },
      },

      mounted() {
         this.refreshBook();
      },
   };
</script>

<style scoped>
   @import '~/assets/css/BookManagement.css';
</style>
