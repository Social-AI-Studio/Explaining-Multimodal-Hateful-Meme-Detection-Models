import Vue from 'vue'
import VueRouter from 'vue-router'

import auth from '../utils/auth'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

function requireAuth(to, from, next) {
  if (!auth.loggedIn()) {
    next({
      path: '/',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/stages',
    name: 'stages',
    beforeEnter: requireAuth,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Stage.vue')
  },
  {
    path: '/annotations/:stageId',
    name: 'annotations',
    beforeEnter: requireAuth,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Annotation.vue')
  },
  {
    path: '/logout',
    beforeEnter(to, from, next) {
      auth.logout()
      next('/')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router