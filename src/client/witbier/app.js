import Vue from 'vue'
import VueRouter from 'vue-router'

import auth from './authentication/auth'
import NavBar from './NavBar.vue'

import Login from './authentication/Login.vue'
import Annotation from './annotations/Annotation.vue'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.use(VueRouter)

function requireAuth(to, from, next) {
  if (!auth.loggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

const Home = { template: '<div>home</div>' }
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/login', component: Login },
    { path: '/annotation', component: Annotation, beforeEnter: requireAuth },
    {
      path: '/', component: Home,
      beforeEnter(to, from, next) {
        if (!auth.loggedIn()) 
          next('/login')
        else
          next('/annotation')
      }
    },
    {
      path: '/logout',
      beforeEnter(to, from, next) {
        auth.logout()
        next('/login')
      }
    }
  ]
})

new Vue({
  router,
  render: h => h(NavBar)
}).$mount('#app')
