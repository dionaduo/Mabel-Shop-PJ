// src/stores/goodsDetail.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getGoodsDetail, addToCart, fastAddToCart, getCartCount, toggleCollect } from '@/api/goodDetails/goods'
import type {
    GoodsInfo,
    SpecificationItem,
    ProductItem,
    AttributeItem,
    IssueItem,
    CommentData,
    BrandItem,
    AddCartParams
} from '@/types/goodsDetails/goodsDetail'
import { showToast } from 'vant'
import { useRouter } from 'vue-router'

export const useGoodsDetailStore = defineStore('goodsDetail', () => {
    const router = useRouter()

    // ==================== 状态 ====================
    const goodsInfo = ref<GoodsInfo | undefined>(undefined)
    const specificationList = ref<SpecificationItem[]>([])
    const productList = ref<ProductItem[]>([])
    const attributeList = ref<AttributeItem[]>([])
    const issueList = ref<IssueItem[]>([])
    const commentData = ref<CommentData>({ data: [], count: 0 })
    const brand = ref<BrandItem | null>(null)
    const userHasCollect = ref(0)
    const detailImages = ref<string[]>([])
    const cartCount = ref(0)
    const loading = ref(false)
    const initialLoading = ref(false)

    // 规格选择
    const selectedSku = ref<Record<string, string>>({})
    const quantity = ref(1)
    const showSku = ref(false)

    // UI 状态
    const showPreview = ref(false)
    const previewImages = ref<string[]>([])
    const previewIndex = ref(0)
    const activeIssue = ref<number[]>([])
    const isAddingToCart = ref(false)
    const isBuyingNow = ref(false)

    // ==================== 计算属性 ====================
    const selectedSkuText = computed(() => Object.values(selectedSku.value).join(' '))

    const currentProduct = computed(() => {
        if (Object.keys(selectedSku.value).length === 0) return null
        const specs = Object.values(selectedSku.value)
        return productList.value.find(p =>
            p.specifications.length === specs.length &&
            p.specifications.every(s => specs.includes(s))
        )
    })

    const canAddToCart = computed(() => {
        if (specificationList.value.length > 0 && !currentProduct.value) return false
        return currentProduct.value ? currentProduct.value.number > 0 : true
    })

    // ==================== 方法 ====================
    const extractImages = (html: string): string[] => {
        if (!html) return []
        const div = document.createElement('div')
        div.innerHTML = html
        return Array.from(div.querySelectorAll('img')).map(img => img.src)
    }

    const fetchGoodsDetail = async (id: number | string) => {
        initialLoading.value = true
        loading.value = true
        try {
            const res = await getGoodsDetail(Number(id))
            if (res.errno === 0 && res.data) {
                const d = res.data
                goodsInfo.value = d.info
                specificationList.value = d.specificationList || []
                productList.value = d.productList || []
                attributeList.value = d.attribute || []
                issueList.value = d.issue || []
                commentData.value = d.comment || { data: [], count: 0 }
                brand.value = d.brand && Object.keys(d.brand).length ? d.brand : null
                userHasCollect.value = d.userHasCollect || 0

                // 提取详情图
                if (d.info?.detail) {
                    detailImages.value = extractImages(d.info.detail)
                }

                // 单规格自动选中
                if (specificationList.value.length === 1 &&
                    specificationList.value[0]?.valueList.length === 1) {
                    const spec = specificationList.value[0]
                    selectSku(spec.name, spec.valueList?.[0]?.value || '')
                }
            } else {
                showToast(res.errmsg || '获取商品信息失败')
            }
        } catch (err) {
            showToast('网络错误，请稍后重试')
            console.error('获取商品详情失败:', err)
        } finally {
            loading.value = false
            initialLoading.value = false
        }
    }

    const fetchCartCount = async () => {
        try {
            const res = await getCartCount()
            if (res.errno === 0) cartCount.value = res.data
        } catch (err) {
            console.error('获取购物车数量失败:', err)
        }
    }

    const selectSku = (key: string, value: string) => {
        selectedSku.value[key] = value
    }

    const resetSku = () => {
        selectedSku.value = {}
        quantity.value = 1
    }

    const handleQuantityChange = (value: number) => {
        quantity.value = value
    }

    const confirmSku = (): boolean => {
        if (!currentProduct.value) {
            showToast('请选择完整的商品规格')
            return false
        }
        if (currentProduct.value.number <= 0) {
            showToast('该规格库存不足')
            return false
        }
        showSku.value = false
        showToast('已选择规格：' + selectedSkuText.value)
        return true
    }

    const addToCartAction = async () => {
        if (specificationList.value.length > 0 && !currentProduct.value) {
            showSku.value = true
            return { errno: -1, needShowSku: true }
        }

        if (!currentProduct.value && !productList.value[0]) {
            showToast('商品信息不完整')
            return { errno: -1 }
        }

        const product = currentProduct.value || productList.value[0]
        if (!product) {
            showToast('商品信息不完整')
            return { errno: -1 }
        }
        if (product.number <= 0) {
            showToast('库存不足')
            return { errno: -1 }
        }

        isAddingToCart.value = true
        try {
            const params: AddCartParams = {
                goodsId: Number(goodsInfo.value?.id),
                productId: product.id,
                number: quantity.value
            }
            const res = await addToCart(params)
            if (res.errno === 0) {
                await fetchCartCount()
                showToast('已加入购物车')
                return res
            } else {
                showToast(res.errmsg || '加入购物车失败')
                return res
            }
        } catch (err: any) {
            showToast(err.message || '加入购物车失败')
            return { errno: -1, errmsg: err.message }
        } finally {
            isAddingToCart.value = false
        }
    }

    const fastBuyAction = async () => {
        if (specificationList.value.length > 0 && !currentProduct.value) {
            showSku.value = true
            return { errno: -1, needShowSku: true }
        }

        if (!currentProduct.value && !productList.value[0]) {
            showToast('商品信息不完整')
            return { errno: -1 }
        }

        const product = currentProduct.value || productList.value[0]
        if (!product) {
            showToast('商品信息不完整')
            return { errno: -1 }
        }
        if (product.number <= 0) {
            showToast('库存不足')
            return { errno: -1 }
        }

        isBuyingNow.value = true
        try {
            const params: AddCartParams = {
                goodsId: Number(goodsInfo.value?.id),
                productId: product.id,
                number: quantity.value
            }
            const res = await fastAddToCart(params)
            if (res.errno === 0 && res.data.cartId) {
                router.push({
                    path: '/order/checkout',
                    query: { cartId: res.data.cartId.toString() }
                })
            } else {
                showToast(res.errmsg || '购买失败')
            }
            return res
        } catch (err: any) {
            showToast(err.message || '购买失败')
            return { errno: -1, errmsg: err.message }
        } finally {
            isBuyingNow.value = false
        }
    }

    const toggleFavorite = async () => {
        if (!goodsInfo.value?.id) return

        try {
            const type = userHasCollect.value === 1 ? 'delete' : 'add'
            await toggleCollect(Number(goodsInfo.value.id), type)
            userHasCollect.value = userHasCollect.value === 1 ? 0 : 1
            showToast(userHasCollect.value ? '收藏成功' : '已取消收藏')
        } catch (err) {
            showToast('操作失败，请重试')
            console.error('收藏操作失败:', err)
        }
    }

    // 图片预览
    const previewImage = (images: string[], index: number) => {
        previewImages.value = images
        previewIndex.value = index
        showPreview.value = true
    }

    const previewDetailImage = (index: number) => {
        previewImage(detailImages.value, index)
    }

    // 重置所有状态（切换商品时使用）
    const reset = () => {
        goodsInfo.value = undefined
        specificationList.value = []
        productList.value = []
        attributeList.value = []
        issueList.value = []
        commentData.value = { data: [], count: 0 }
        brand.value = null
        userHasCollect.value = 0
        detailImages.value = []
        selectedSku.value = {}
        quantity.value = 1
        showSku.value = false
        activeIssue.value = []
    }

    return {
        // 数据
        goodsInfo,
        specificationList,
        productList,
        attributeList,
        issueList,
        commentData,
        brand,
        userHasCollect,
        detailImages,
        cartCount,
        loading,
        initialLoading,

        // 规格相关
        selectedSku,
        quantity,
        showSku,
        selectedSkuText,
        currentProduct,
        canAddToCart,

        // UI 状态
        showPreview,
        previewImages,
        previewIndex,
        activeIssue,
        isAddingToCart,
        isBuyingNow,

        // 方法
        fetchGoodsDetail,
        fetchCartCount,
        selectSku,
        resetSku,
        handleQuantityChange,
        confirmSku,
        addToCartAction,
        fastBuyAction,
        toggleFavorite,
        previewImage,
        previewDetailImage,
        reset
    }
})