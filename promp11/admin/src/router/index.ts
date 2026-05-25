import Vue from 'vue';
import VueRouter from 'vue-router';
import Config from '../views/Config.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Config',
    component: Config,
  },
];

const router = new VueRouter({
  mode: 'hash',
  routes,
});

export default router;
