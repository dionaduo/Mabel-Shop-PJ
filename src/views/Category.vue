<template>
  <!-- 搜索区域 -->
  <div class="search-wrapper">
    <van-search
        v-model="searchValue"
        placeholder="搜搜你喜欢的商品..."
        shape="round"
        show-action
    >
      <template #action>
        <div @click="handleSearch">搜索</div>
      </template>
    </van-search>
  </div>

  <!-- 分类主体 -->
  <div class="category-container">
    <!-- 左侧分类导航 -->
    <div class="left-cate">
      <van-sidebar v-model="activeIndex">
        <van-sidebar-item
            v-for="(item, index) in channelList"
            :key="item.id"
            :title="item.name"
            @click="handleCategoryChange(item.id, index)"
        />
      </van-sidebar>
    </div>
    <!-- 右侧子分类列表 -->
    <div class="right-cate" v-if="!loading">
      <!-- 主分类图片展示 -->
      <van-image
          :src="currentCategory?.picUrl"
      />
      <p style="text-align: center">{{currentCategory?.desc}}</p>

      <!-- 子分类列表 -->
      <div class="sub-category-section">
        <div class="section-title" v-if="currentSubCategory.length">子分类</div>
        <div class="sub-category-grid" v-if="currentSubCategory.length">
          <van-grid :column-num="3" :border="false" :gutter="5" :icon-size="80">
            <van-grid-item
                :icon="subItem.picUrl"
                v-for="subItem in currentSubCategory"
                :key="subItem.id"
                :text="subItem.name"
            />
          </van-grid>
        </div>
        <div v-else class="empty-tip">
          暂无子分类
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div class="right-cate loading-state" v-else>
      <van-skeleton title :row="6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, toRefs } from 'vue'
import { showToast } from 'vant'
import type { ChannelItem } from "@/types/homeData.ts"
import { GetCategory, GetHome } from "@/api"
import type { Category, CategoryData } from "@/types/goodsDetails/category.ts"
import { deepClone, isDataEqual, loadCache, saveCache } from '@/utils/cache' // ← 新增

const CACHE_CHANNEL_KEY = 'homeChannelCache'
const CACHE_SUB_KEY = 'categorySubCache'   // { [id: number]: {currentCategory, currentSubCategory} }

const activeIndex = ref(0)
const searchValue = ref('')
const loading = ref(false)

const channelData = reactive({ channelList: [] as ChannelItem[] })
const { channelList } = toRefs(channelData)

const categoryData = reactive({
  currentCategory: null as Category | null,
  currentSubCategory: [] as Category[]
})
const { currentCategory, currentSubCategory } = toRefs(categoryData)

// ==================== 缓存加载/保存 ====================
const loadChannelCache = () => {
  const cached = loadCache<ChannelItem[]>(CACHE_CHANNEL_KEY)
  if (cached?.length) {
    channelData.channelList = cached
  }
}

const loadSubCache = () => {
  return loadCache<Record<number, { currentCategory: Category | null; currentSubCategory: Category[] }>>(CACHE_SUB_KEY) || {}
}

const saveSubCache = (cacheObj: Record<number, any>) => {
  saveCache(CACHE_SUB_KEY, cacheObj)
}

// ==================== 获取主分类（频道） ====================
const getMainCategory = async () => {
  loadChannelCache()   // 瞬间显示左侧频道

  try {
    const res = await GetHome()
    if (res?.data?.channel) {
      const newChannels = res.data.channel

      saveCache(CACHE_CHANNEL_KEY, newChannels)

      if (!isDataEqual(newChannels, channelList.value)) {
        channelData.channelList = newChannels
      }

      // 默认加载第一个子分类
      if (newChannels.length > 0) {
        await getSubCategory(newChannels[0].id)
      }
    }
  } catch (error) {
    console.error('获取主分类失败:', error)
    showToast('加载分类失败')
  }
}

// ==================== 获取子分类（核心缓存逻辑） ====================
const getSubCategory = async (id: number) => {
  const subCaches = loadSubCache()
  const cached = subCaches[id]

  // 有缓存 → 立即渲染
  if (cached) {
    categoryData.currentCategory = cached.currentCategory || null
    categoryData.currentSubCategory = cached.currentSubCategory || []
    loading.value = false
    console.log(`✅ 子分类 ${id} 使用缓存`)
  } else {
    loading.value = true
  }

  try {
    const res = await GetCategory(id)
    if (res?.data) {
      const newSub = {
        currentCategory: res.data.currentCategory || null,
        currentSubCategory: res.data.currentSubCategory || []
      }

      // 保存最新缓存
      subCaches[id] = newSub
      saveSubCache(subCaches)

      // 对比后决定是否更新界面
      if (!isDataEqual(newSub, cached || {})) {
        categoryData.currentCategory = newSub.currentCategory
        categoryData.currentSubCategory = newSub.currentSubCategory
        console.log(`🔄 子分类 ${id} 已更新`)
      } else {
        console.log(`✅ 子分类 ${id} 与缓存一致`)
      }
    }
  } catch (error) {
    console.error('获取子分类失败:', error)
    showToast('加载子分类失败')
  } finally {
    loading.value = false
  }
}

// 切换分类
const handleCategoryChange = async (id: number, index: number) => {
  activeIndex.value = index
  await getSubCategory(id)
}

// 搜索保持不变...
const handleSearch = () => { /* ... */ }

onMounted(() => {
  getMainCategory()
})
</script>

<style scoped>
.search-wrapper {
  position: sticky;
  top: 0;
  z-index: 999;
  background-color: #fff;
  padding: 10px 0;
}

.category-container {
  display: flex;
  height: calc(100vh - 60px);
  overflow: hidden;
}

.left-cate {
  width: 100px;
  overflow-y: auto;
  background-color: #f5f5f5;
}

.right-cate {
  height: 100%;
  flex: 1;
  padding: 10px;
  background-color: #fff;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin: 10px;
  padding-left: 5px;
}

.sub-category-grid {
  width: 100%;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 30px 0;
}

.loading-state {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20px;
}

:deep(.van-sidebar-item--select) {
  background-color: #fff;
  font-weight: bold;
}

:deep(.van-grid-item__content) {
  padding: 10px 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.van-grid-item__text) {
  margin-top: 5px;
  font-size: 13px;
  color: #666;
}

.current-category-item :deep(.van-grid-item__text) {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.current-category-item :deep(.van-icon) {
  width: 80px;
  height: 80px;
  border-radius: 8px;
}
</style>