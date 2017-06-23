import Vue from 'vue'
import Router from 'vue-router'
import Nearby from '@/components/Nearby'
import Splash from '@/components/Splash'
import regispets from '@/components/regispets'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/splash', name: 'Splash', component: Splash},
    {path: '/', component: Nearby, props: true, name: 'Nearby'},
    {
      path: '/regispets', name: 'Resgister', component: regispets
    }
  ]
})
