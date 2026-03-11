<!-- src/views/CategoryList.vue -->
<template>
  <div class="category-list-page">
    <!-- Tabs -->
    <van-tabs
        v-model:active="activeTabId"
        sticky
        @change="handleTabChange"
    >
      <van-tab
          v-for="cat in filterCategoryList"
          :key="cat.id"
          :title="cat.name"
          :name="cat.id"
      />
    </van-tabs>

    <!-- 商品列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onPullRefresh">
      <div class="goods-container">
        <van-grid :column-num="2" :gutter="12" :border="false">
          <van-grid-item v-for="item in goodsList" :key="item.id">
            <div class="goods-item" @click="toGoodsDetail(item.id)">
              <van-image :src="item.picUrl" radius="8" />
              <div class="goods-name">{{ item.name }}</div>
              <div class="goods-brief">{{ item.brief }}</div>
              <div class="goods-price">
                <span class="current">¥{{ item.counterPrice.toFixed(2) }}</span>
                <span
                    class="original"
                    v-if="item.retailPrice !== item.counterPrice"
                >
                  ¥{{ item.retailPrice.toFixed(2) }}
                </span>
              </div>
            </div>
          </van-grid-item>
        </van-grid>
      </div>
    </van-pull-refresh>

    <!-- 加载状态 -->
    <van-loading v-if="loading" size="24px" vertical class="loading-state">
      正在加载全部商品...
    </van-loading>

    <!-- 空状态 -->
    <van-empty
        v-else-if="!loading && goodsList.length === 0"
        description="暂无商品"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { GetGoodsList } from '@/api/goods'
import type { GoodsItem, FilterCategory } from '@/types/goods'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()

// ==================== 状态 ====================
const activeTabId = ref<number>(Number(route.query.categoryId) || 1008002)

const goodsList = ref<GoodsItem[]>([])
const filterCategoryList = ref<FilterCategory[]>([])

const loading = ref(false)
const refreshing = ref(false)

// ==================== 一次性加载全部页 ====================
const fetchAllGoods = async () => {
  loading.value = true
  goodsList.value = []   // 清空旧数据

  try {
    // 第1步：请求第1页，拿到总页数
    const firstRes = await GetGoodsList(activeTabId.value, 1, 10)
    const firstData = firstRes.data

    if (firstRes?.data==null) throw new Error('接口返回错误')

    const totalPages = firstData.pages
    filterCategoryList.value = firstData.filterCategoryList || []

    // 第2步：并行请求第2页到最后一页
    const promises = []
    for (let p = 2; p <= totalPages; p++) {
      promises.push(GetGoodsList(activeTabId.value, p, 10))
    }

    const allRes = await Promise.all(promises)

    // 合并所有页的数据
    let allItems: GoodsItem[] = [...firstData.list]

    allRes.forEach(res => {
      if (res?.data) {
        allItems = allItems.concat(res.data.list)
      }
    })

    goodsList.value = allItems

  } catch (err: any) {
    showToast(err.message || '加载失败')
    console.error(err)
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

// ==================== 事件 ====================
const handleTabChange = () => {
  fetchAllGoods()
}

const onPullRefresh = () => {
  fetchAllGoods()
}

const toGoodsDetail = (id: number) => {
  router.push(`/goods/${id}`)
}

// ==================== 监听路由变化 ====================
watch(() => route.query.categoryId, (newId) => {
  if (newId) {
    activeTabId.value = Number(newId)
    handleTabChange()
  }
})

onMounted(() => {
  fetchAllGoods()
})
</script>

<style scoped>
.category-list-page {
  min-height: 100vh;
  background: #f8f8f8;
}

.goods-container {
  padding: 12px;
}

.goods-item {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  padding-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.2s;
}

.goods-item:active {
  transform: scale(0.98);
}

.goods-item :deep(.van-image) {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.goods-name {
  padding: 8px 12px 4px;
  font-size: 15px;
  font-weight: 500;
  color: #323233;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods-brief {
  padding: 0 12px 6px;
  font-size: 12px;
  color: #999;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods-price {
  padding: 0 12px;
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.current {
  color: #ff4d4f;
  font-size: 16px;
  font-weight: bold;
}

.original {
  color: #999;
  font-size: 13px;
  text-decoration: line-through;
}

.loading-state {
  margin-top: 120px;
}
</style>