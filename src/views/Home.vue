<template>
  <div class="container">
    <!-- 搜索区域 -->
    <div class="search-wrapper">
      <van-search v-model="searchValue" placeholder="搜搜你喜欢的商品..." shape="round" />
    </div>

    <!-- 轮播图 -->
    <div class="swiper-wrapper" v-if="bannerList.length">
      <van-swipe class="custom-swipe" :autoplay="3000" indicator-color="#ff6b6b">
        <van-swipe-item v-for="item in bannerList" :key="item.id">
          <img :src="item.url" :alt="item.name" class="swiper-image" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 宫格频道 -->
    <van-grid :column-num="3" :border="false" class="channel-grid" v-if="channelList.length">
      <van-grid-item v-for="item in channelList" :key="item.id">
        <div class="channel-item">
          <img :src="item.iconUrl" :alt="item.name" class="channel-icon" />
          <span class="channel-name">{{ item.name }}</span>
        </div>
      </van-grid-item>
    </van-grid>

    <!-- 优惠券 -->
    <template v-if="couponList.length">
      <SectionHeader title="优惠券" linkText="查看更多优惠券" />
      <div class="coupon-card" v-for="item in couponList" :key="item.id">
        <van-card :price="item.discount" :desc="item.desc" :title="item.name">
          <template #tags>
            <van-tag plain type="primary">满减</van-tag>
            <van-tag plain type="danger">限时</van-tag>
          </template>
        </van-card>
      </div>
    </template>

    <!-- 团购 -->
    <template v-if="grouponList.length">
      <SectionHeader title="团购" linkText="查看更多团购" />
      <van-card
          v-for="item in grouponList"
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
    <template v-if="brandList.length">
      <SectionHeader title="品牌商直购" linkText="查看更多品牌" />
      <van-grid :border="false" :column-num="2" :gutter="12" class="brand-grid">
        <van-grid-item v-for="item in brandList" :key="item.id">
          <div class="brand-item">
            <van-image :src="item.picUrl" class="brand-image"  />
            <p class="brand-name">{{ item.name }}</p>
          </div>
        </van-grid-item>
      </van-grid>
    </template>

    <!-- 新品首发 -->
    <template v-if="newGoodsList.length">
      <SectionHeader title="新品首发" linkText="查看更多新品" />
      <van-grid :border="false" :column-num="2" :gutter="12" class="goods-grid">
        <van-grid-item v-for="item in newGoodsList" :key="item.id">
          <div class="goods-item">
            <van-image :src="item.picUrl" class="goods-image"  />
            <p class="goods-name">{{ item.name }}</p>
            <span class="goods-price">¥{{ formatPrice(item.counterPrice) }}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </template>

    <!-- 人气推荐 -->
    <template v-if="hotGoodsList.length">
      <SectionHeader title="人气推荐" linkText="查看更多人气商品" />
      <van-card
          v-for="item in hotGoodsList"
          :key="item.id"
          :price="item.counterPrice"
          :origin-price="item.retailPrice"
          :desc="item.brief"
          :title="item.name"
          :thumb="item.picUrl"
          class="goods-card"
      >
        <template #tags>
          <van-tag plain type="primary">🔥 人气爆款</van-tag>
        </template>
      </van-card>
    </template>

    <!-- 专题 -->
    <template v-if="topicList.length">
      <SectionHeader title="精选专题" linkText="查看更多专题" />
      <van-grid :border="false" :column-num="2" :gutter="5" class="topic-grid">
        <van-grid-item  v-for="item in topicList" :key="item.id">
          <div class="topic-item">
            <van-image :src="item.picUrl" class="topic-image" />
            <p class="topic-title">{{ item.title }}</p>
            <p class="topic-subtitle">{{ item.subtitle }}</p>
          </div>
        </van-grid-item>
      </van-grid>
      <van-back-top bottom="10vh"/>

    </template>

    <!-- 加载状态 -->
    <van-loading v-if="loading" size="24px" vertical class="loading-state">加载中...</van-loading>

    <!-- 空状态 -->
    <van-empty v-if="!loading && isEmpty" description="暂无数据" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, computed, toRefs } from 'vue'
import { showToast } from 'vant'
import { GetHome } from '@/api'
import SectionHeader from '../components/SectionHeader.vue'
import type {
  BannerItem, BrandItem, ChannelItem, CouponItem,
  GoodsItem, GrouponItem, TopicItem
} from '@/types/homeData.ts'
import { deepClone, isDataEqual, loadCache, saveCache } from '@/utils/cache' // ← 新增

const CACHE_KEY = 'homeDataCache'

const searchValue = ref('')
const loading = ref(false)
const abortController = ref<AbortController | null>(null)

const homeData = reactive({
  banner: [] as BannerItem[],
  channel: [] as ChannelItem[],
  couponList: [] as CouponItem[],
  grouponList: [] as GrouponItem[],
  brandList: [] as BrandItem[],
  newGoodsList: [] as GoodsItem[],
  hotGoodsList: [] as GoodsItem[],
  topicList: [] as TopicItem[]
})

const {
  banner: bannerList,
  channel: channelList,
  couponList,
  grouponList,
  brandList,
  newGoodsList,
  hotGoodsList,
  topicList
} = toRefs(homeData)

const isEmpty = computed(() => {
  return !bannerList.value.length &&
      !channelList.value.length &&
      !couponList.value.length &&
      !grouponList.value.length &&
      !brandList.value.length &&
      !newGoodsList.value.length &&
      !hotGoodsList.value.length &&
      !topicList.value.length
})
// 格式化价格
const formatPrice = (price: number) => {
  return price.toFixed(2)
}

// ==================== 核心缓存逻辑 ====================
const loadHomeCache = () => {
  const cached = loadCache<typeof homeData>(CACHE_KEY)
  if (cached) {
    Object.assign(homeData, cached)   // 瞬间渲染缓存
    console.log('✅ Home 页面使用缓存数据')
  } else {
    loading.value = true
  }
}

const fetchHomeData = async () => {
  const previousData = deepClone(homeData)   // 用于对比

  try {
    const res = await GetHome()
    if (res?.data) {
      const newData = {
        banner: res.data.banner || [],
        channel: res.data.channel || [],
        couponList: res.data.couponList || [],
        grouponList: res.data.grouponList || [],
        brandList: res.data.brandList || [],
        newGoodsList: res.data.newGoodsList || [],
        hotGoodsList: res.data.hotGoodsList || [],
        topicList: res.data.topicList || []
      }

      // 始终保存最新数据到缓存（保持时间戳更新）
      saveCache(CACHE_KEY, newData)

      // 关键：数据不同才更新界面（避免不必要的重渲染）
      if (!isDataEqual(newData, previousData)) {
        Object.assign(homeData, newData)
        console.log('🔄 Home 数据已更新（缓存与服务器不一致）')
      } else {
        console.log('✅ Home 数据与缓存一致，无需更新')
      }
    }
  } catch (error: any) {
    console.error('Home fetch error:', error)
    if (error.name !== 'AbortError') {
      showToast(error.response?.data?.errmsg || '网络开小差了~')
    }
  } finally {
    loading.value = false
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  loadHomeCache()        // 瞬间显示缓存
  fetchHomeData()        // 后台校验刷新
})

onUnmounted(() => {
  if (abortController.value) abortController.value.abort()
})
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