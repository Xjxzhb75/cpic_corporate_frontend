import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

const VueRouterPush = VueRouter.prototype.push 
VueRouter.prototype.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => err)
}
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    children:[
      {
        path: '/',
        name: 'desktop',
        component: () => import(/* webpackChunkName: "about" */ '@/views/Desktop.vue')
      },
    ]
  },
]

const router = new VueRouter({
 mode:'history',
 base: process.env.BASE_URL,
  routes
})

export default router
