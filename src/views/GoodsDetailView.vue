<template>
  <GoodsDetail :goods-id="route.params.id" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useGoodsDetailStore } from '@/stores/goodsDetail'
import GoodsDetail from '@/components/GoodsDetail.vue'

const route = useRoute()
const store = useGoodsDetailStore()

onMounted(() => {
  const id = route.params.id
  if (id) {
    store.reset()           // 切换商品时重置规格选择
    store.fetchGoodsDetail(id)
    store.fetchCartCount()
  }
})

// 组件卸载时清理状态（可选）
onBeforeUnmount(() => {
  store.reset()
})
</script>