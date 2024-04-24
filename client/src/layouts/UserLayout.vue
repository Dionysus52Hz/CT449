<template>
   <v-layout>
      <Header></Header>

      <v-main>
         <router-view v-slot="{ Component }">
            <KeepAlive :max="10">
               <component :is="Component"></component>
            </KeepAlive>
         </router-view>
         <Footer></Footer>
      </v-main>
   </v-layout>
</template>

<script setup>
   import Header from '~/components/user/Header.vue';
   import Footer from '~/components/user/Footer.vue';
</script>
