<template>
  <!-- 搜索區域 -->
  <div class="search-wrapper">
    <van-search
        v-model="searchValue"
        placeholder="搜搜你喜欢的商品..."
        shape="round"
        show-action
    >
      <template #action>
        <div @click="searchHandle">搜索</div>
      </template>
    </van-search>
  </div>

  <!-- 分類主體 -->
  <div class="category-container">
    <!-- 左側 -->
    <div class="left-cate">
      <van-sidebar v-model="category.activeIndex">
        <van-sidebar-item
            v-for="(item, index) in category.channelList"
            :key="item.id"
            :title="item.name"
            @click="handleCategoryChange(item.id, index)"
        />
      </van-sidebar>
    </div>

    <!-- 右側 -->
    <div class="right-cate" v-if="!category.loading">
      <van-image :src="category.currentCategory?.picUrl" />
      <p style="text-align: center">{{ category.currentCategory?.desc }}</p>

      <div class="sub-category-section">
        <div class="section-title" v-if="category.currentSubCategory.length">子分類</div>
        <div class="sub-category-grid" v-if="category.currentSubCategory.length">
          <van-grid :column-num="3" :border="false" :gutter="5" :icon-size="80">
            <van-grid-item
                :icon="subItem.picUrl"
                v-for="subItem in category.currentSubCategory"
                :key="subItem.id"
                :text="subItem.name"
                @click="toItem(subItem.id)"
            />
          </van-grid>
        </div>
        <div v-else class="empty-tip">暫無子分類</div>
      </div>
    </div>

    <div class="right-cate loading-state" v-else>
      <van-skeleton title :row="6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { useCategoryStore } from '@/stores/category'
import { showToast } from 'vant'
import router from "@/router";

const category = useCategoryStore()
const searchValue = ref('')

onMounted(() => {
  category.fetchChannels()   // 載入主分類 + 第一個子分類
})

const searchHandle=()=>{
  console.log('a')
}
const toItem = (id: number) => {
  router.push({
    name: 'items',
    query: { categoryId: id }
  })
}
const handleCategoryChange = (id: number, index: number) => {
  category.switchCategory(id, index)
}
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