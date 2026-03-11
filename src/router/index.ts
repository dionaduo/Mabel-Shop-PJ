import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect(to, from) {
        return '/home'
      },
    },{
      path: '/home',
      name: 'home',
      component: () => import('@/views/Home.vue')
    }, {
      path:'/category',
      name:'category',
      component:()=>import('@/views/Category.vue'),
    },{
      path:'/cart',
      name:'cart',
      component:()=>import('@/views/Cart.vue')
    },{
      path:'/mine',
      name:'mine',
      component:()=>import('@/views/Mine.vue')
    }, {
      path:`/category/items`,
      name:'items',
      component:()=>import('@/views/CategoryList.vue')
    },
    {
      path: '/goods/:id',
      name: 'goods-detail',
      component: () => import('@/views/GoodsDetailView.vue')
    }
  ],
})



export default router
