<template>
  <RouterView />
  <van-tabbar
      route
      v-model="active"
      active-color="#db3d3c"
      teleport="body"
  >
  <van-tabbar-item to="/home" icon="home-o">精选</van-tabbar-item>
  <van-tabbar-item to="/category" icon="coupon-o">分类</van-tabbar-item>
  <van-tabbar-item to="/cart" icon="shopping-cart-o">购物车</van-tabbar-item>
  <van-tabbar-item to="/mine" icon="manager-o">我</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref } from 'vue'
const active = ref(0)
</script>

<style>
/* 可选：添加全局样式确保 body 无干扰 */
body {
  margin: 0;
  padding: 0;
}
</style>