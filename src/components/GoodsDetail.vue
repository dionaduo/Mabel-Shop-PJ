<template>
  <div class="goods-detail">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <van-loading type="spinner" color="#7232dd" size="24px">加载中...</van-loading>
    </div>

    <!-- 商品内容 -->
    <div v-else class="goods-content">
      <!-- 商品轮播图 -->
      <van-swipe class="goods-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(image, index) in goodsInfo?.gallery" :key="index">
          <img :src="image" :alt="goodsInfo?.name">
        </van-swipe-item>
      </van-swipe>

      <!-- 商品信息 -->
      <van-cell-group inset class="goods-info">
        <div class="goods-price">
          <span class="price-symbol">¥</span>
          <span class="price">{{ goodsInfo?.retailPrice }}</span>
          <span class="market-price" v-if="goodsInfo?.counterPrice">¥{{ goodsInfo?.counterPrice }}</span>
        </div>
        <div class="goods-title">{{ goodsInfo?.name }}</div>
        <div class="goods-brief">{{ goodsInfo?.brief }}</div>

        <!-- 品牌信息：仅当品牌对象存在且有 id 时显示 -->
        <div v-if="brand && brand.id" class="brand-info" @click="goToBrand">
          <img :src="brand.picUrl" :alt="brand.name" class="brand-logo">
          <div class="brand-desc">
            <div class="brand-name">{{ brand.name }}</div>
            <div class="brand-desc-text">{{ brand.desc }}</div>
          </div>
          <van-icon name="arrow" class="brand-arrow" />
        </div>
      </van-cell-group>

      <!-- 商品规格 -->
      <van-cell-group inset class="sku-section" v-if="specificationList.length > 0">
        <van-cell
            title="选择规格"
            is-link
            @click="showSku = true"
            :value="selectedSkuText || '请选择'"
        />
      </van-cell-group>

      <!-- 商品属性 -->
      <van-cell-group inset class="attribute-section" v-if="attributeList.length > 0">
        <van-cell title="商品参数" />
        <van-cell
            v-for="(attr, index) in attributeList"
            :key="index"
            :title="attr.attribute"
            :value="attr.value"
            class="attribute-item"
        />
      </van-cell-group>

      <!-- 商品详情图文：使用解析后的图片数组 -->
      <van-cell-group inset class="detail-section" v-if="detailImages.length > 0">
        <van-cell title="商品详情" />
        <div class="detail-content">
          <img
              v-for="(imgSrc, idx) in detailImages"
              :key="idx"
              :src="imgSrc"
              alt="商品详情图"
              @click="previewDetailImage(idx)"
          />
        </div>
      </van-cell-group>

      <!-- 常见问题 -->
      <van-cell-group inset class="issue-section" v-if="issueList.length > 0">
        <van-cell title="常见问题" />
        <van-collapse v-model="activeIssue">
          <van-collapse-item
              v-for="(issue, index) in issueList"
              :key="index"
              :title="issue.question"
              :name="index"
          >
            {{ issue.answer }}
          </van-collapse-item>
        </van-collapse>
      </van-cell-group>

      <!-- 商品评价 -->
      <van-cell-group inset class="comment-section" v-if="commentData?.count > 0">
        <van-cell title="商品评价" :value="`${commentData.count}条评价`" is-link @click="goToComment" />
        <div v-if="commentData.data && commentData.data.length" class="comment-item">
          <template v-if="commentData.data[0]">
            <div class="comment-user">
              <van-icon name="user-circle-o" size="20" />
              <span class="user-name">{{ commentData.data[0].nickname }}</span>
              <span class="comment-time">{{ formatTime(commentData.data[0].addTime) }}</span>
            </div>
            <div class="comment-content">{{ commentData.data[0].content }}</div>
            <div v-if="commentData.data[0].picList && commentData.data[0].picList.length" class="comment-pics">
              <van-image
                  v-for="(pic, idx) in commentData.data[0].picList"
                  :key="idx"
                  :src="pic"
                  width="60"
                  height="60"
                  fit="cover"
                  @click="previewImage(commentData.data[0].picList, idx)"
              />
            </div>
          </template>
        </div>
      </van-cell-group>

      <!-- 底部操作栏 -->
      <van-action-bar>
        <van-action-bar-icon
            icon="chat-o"
            text="客服"
            dot
            @click="handleContact"
        />
        <van-action-bar-icon
            icon="cart-o"
            text="购物车"
            :badge="cartCount > 0 ? cartCount : ''"
            @click="goToCart"
        />
        <van-action-bar-icon
            :icon="userHasCollect ? 'star' : 'star-o'"
            :text="userHasCollect ? '已收藏' : '收藏'"
            @click="toggleFavorite"
        />
        <van-action-bar-button
            type="warning"
            text="加入购物车"
            @click="handleAddToCart"
        />
        <van-action-bar-button
            type="danger"
            text="立即购买"
            @click="handleBuyNow"
        />
      </van-action-bar>

      <!-- 规格选择弹窗 -->
      <van-action-sheet v-model:show="showSku" title="选择规格" :close-on-click-action="false">
        <div class="sku-content">
          <!-- 已选规格预览 -->
          <div class="selected-sku-preview" v-if="selectedSkuText">
            <span>已选：{{ selectedSkuText }}</span>
          </div>

          <!-- 规格选项 -->
          <div v-for="(spec, index) in specificationList" :key="index" class="sku-item">
            <div class="sku-name">{{ spec.name }}</div>
            <div class="sku-values">
              <van-button
                  v-for="(valueItem, vIndex) in spec.valueList"
                  :key="vIndex"
                  :type="selectedSku[spec.name] === valueItem.value ? 'primary' : 'default'"
                  size="small"
                  plain
                  @click="selectSku(spec.name, valueItem.value)"
              >
                {{ valueItem.value }}
              </van-button>
            </div>
          </div>

          <!-- 库存和价格信息 -->
          <div class="sku-info" v-if="currentProduct">
            <div class="sku-price">价格：¥{{ currentProduct.price }}</div>
            <div class="sku-stock">库存：{{ currentProduct.number }}件</div>
          </div>

          <!-- 购买数量 -->
          <div class="sku-quantity">
            <span>购买数量</span>
            <van-stepper
                v-model="quantity"
                min="1"
                :max="currentProduct?.number || 0"
                @change="handleQuantityChange"
            />
          </div>

          <!-- 操作按钮 -->
          <div class="sku-actions">
            <van-button
                type="primary"
                block
                @click="confirmSku"
                :disabled="!currentProduct || currentProduct.number <= 0"
            >
              {{ !currentProduct ? '请选择规格' : currentProduct.number <= 0 ? '库存不足' : '确 定' }}
            </van-button>
          </div>
        </div>
      </van-action-sheet>

      <!-- 图片预览（用于评价图和详情图） -->
      <van-image-preview v-model:show="showPreview" :images="previewImages" :start-position="previewIndex">
      </van-image-preview>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from 'vue'
import {showConfirmDialog, showToast} from 'vant'
import {useRouter} from 'vue-router'
import 'vant/es/action-bar/style'
import 'vant/es/action-bar-icon/style'
import 'vant/es/action-bar-button/style'
import {addToCart, fastAddToCart, getCartCount, getGoodsDetail, toggleCollect} from '@/api/goodDetails/goods.ts'
import type {
  AddCartParams,
  AttributeItem,
  BrandItem,
  CommentData,
  GoodsInfo,
  IssueItem,
  ProductItem,
  SpecificationItem
} from '@/types/goodsDetails/goodsDetail.ts'

// Props定义
const props = defineProps<{
  goodsId: number | string
}>()

const router = useRouter()

// 状态定义
const loading = ref(true)
const showSku = ref(false)
const quantity = ref(1)
const showPreview = ref(false)
const previewImages = ref<string[]>([])
const previewIndex = ref(0)
const activeIssue = ref<number[]>([])
const cartCount = ref(0)
const isAddingToCart = ref(false)
const isBuyingNow = ref(false)

// 数据定义
const goodsInfo = ref<GoodsInfo>()
const specificationList = ref<SpecificationItem[]>([])
const productList = ref<ProductItem[]>([])
const attributeList = ref<AttributeItem[]>([])
const issueList = ref<IssueItem[]>([])
const commentData = ref<CommentData>({ data: [], count: 0 })
const brand = ref<BrandItem | null>(null)
const userHasCollect = ref(0)

// 商品详情图片数组（从富文本中提取）
const detailImages = ref<string[]>([])

// 选中的规格
const selectedSku = reactive<Record<string, string>>({})

// 计算属性
const selectedSkuText = computed(() => {
  return Object.values(selectedSku).join(' ')
})

const currentProduct = computed(() => {
  if (Object.keys(selectedSku).length === 0) return null
  const specifications = Object.values(selectedSku)
  return productList.value.find(product =>
      product.specifications.length === specifications.length &&
      product.specifications.every(spec => specifications.includes(spec))
  )
})

const canAddToCart = computed(() => {
  if (specificationList.value.length > 0 && !currentProduct.value) return false
  return currentProduct.value ? currentProduct.value.number > 0 : true
})

// 方法定义
const fetchGoodsDetail = async () => {
  try {
    loading.value = true
    const response = await getGoodsDetail(props.goodsId)

    if (response.errno === 0 && response.data) {
      const data = response.data
      goodsInfo.value = data.info
      specificationList.value = data.specificationList || []
      productList.value = data.productList || []
      attributeList.value = data.attribute || []
      issueList.value = data.issue || []
      commentData.value = data.comment || { data: [], count: 0 }
      brand.value = data.brand && Object.keys(data.brand).length ? data.brand : null // 处理空对象
      userHasCollect.value = data.userHasCollect || 0

      // 提取商品详情富文本中的图片
      if (data.info?.detail) {
        detailImages.value = extractImagesFromHtml(data.info.detail)
      }

      // 如果只有一个规格且只有一个值，自动选中
      if (specificationList.value.length === 1 &&
          specificationList?.value[0].valueList.length === 1) {
        const spec = specificationList.value[0]
        selectSku(spec.name, <string>spec.valueList[0]?.value)
      }
    } else {
      showToast(response.errmsg || '获取商品信息失败')
    }
  } catch (error) {
    showToast('网络错误，请稍后重试')
    console.error('获取商品详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 从HTML字符串中提取所有图片URL
const extractImagesFromHtml = (html: string): string[] => {
  const div = document.createElement('div')
  div.innerHTML = html
  return Array.from(div.querySelectorAll('img')).map(img => img.src)
}

const fetchCartCount = async () => {
  try {
    const response = await getCartCount()
    if (response.errno === 0) {
      cartCount.value = response.data
    }
  } catch (error) {
    console.error('获取购物车数量失败:', error)
  }
}

const selectSku = (key: string, value: string) => {
  selectedSku[key] = value
}

const handleQuantityChange = (value: number) => {
  quantity.value = value
}

const confirmSku = () => {
  if (!currentProduct.value) {
    showToast('请选择完整的商品规格')
    return
  }
  if (currentProduct.value.number <= 0) {
    showToast('该规格库存不足')
    return
  }
  showSku.value = false
  showToast('已选择规格：' + selectedSkuText.value)
}

const handleContact = () => {
  router.push('/customer-service')
}

const goToBrand = () => {
  if (brand.value && brand.value.id) {
    router.push(`/brand/${brand.value.id}`)
  }
}

const goToCart = () => {
  router.push('/cart')
}

const toggleFavorite = async () => {
  try {
    const type = userHasCollect.value === 1 ? 'delete' : 'add'
    await toggleCollect(Number(props.goodsId), type)
    userHasCollect.value = userHasCollect.value === 1 ? 0 : 1
    showToast(userHasCollect.value ? '收藏成功' : '已取消收藏')
  } catch (error) {
    showToast('操作失败，请重试')
  }
}

const handleAddToCart = async () => {
  try {
    // 如果有规格且未选择，弹出规格选择
    if (specificationList.value.length > 0 && !currentProduct.value) {
      showSku.value = true
      return
    }

    const product = currentProduct.value || productList.value[0]
    if (!product || product.number <= 0) {
      showToast('商品库存不足')
      return
    }

    isAddingToCart.value = true

    const params: AddCartParams = {
      goodsId: Number(props.goodsId),
      productId: product.id,
      number: quantity.value
    }

    const response = await addToCart(params)

    if (response.errno === 0) {
      showToast('成功加入购物车')
      await fetchCartCount()
      showConfirmDialog({
        title: '提示',
        message: '商品已加入购物车，是否前往购物车查看？',
        confirmButtonText: '去购物车',
        cancelButtonText: '继续购物'
      }).then(() => {
        router.push('/cart')
      }).catch(() => {
        // 继续购物
      })
    } else {
      showToast(response.errmsg || '加入购物车失败')
    }
  } catch (error) {
    showToast('加入购物车失败')
  } finally {
    isAddingToCart.value = false
  }
}

const handleBuyNow = async () => {
  try {
    if (specificationList.value.length > 0 && !currentProduct.value) {
      showSku.value = true
      return
    }

    const product = currentProduct.value || productList.value[0]
    if (!product || product.number <= 0) {
      showToast('商品库存不足')
      return
    }

    isBuyingNow.value = true

    const params: AddCartParams = {
      goodsId: Number(props.goodsId),
      productId: product.id,
      number: quantity.value
    }

    const response = await fastAddToCart(params)

    if (response.errno === 0 && response.data.cartId) {
      await router.push({
        path: '/order/checkout',
        query: {
          cartId: response.data.cartId.toString(),
          from: 'buynow'
        }
      })
    } else {
      showToast(response.errmsg || '创建订单失败')
    }
  } catch (error) {
    showToast('创建订单失败')
  } finally {
    isBuyingNow.value = false
  }
}

const goToComment = () => {
  router.push(`/goods/${props.goodsId}/comment`)
}

const formatTime = (time: string): string => {
  if (!time) return ''
  return time.split(' ')[0]
}

// 预览图片（通用）
const previewImage = (images: string[], index: number) => {
  previewImages.value = images
  previewIndex.value = index
  showPreview.value = true
}

// 预览详情图片（直接调用 previewImage）
const previewDetailImage = (index: number) => {
  previewImage(detailImages.value, index)
}

// 生命周期钩子
onMounted(() => {
  fetchGoodsDetail()
  fetchCartCount()
})

// 暴露方法给父组件
defineExpose({
  refresh: fetchGoodsDetail
})
</script>

<style scoped>
/* 样式基本保持不变，仅作微调 */
.goods-detail {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 100px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.goods-swipe {
  width: 100%;
  height: 375px;
}

.goods-swipe img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.goods-info {
  margin: 12px 16px;
  border-radius: 8px;
  overflow: hidden;
}

.goods-price {
  padding: 16px 16px 8px;
  border-bottom: 1px solid #f0f0f0;
}

.price-symbol {
  font-size: 14px;
  color: #f44;
  vertical-align: top;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #f44;
}

.market-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin-left: 8px;
}

.goods-title {
  font-size: 18px;
  font-weight: 500;
  padding: 8px 16px;
  line-height: 1.4;
}

.goods-brief {
  font-size: 14px;
  color: #666;
  padding: 0 16px 16px;
  line-height: 1.5;
}

.brand-info {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f8f8;
  margin-top: 8px;
  cursor: pointer;
}

.brand-logo {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 12px;
  object-fit: cover;
}

.brand-desc {
  flex: 1;
}

.brand-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.brand-desc-text {
  font-size: 12px;
  color: #999;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.brand-arrow {
  color: #999;
  margin-left: 8px;
}

.sku-section,
.attribute-section,
.detail-section,
.issue-section,
.comment-section {
  margin: 12px 16px;
  border-radius: 8px;
  overflow: hidden;
}

.attribute-item {
  font-size: 14px;
}

.attribute-item :deep(.van-cell__title) {
  color: #666;
}

.attribute-item :deep(.van-cell__value) {
  color: #333;
}

.detail-content {
  padding: 16px;
}

.detail-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 10px 0;
  cursor: pointer;
}

.comment-item {
  padding: 12px 16px;
}

.comment-user {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-left: 8px;
}

.comment-time {
  font-size: 12px;
  color: #999;
  margin-left: auto;
}

.comment-content {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 8px;
}

.comment-pics {
  display: flex;
  gap: 8px;
}

.comment-pics .van-image {
  border-radius: 4px;
  overflow: hidden;
}

/* 规格选择弹窗样式 */
.sku-content {
  padding: 20px 16px 30px;
  max-height: 70vh;
  overflow-y: auto;
}

.selected-sku-preview {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}

.sku-item {
  margin-bottom: 20px;
}

.sku-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 500;
}

.sku-values {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sku-values .van-button {
  min-width: 60px;
}

.sku-info {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  margin: 16px 0;
  font-size: 14px;
}

.sku-price {
  color: #f44;
  font-weight: 500;
}

.sku-stock {
  color: #666;
}

.sku-quantity {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.sku-quantity span {
  font-size: 14px;
  color: #333;
}

.sku-actions {
  margin-top: 20px;
}

/* 响应式调整 */
@media (max-width: 375px) {
  .goods-price .price {
    font-size: 20px;
  }
}
</style>