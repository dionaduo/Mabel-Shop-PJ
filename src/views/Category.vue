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
import { showLoadingToast, closeToast, showToast } from 'vant'
import type { ChannelItem } from "../../types/shopData"
import { GetCategory, GetHome } from "@/api"
import type { Category, CategoryData } from "../../types/category"

// 状态定义
const activeIndex = ref(0)
const searchValue = ref('')
const loading = ref(false)

// 分类数据
const channelData = reactive({
  channelList: [] as ChannelItem[]
})
const { channelList } = toRefs(channelData)

const categoryData = reactive({
  currentCategory: null as Category | null,
  currentSubCategory: [] as Category[]
})
const { currentCategory, currentSubCategory } = toRefs(categoryData)

// 获取主分类
const getMainCategory = async () => {
  try {
    const res = await GetHome()
    if (res?.data?.channel) {
      channelData.channelList = res.data.channel

      // 默认加载第一个分类
      if (res.data.channel.length > 0) {
        await getSubCategory(<number>res.data.channel[0]?.id)
      }
    }
  } catch (error) {
    console.error('获取主分类失败:', error)
    showToast('加载分类失败')
  }
}

// 获取子分类
const getSubCategory = async (id: number) => {
  loading.value = true

  try {
    const res = await GetCategory(id)
    if (res?.data) {
      const { currentCategory: main, currentSubCategory: sub } = res.data

      // 更新状态
      categoryData.currentCategory = main || null
      categoryData.currentSubCategory = sub || []
    }
  } catch (error) {
    console.error('获取子分类失败:', error)
    showToast('加载子分类失败')
    categoryData.currentSubCategory = []
  } finally {
    loading.value = false
  }
}

// 切换分类
const handleCategoryChange = async (id: number, index: number) => {
  activeIndex.value = index
  await getSubCategory(id)
}

// 搜索处理
const handleSearch = () => {
  if (!searchValue.value.trim()) {
    showToast('请输入搜索内容')
    return
  }
  console.log('搜索:', searchValue.value)
}

// 初始化
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