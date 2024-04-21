import { createRouter, createWebHistory } from 'vue-router';

//User Pages
import UserLayout from '~/layouts/UserLayout.vue';
import UserHome from '~/pages/user/UserHome.vue';
import BookCategories from '~/pages/user/BookCategories.vue';
import MyLibrary from '~/pages/user/MyLibrary.vue';
import HelpCenter from '~/pages/user/HelpCenter.vue';
import SignUp from '~/pages/user/SignUp.vue';
import Login from '~/pages/user/Login.vue';
import Result from '~/pages/user/Result.vue';
import BookDetails from '~/pages/user/BookDetails.vue';

// Admin Pages
import AdminHome from '~/pages/admin/AdminHome.vue';
import AdminBookManagement from '~/pages/admin/BookManagement.vue';
import AdminUserManagement from '~/pages/admin/UserManagement.vue';
import AdminBorrowingManagement from '~/pages/admin/BorrowingManagement.vue';
import AdminOverview from '~/pages/admin/Overview.vue';

const routes = [
   {
      path: '/',
      component: UserLayout,
      children: [
         {
            path: '',
            name: 'userHomePage',
            component: UserHome,
         },
         {
            path: 'categories',
            name: 'bookCategoriesPage',
            component: BookCategories,
         },

         {
            path: 'my-library',
            name: 'myLibraryPage',
            component: MyLibrary,
         },
         {
            path: 'sign-up',
            name: 'signUpPage',
            component: SignUp,
         },
         {
            path: 'login',
            name: 'loginPage',
            component: Login,
         },
         {
            path: 'search/:filter',
            name: 'resultPage',
            component: Result,
         },
         {
            path: 'books/:slug/:id',
            name: 'bookDetailsPage',
            component: BookDetails,
            props: true,
            beforeEnter: () => {},
         },
      ],
   },

   {
      path: '/admin',
      name: 'adminHomePage',
      component: AdminHome,
      children: [
         {
            path: '',
            name: 'adminOverviewPage',
            component: AdminOverview,
         },
         {
            path: 'books-management',
            name: 'adminBookManagementPage',
            component: AdminBookManagement,
         },
         {
            path: 'users-management',
            name: 'adminUserManagementPage',
            component: AdminUserManagement,
         },
         {
            path: 'borrowing-management',
            name: 'adminBorrowingManagementPage',
            component: AdminBorrowingManagement,
         },
      ],
   },
];

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes,
   scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
         return savedPosition;
      }
   },
});

export default router;
