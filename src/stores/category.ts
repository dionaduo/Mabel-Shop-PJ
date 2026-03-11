// src/stores/category.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { GetHome, GetCategory } from '@/api'
import type { ChannelItem } from '@/types/home/homeData.ts'
import type { Category } from '@/types/goodsDetails/category.ts'

export const useCategoryStore = defineStore('category', () => {
    const channelList = ref<ChannelItem[]>([])
    const activeIndex = ref(0)

    const currentCategory = ref<Category | null>(null)
    const currentSubCategory = ref<Category[]>([])

    const loading = ref(false)
    const errorMsg = ref<string | null>(null)

    // ==================== 左侧主分类 ====================
    const fetchChannels = async () => {
        // 已有缓存时不显示 loading
        const hasCachedChannels = channelList.value.length > 0

        try {
            const res = await GetHome()
            if (res?.data?.channel) {
                const newChannels = res.data.channel

                if (JSON.stringify(channelList.value) !== JSON.stringify(newChannels)) {
                    channelList.value = newChannels
                    console.log('[Category Store] 主分類已更新')
                }

                // 自动加载最后一次查看的子分类（或第一个）
                if (channelList.value.length > 0) {
                    const targetId = channelList.value[activeIndex.value]?.id ?? channelList.value[0]?.id
                    if (targetId) {
                        await fetchSubCategory(targetId)
                    } else {
                        // 处理异常情况（理论上不会发生，但为了类型安全）
                        console.warn('无法获取有效的分类ID')
                    }
                }
            }
        } catch (err) {
            console.error('載入主分類失敗', err)
        }
    }

    // ==================== 右侧子分类（关键优化） ====================
    const fetchSubCategory = async (id: number) => {
        // 【关键】如果当前已缓存该分类的子数据，就不显示 loading
        const hasCachedSub = currentCategory.value?.id === id && currentSubCategory.value.length > 0

        if (!hasCachedSub) {
            loading.value = true
        }

        try {
            const res = await GetCategory(id)
            if (res?.data) {
                const { currentCategory: main, currentSubCategory: subs } = res.data

                const newMain = main || null
                const newSubs = subs || []

                const mainChanged = JSON.stringify(currentCategory.value) !== JSON.stringify(newMain)
                const subsChanged = JSON.stringify(currentSubCategory.value) !== JSON.stringify(newSubs)

                if (mainChanged || subsChanged) {
                    currentCategory.value = newMain
                    currentSubCategory.value = newSubs
                    console.log(`[Category Store] 子分類 ${id} 已更新`)
                } else {
                    console.log(`[Category Store] 子分類 ${id} 与缓存一致`)
                }
            }
        } catch (err) {
            errorMsg.value = '子分類加載失敗'
            console.error(err)
        } finally {
            loading.value = false
        }
    }

    const switchCategory = async (id: number, index: number) => {
        activeIndex.value = index
        await fetchSubCategory(id)
    }

    return {
        channelList,
        activeIndex,
        currentCategory,
        currentSubCategory,
        loading,
        errorMsg,
        fetchChannels,
        fetchSubCategory,
        switchCategory
    }
}, {
    persist: {
        key: 'cache:category',
        paths: [
            'channelList',
            'currentCategory',      // ← 新增：记住最后查看的分类图片+描述
            'currentSubCategory',   // ← 新增：记住子分类列表（真正瞬间显示）
            'activeIndex'           // ← 新增：记住最后选中的左侧 Tab
        ]
    }
})