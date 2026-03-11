<template>
  <div class="container">
    <!-- 搜索区域（本地状态） -->
    <div class="search-wrapper">
      <van-search v-model="searchValue" placeholder="搜搜你喜欢的商品..." shape="round" />
    </div>

    <!-- 加载状态 -->
    <van-loading v-if="home.loading" size="24px" vertical class="loading-state">加载中...</van-loading>

    <!-- 空状态 -->
    <van-empty v-else-if="!home.loading && home.isEmpty" description="暂无数据" />

    <!-- 首页内容 -->
    <template v-else>
      <!-- 轮播图 -->
      <div class="swiper-wrapper" v-if="home.bannerList.length">
        <van-swipe class="custom-swipe" :autoplay="3000" indicator-color="#ff6b6b">
          <van-swipe-item v-for="item in home.bannerList" :key="item.id">
            <img :src="item.url" :alt="item.name" class="swiper-image" />
          </van-swipe-item>
        </van-swipe>
      </div>

      <!-- 宫格频道 -->
      <van-grid :column-num="3" :border="false" class="channel-grid" v-if="home.channelList.length">
        <van-grid-item
            v-for="item in home.channelList"
            :key="item.id"
            @click="toCategoryList(item.id)"
        >
          <div class="channel-item">
            <img :src="item.iconUrl" :alt="item.name" class="channel-icon" />
            <span class="channel-name">{{ item.name }}</span>
          </div>
        </van-grid-item>
      </van-grid>

      <!-- 优惠券 -->
      <template v-if="home.couponList.length">
        <SectionHeader title="优惠券" linkText="查看更多优惠券" />
        <div class="coupon-card" v-for="item in home.couponList" :key="item.id">
          <van-card :price="item.discount" :desc="item.desc" :title="item.name">
            <template #tags>
              <van-tag plain type="primary">满减</van-tag>
              <van-tag plain type="danger">限时</van-tag>
            </template>
          </van-card>
        </div>
      </template>

      <!-- 团购 -->
      <template v-if="home.grouponList.length">
        <SectionHeader title="团购" linkText="查看更多团购" />
        <van-card
            v-for="item in home.grouponList"
            :key="item.id"
            :price="item.grouponPrice"
            :origin-price="item.retailPrice"
            :desc="item.brief"
            :title="item.name"
            :thumb="item.picUrl"
            class="goods-card"
        >
          <template #tags>
            <van-tag plain type="primary">20人成团</van-tag>
            <van-tag plain type="danger">¥20立减</van-tag>
          </template>
        </van-card>
      </template>

      <!-- 品牌商直购 -->
      <template v-if="home.brandList.length">
        <SectionHeader title="品牌商直购" linkText="查看更多品牌" />
        <van-grid :border="false" :column-num="2" :gutter="12" class="brand-grid">
          <van-grid-item v-for="item in home.brandList" :key="item.id">
            <div class="brand-item">
              <van-image :src="item.picUrl" class="brand-image" />
              <p class="brand-name">{{ item.name }}</p>
            </div>
          </van-grid-item>
        </van-grid>
      </template>

      <!-- 新品首发 -->
      <template v-if="home.newGoodsList.length">
        <SectionHeader title="新品首发" linkText="查看更多新品" />
        <van-grid :border="false" :column-num="2" :gutter="12" class="goods-grid">
          <van-grid-item
              v-for="item in home.newGoodsList"
              :key="item.id"
              @click="goToGoods(item.id)"
          >
            <div class="goods-item">
              <van-image :src="item.picUrl" class="goods-image" />
              <p class="goods-name">{{ item.name }}</p>
              <span class="goods-price">¥{{ home.formatPrice(item.counterPrice) }}</span>
            </div>
          </van-grid-item>
        </van-grid>
      </template>

      <!-- 人气推荐 -->
      <template v-if="home.hotGoodsList.length">
        <SectionHeader title="人气推荐" linkText="查看更多人气商品" />
        <van-card
            v-for="item in home.hotGoodsList"
            :key="item.id"
            :price="item.counterPrice"
            :origin-price="item.retailPrice"
            :desc="item.brief"
            :title="item.name"
            :thumb="item.picUrl"
            class="goods-card"
            @click="goToGoods(item.id)"
        >
          <template #tags>
            <van-tag plain type="primary">🔥 人气爆款</van-tag>
          </template>
        </van-card>
      </template>

      <!-- 专题 -->
      <template v-if="home.topicList.length">
        <SectionHeader title="精选专题" linkText="查看更多专题" />
        <van-grid :border="false" :column-num="2" :gutter="5" class="topic-grid">
          <van-grid-item v-for="item in home.topicList" :key="item.id">
            <div class="topic-item">
              <van-image :src="item.picUrl" class="topic-image" />
              <p class="topic-title">{{ item.title }}</p>
              <p class="topic-subtitle">{{ item.subtitle }}</p>
            </div>
          </van-grid-item>
        </van-grid>
        <van-back-top bottom="10vh" />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHomeStore } from '@/stores/home'
import SectionHeader from '../components/SectionHeader.vue'
import { useRouter } from 'vue-router'   // 或保持你原来的 import router from "@/router"
const router = useRouter()   // 如果你之前用 import router，直接用 router 即可
// 商品卡片点击（新品、人气推荐等）
const goToGoods = (id: number) => {
  router.push(`/goods/${id}`)
}
const toCategoryList = (id: number) => {
  router.push({
    name: 'items',
    query: { categoryId: id }
  })
}
// Store 实例
const home = useHomeStore()

// 本地搜索状态（不存入 store）
const searchValue = ref('')

// 页面挂载时获取数据（store 会自动处理缓存）
home.fetchHomeData()
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  min-width: 320px;
  max-width: 780px;
  margin: 0 auto;
  padding: 12px 12px 20px;
  background-color: #f8f8f8;
  min-height: 100vh;
}

/* 搜索区域 */
.search-wrapper {
  margin-bottom: 12px;
}

/* 轮播图 */
.swiper-wrapper {
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.custom-swipe {
  height: 180px;
}

.swiper-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 频道网格 */
.channel-grid {
  background: white;
  border-radius: 12px;
  padding: 8px 0;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.channel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.channel-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.channel-name {
  font-size: 12px;
  color: #666;
}

/* 优惠券卡片 */
.coupon-card {
  margin: 10px 10px 12px;
  padding: 15px;
  border: 1px solid red;
  border-radius: 12px;
}

/* 商品卡片通用样式 */
.goods-card {
  margin-bottom: 12px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 品牌网格 */
.brand-grid {
  margin-bottom: 20px;
}

.brand-item {
  background: white;
  border-radius: 8px;
  padding: 8px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.brand-item:active {
  transform: scale(0.98);
}

.brand-image {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.brand-name {
  margin-top: 6px;
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

/* 商品网格 */
.goods-grid {
  margin-bottom: 20px;
}

.goods-item {
  background: white;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.goods-item:active {
  transform: scale(0.98);
}

.goods-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
}

.goods-name {
  margin: 6px 0 4px;
  font-size: 13px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-price {
  color: #ff6b6b;
  font-weight: bold;
  font-size: 14px;
}

/* 专题网格 */
.topic-grid {
  margin-bottom: 10px;
}

.topic-item {
  width: 100%;
  background: white;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.topic-item:active {
  transform: scale(0.98);
}

.topic-image {
  width: 150px;
  border-radius: 6px;
  object-fit: cover;
}

.topic-title {
  margin: 6px 0 2px;
  font-size: 13px;
  color: #be8d52;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topic-subtitle {
  width: 100%;
  font-size: 11px;
  color: #be8d52;
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 加载状态 */
.loading-state {
  margin-top: 50px;
}

/* 移除多余的外边距 */
:deep(.van-card) {
  background: white;
}

:deep(.van-card__thumb) {
  border-radius: 8px;
}

:deep(.van-tag) {
  margin-right: 4px;
}
</style>