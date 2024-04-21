import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './router';
import './style.css';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

const myCustomLightTheme = {
   dark: false,
   colors: {
      background: '#FFFFFF',
      'on-background': '#050505',
      'on-surface-light': '#050505',
      'surface-light': '#E5E7F7',
      'surface-variant': '#F4F4F4',
      primary: '#3742A6',
      danger: '#B00020',
      'border-color': '#3742A6',
   },
};

const vuetify = createVuetify({
   ssr: true,
   components,
   directives,
   icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
         mdi,
      },
   },
   theme: {
      defaultTheme: 'myCustomLightTheme',
      themes: {
         myCustomLightTheme,
      },
   },
});

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App).use(pinia).use(router).use(vuetify).mount('#app');
