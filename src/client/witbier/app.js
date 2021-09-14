import Vue from 'vue'
import VueRouter from 'vue-router'
import Annotation from './annotations/Annotation.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.use(VueRouter)

const Home = { template: '<div>home</div>' }
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '/annotation', component: Annotation },
  ]
})

new Vue({
  router,
  template: `
    <div id="app">
      <ul>
        <li><router-link to="/">/</router-link></li>
        <li><router-link to="/annotation">Annotations</router-link></li>
      </ul>
      <router-view></router-view>
    </div>
  `
}).$mount('#app')
