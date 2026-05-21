import Vue from 'vue'
import Router from 'vue-router'
import H5Home from '@/views/h5/Home.vue'
import H5Lottery from '@/views/h5/Lottery.vue'
import H5Ranking from '@/views/h5/Ranking.vue'
import AdminHome from '@/views/admin/Home.vue'
import AdminConfig from '@/views/admin/Config.vue'
import AdminLotteryConfig from '@/views/admin/LotteryConfig.vue'
import AdminGiftConfig from '@/views/admin/GiftConfig.vue'
import AdminRankingConfig from '@/views/admin/RankingConfig.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'H5Home',
      component: H5Home
    },
    {
      path: '/lottery',
      name: 'H5Lottery',
      component: H5Lottery
    },
    {
      path: '/ranking',
      name: 'H5Ranking',
      component: H5Ranking
    },
    {
      path: '/admin',
      name: 'AdminHome',
      component: AdminHome,
      children: [
        {
          path: 'config',
          name: 'AdminConfig',
          component: AdminConfig
        },
        {
          path: 'lottery',
          name: 'AdminLotteryConfig',
          component: AdminLotteryConfig
        },
        {
          path: 'gift',
          name: 'AdminGiftConfig',
          component: AdminGiftConfig
        },
        {
          path: 'ranking',
          name: 'AdminRankingConfig',
          component: AdminRankingConfig
        }
      ]
    }
  ]
})