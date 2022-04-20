 import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

 const routes: Array<RouteRecordRaw> = [
     {
         path: '/',
         name: 'Index',
         component: () => import(/* webpackChunkName: "home" */ './views/Blogs.vue')
     },
     {
         path: '/login',
         name: 'Login',
         component: () => import(/* webpackChunkName: "Log in" */ './views/Login.vue')
     },
     {
         path: '/signup',
         name: 'Sign Up',
         component: () => import(/* webpackChunkName: "Sign up" */ './views/Register.vue')
     },
     {
         path: '/verify-email',
         name: 'Verify Email',
         component: () => import(/* webpackChunkName: "verify Email" */ './views/VerifyEmail.vue')
     },
     {
         path: '/post/:name/:id-:title',
         name: 'Post',
         component: () => import(/* webpackChunkName: "verify Email" */ './views/Post.vue')
     },
     {
         path: '/post/create',
         name: 'Create Post',
         component: () => import(/* webpackChunkName: "verify Email" */ './views/CreateBlog.vue')
     },
     {
         path: '/post/preview',
         name: 'Preview Post',
         component: () => import(/* webpackChunkName: "verify Email" */ './views/PreviewBlog.vue')
     },
 ]
 
 const router = createRouter({
     history: createWebHistory(),
     routes
 })
 
 export default router