<template>
  <RouterView></RouterView>
  <van-tabbar route v-model="active" active-color="#db3d3c">
    <van-tabbar-item to="/home" icon="home-o">精选</van-tabbar-item>
    <van-tabbar-item to="/category" icon="coupon-o">分类</van-tabbar-item>
    <van-tabbar-item to="/cart" icon="shopping-cart-o">购物车</van-tabbar-item>
    <van-tabbar-item to="/mine" icon="manager-o">我</van-tabbar-item>
  </van-tabbar>
</template>
<script setup lang="ts">
import {ref} from "vue";

const active = ref(0)
</script>
<style scoped></style>
