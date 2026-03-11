<!-- src/components/GoodsDetail.vue -->
<template>
  <van-nav-bar
      title="标题"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
  />  <div class="goods-detail">
    <!-- 加载状态 -->
    <div v-if="store.initialLoading" class="loading">
      <van-loading type="spinner" color="#7232dd" size="24px">加载中...</van-loading>
    </div>

    <!-- 商品内容 -->
    <div v-else class="goods-content">
      <!-- 商品轮播图 -->
      <van-swipe class="goods-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(image, index) in store.goodsInfo?.gallery" :key="index">
          <img :src="image" :alt="store.goodsInfo?.name" @click="previewGallery(index)">
        </van-swipe-item>
      </van-swipe>

      <!-- 商品信息 -->
      <van-cell-group inset class="goods-info">
        <div class="goods-price">
          <span class="price-symbol">¥</span>
          <span class="price">{{ store.goodsInfo?.retailPrice }}</span>
          <span class="market-price" v-if="store.goodsInfo?.counterPrice">
            ¥{{ store.goodsInfo?.counterPrice }}
          </span>
        </div>
        <div class="goods-title">{{ store.goodsInfo?.name }}</div>
        <div class="goods-brief">{{ store.goodsInfo?.brief }}</div>

        <!-- 品牌信息 -->
        <div v-if="store.brand?.id" class="brand-info" @click="goToBrand">
          <img :src="store.brand.picUrl" :alt="store.brand.name" class="brand-logo">
          <div class="brand-desc">
            <div class="brand-name">{{ store.brand.name }}</div>
            <div class="brand-desc-text">{{ store.brand.desc }}</div>
          </div>
          <van-icon name="arrow" class="brand-arrow" />
        </div>
      </van-cell-group>

      <!-- 商品规格 -->
      <van-cell-group inset class="sku-section" v-if="store.specificationList.length > 0">
        <van-cell
            title="选择规格"
            is-link
            @click="store.showSku = true"
            :value="store.selectedSkuText || '请选择'"
        />
      </van-cell-group>

      <!-- 商品属性 -->
      <van-cell-group inset class="attribute-section" v-if="store.attributeList.length > 0">
        <van-cell title="商品参数" />
        <van-cell
            v-for="(attr, index) in store.attributeList"
            :key="index"
            :title="attr.attribute"
            :value="attr.value"
            class="attribute-item"
        />
      </van-cell-group>

      <!-- 商品详情图文 -->
      <van-cell-group inset class="detail-section" v-if="store.detailImages.length > 0">
        <van-cell title="商品详情" />
        <div class="detail-content">
          <img
              v-for="(imgSrc, idx) in store.detailImages"
              :key="idx"
              :src="imgSrc"
              alt="商品详情图"
              @click="store.previewDetailImage(idx)"
          />
        </div>
      </van-cell-group>

      <!-- 常见问题 -->
      <van-cell-group inset class="issue-section" v-if="store.issueList.length > 0">
        <van-cell title="常见问题" />
        <van-collapse v-model="store.activeIssue">
          <van-collapse-item
              v-for="(issue, index) in store.issueList"
              :key="index"
              :title="issue.question"
              :name="index"
          >
            {{ issue.answer }}
          </van-collapse-item>
        </van-collapse>
      </van-cell-group>

      <!-- 商品评价 -->
      <van-cell-group inset class="comment-section" v-if="store.commentData?.count > 0">
        <van-cell
            title="商品评价"
            :value="`${store.commentData.count}条评价`"
            is-link
            @click="goToComment"
        />
        <div v-if="store.commentData.data?.length" class="comment-item">
          <template v-if="store.commentData.data[0]">
            <div class="comment-user">
              <van-icon name="user-circle-o" size="20" />
              <span class="user-name">{{ store.commentData.data[0].nickname }}</span>
              <span class="comment-time">{{ formatTime(store.commentData.data[0].addTime) }}</span>
            </div>
            <div class="comment-content">{{ store.commentData.data[0].content }}</div>
            <div v-if="store.commentData.data[0].picList?.length" class="comment-pics">
              <van-image
                  v-for="(pic, idx) in store.commentData.data[0].picList"
                  :key="idx"
                  :src="pic"
                  width="60"
                  height="60"
                  fit="cover"
                  @click="previewCommentImage(store.commentData.data[0].picList, idx)"
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
            :badge="store.cartCount > 0 ? store.cartCount : ''"
            @click="goToCart"
        />
        <van-action-bar-icon
            :icon="store.userHasCollect ? 'star' : 'star-o'"
            :text="store.userHasCollect ? '已收藏' : '收藏'"
            @click="store.toggleFavorite"
        />
        <van-action-bar-button
            type="warning"
            text="加入购物车"
            :loading="store.isAddingToCart"
            @click="handleAddToCart"
        />
        <van-action-bar-button
            type="danger"
            text="立即购买"
            :loading="store.isBuyingNow"
            @click="handleBuyNow"
        />
      </van-action-bar>

      <!-- 规格选择弹窗 -->
      <van-action-sheet
          v-model:show="store.showSku"
          title="选择规格"
          :close-on-click-action="false"
          @closed="handleSkuClosed"
      >
        <div class="sku-content">
          <!-- 已选规格预览 -->
          <div class="selected-sku-preview" v-if="store.selectedSkuText">
            <span>已选：{{ store.selectedSkuText }}</span>
          </div>

          <!-- 规格选项 -->
          <div v-for="(spec, index) in store.specificationList" :key="index" class="sku-item">
            <div class="sku-name">{{ spec.name }}</div>
            <div class="sku-values">
              <van-button
                  v-for="(valueItem, vIndex) in spec.valueList"
                  :key="vIndex"
                  :type="store.selectedSku[spec.name] === valueItem.value ? 'primary' : 'default'"
                  size="small"
                  plain
                  @click="store.selectSku(spec.name, valueItem.value)"
              >
                {{ valueItem.value }}
              </van-button>
            </div>
          </div>

          <!-- 库存和价格信息 -->
          <div class="sku-info" v-if="store.currentProduct">
            <div class="sku-price">价格：¥{{ store.currentProduct.price }}</div>
            <div class="sku-stock">库存：{{ store.currentProduct.number }}件</div>
          </div>

          <!-- 购买数量 -->
          <div class="sku-quantity">
            <span>购买数量</span>
            <van-stepper
                v-model="store.quantity"
                min="1"
                :max="store.currentProduct?.number || 0"
                @change="store.handleQuantityChange"
            />
          </div>

          <!-- 操作按钮 -->
          <div class="sku-actions">
            <van-button
                type="primary"
                block
                @click="handleSkuConfirm"
                :disabled="!store.currentProduct || store.currentProduct.number <= 0"
                :loading="store.isAddingToCart || store.isBuyingNow"
            >
              {{ getSkuButtonText }}
            </van-button>
          </div>
        </div>
      </van-action-sheet>

      <!-- 图片预览 -->
      <van-image-preview
          v-model:show="store.showPreview"
          :images="store.previewImages"
          :start-position="store.previewIndex"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { showConfirmDialog } from 'vant'
import { useRouter } from 'vue-router'
import { useGoodsDetailStore } from '@/stores/goodsDetail'

const onClickLeft = () => history.back();

// Props定义
const props = defineProps<{
  goodsId: number | string | undefined
}>()

const router = useRouter()
const store = useGoodsDetailStore()

// 计算属性
const getSkuButtonText = computed(() => {
  if (!store.currentProduct) return '请选择规格'
  if (store.currentProduct.number <= 0) return '库存不足'
  return '确 定'
})

// 方法
const handleContact = () => {
  router.push('/customer-service')
}

const goToBrand = () => {
  if (store.brand?.id) {
    router.push(`/brand/${store.brand.id}`)
  }
}

const goToCart = () => {
  router.push('/cart')
}

const goToComment = () => {
  router.push(`/goods/${props.goodsId}/comment`)
}

const formatTime = (time: string): string => {
  if (!time) return ''
  return time?.split(' ')[0] ?? ''
}

const previewGallery = (index: number) => {
  if (store.goodsInfo?.gallery) {
    store.previewImage(store.goodsInfo.gallery, index)
  }
}

const previewCommentImage = (images: string[], index: number) => {
  store.previewImage(images, index)
}

const handleAddToCart = async () => {
  const result = await store.addToCartAction()
  if (result.errno === 0) {
    showConfirmDialog({
      title: '提示',
      message: '商品已加入购物车，是否前往购物车查看？'
    }).then(() => {
      router.push('/cart')
    }).catch(() => {
      // 用户取消，不做处理
    })
  }
}

const handleBuyNow = async () => {
  await store.fastBuyAction()
}

const handleSkuConfirm = () => {
  if (store.confirmSku()) {
    // 可以在这里添加确认后的逻辑
  }
}

const handleSkuClosed = () => {
  // 可以在这里添加弹窗关闭后的逻辑
}
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