// src/stores/home.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { GetHome } from '@/api'
import type {
    BannerItem,
    BrandItem,
    ChannelItem,
    CouponItem,
    GoodsItem,
    GrouponItem,
    TopicItem
} from '@/types/homeData.ts'

export const useHomeStore = defineStore('home', () => {
    const bannerList = ref<BannerItem[]>([])
    const channelList = ref<ChannelItem[]>([])
    const couponList = ref<CouponItem[]>([])
    const grouponList = ref<GrouponItem[]>([])
    const brandList = ref<BrandItem[]>([])
    const newGoodsList = ref<GoodsItem[]>([])
    const hotGoodsList = ref<GoodsItem[]>([])
    const topicList = ref<TopicItem[]>([])

    const loading = ref(false)
    const errorMsg = ref<string | null>(null)

    const isEmpty = computed(() =>
        !bannerList.value.length &&
        !channelList.value.length &&
        !couponList.value.length &&
        !grouponList.value.length &&
        !brandList.value.length &&
        !newGoodsList.value.length &&
        !hotGoodsList.value.length &&
        !topicList.value.length
    )

    const formatPrice = (price: number) => price.toFixed(2)

    // ==================== 核心优化：Stale-While-Revalidate ====================
    const fetchHomeData = async () => {
        // 【关键】只有首次完全没有缓存数据时才显示 loading
        // 后续进入页面时 loading 保持 false，直接显示缓存
        const hasCachedData =
            bannerList.value.length > 0 ||
            channelList.value.length > 0 ||
            couponList.value.length > 0 ||
            grouponList.value.length > 0 ||
            brandList.value.length > 0 ||
            newGoodsList.value.length > 0 ||
            hotGoodsList.value.length > 0 ||
            topicList.value.length > 0

        if (!hasCachedData) {
            loading.value = true
        }
        // else: 已有缓存 → 立即渲染，后台静默刷新

        try {
            const res = await GetHome()
            if (res?.data) {
                const newData = res.data

                const hasChanged =
                    JSON.stringify(bannerList.value) !== JSON.stringify(newData.banner || []) ||
                    JSON.stringify(channelList.value) !== JSON.stringify(newData.channel || []) ||
                    JSON.stringify(couponList.value) !== JSON.stringify(newData.couponList || []) ||
                    JSON.stringify(grouponList.value) !== JSON.stringify(newData.grouponList || []) ||
                    JSON.stringify(brandList.value) !== JSON.stringify(newData.brandList || []) ||
                    JSON.stringify(newGoodsList.value) !== JSON.stringify(newData.newGoodsList || []) ||
                    JSON.stringify(hotGoodsList.value) !== JSON.stringify(newData.hotGoodsList || []) ||
                    JSON.stringify(topicList.value) !== JSON.stringify(newData.topicList || [])

                if (hasChanged) {
                    bannerList.value = newData.banner || []
                    channelList.value = newData.channel || []
                    couponList.value = newData.couponList || []
                    grouponList.value = newData.grouponList || []
                    brandList.value = newData.brandList || []
                    newGoodsList.value = newData.newGoodsList || []
                    hotGoodsList.value = newData.hotGoodsList || []
                    topicList.value = newData.topicList || []

                    console.log('[Home Store] 数据有变化，已更新')
                } else {
                    console.log('[Home Store] 数据与缓存一致，后台刷新完成')
                }
            }
        } catch (err: any) {
            errorMsg.value = err.message || '首頁資料加載失敗'
            console.error(err)
        } finally {
            loading.value = false
        }
    }

    return {
        bannerList,
        channelList,
        couponList,
        grouponList,
        brandList,
        newGoodsList,
        hotGoodsList,
        topicList,
        loading,
        errorMsg,
        isEmpty,
        formatPrice,
        fetchHomeData
    }
}, {
    persist: {
        key: 'cache:home',
        paths: [
            'bannerList', 'channelList', 'couponList', 'grouponList',
            'brandList', 'newGoodsList', 'hotGoodsList', 'topicList'
        ]
    }
})