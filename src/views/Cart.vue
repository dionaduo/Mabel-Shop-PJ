<template>
  <div class="cart">
    <!-- 购物车为空 -->
    <div v-if="loading" class="loading">
      <van-loading type="spinner" color="#7232dd" size="24px">加载中...</van-loading>
    </div>

    <div v-else-if="cartList.length === 0" class="empty-cart">
      <van-icon name="cart-o" size="80" color="#ddd" />
      <p class="empty-text">购物车还是空的</p>
      <van-button type="primary" round @click="goToHome">去逛逛</van-button>
    </div>

    <!-- 购物车列表 -->
    <div v-else class="cart-content">
      <!-- 店铺分组 -->
      <div v-for="(shop, shopIndex) in groupedCart" :key="shopIndex" class="shop-section">
        <div class="shop-header">
          <van-checkbox v-model="shop.checked" @click="toggleShop(shopIndex)">
            <div class="shop-info">
              <van-icon name="shop-o" size="16" />
              <span class="shop-name">{{ shop.shopName }}</span>
            </div>
          </van-checkbox>
        </div>

        <!-- 商品列表 -->
        <div class="goods-list">
          <div v-for="item in shop.items" :key="item.id" class="goods-item">
            <van-checkbox v-model="item.checked" @click="toggleItem(item)" />

            <div class="goods-content" @click="goToGoodsDetail(item.goodsId)">
              <van-image
                  :src="item.picUrl"
                  width="80"
                  height="80"
                  fit="cover"
                  radius="4"
              />
              <div class="goods-info">
                <div class="goods-name">{{ item.goodsName }}</div>
                <div class="goods-specs">{{ item.specifications?.join(' ') }}</div>
                <div class="goods-price-row">
                  <span class="goods-price">¥{{ item.price }}</span>
                  <div class="goods-actions" v-if="!isEditMode">
                    <van-stepper
                        v-model="item.number"
                        min="1"
                        :max="item.stock || 999"
                        @change="handleNumberChange(item)"
                    />
                  </div>
                  <div class="goods-actions" v-else>
                    <van-button
                        type="danger"
                        size="small"
                        plain
                        @click.stop="handleRemoveItem(item)"
                    >
                      删除
                    </van-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 为你推荐 -->
      <div class="recommend-section" v-if="recommendList.length > 0">
        <div class="recommend-title">—— 为你推荐 ——</div>
        <div class="recommend-grid">
          <div
              v-for="item in recommendList"
              :key="item.id"
              class="recommend-item"
              @click="goToGoodsDetail(item.id)"
          >
            <van-image :src="item.picUrl" width="100%" height="120" fit="cover" />
            <div class="recommend-name">{{ item.name }}</div>
            <div class="recommend-price">¥{{ item.retailPrice }}</div>
            <van-button
                type="primary"
                size="small"
                round
                @click.stop="handleAddRecommend(item)"
            >
              加入购物车
            </van-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部结算栏 -->
    <van-action-bar v-if="cartList.length > 0" class="cart-footer">
      <div class="footer-left">
        <van-checkbox v-model="allChecked" @click="toggleAll">
          全选
        </van-checkbox>
      </div>

      <div v-if="!isEditMode" class="footer-center">
        <div class="total-price">
          合计：<span class="price">¥{{ totalPrice }}</span>
        </div>
      </div>

      <div class="footer-right">
        <van-button
            v-if="!isEditMode"
            type="danger"
            :disabled="selectedCount === 0"
            @click="handleCheckout"
        >
          结算({{ selectedCount }})
        </van-button>
        <van-button
            v-else
            type="danger"
            plain
            :disabled="selectedCount === 0"
            @click="handleBatchRemove"
        >
          删除({{ selectedCount }})
        </van-button>
      </div>
    </van-action-bar>

    <!-- 删除确认弹窗 -->
    <van-dialog
        v-model:show="showDeleteDialog"
        title="提示"
        message="确定要删除选中的商品吗？"
        show-cancel-button
        @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { showToast } from 'vant'
import { useRouter } from 'vue-router'
import { getCartList, updateCart, deleteCart, checkoutCart } from '@/api/goodDetails/cart.ts'
import { getGoodsList } from '@/api/goodDetails/goods.ts'
import type { CartItem} from '@/types/goodsDetails/cart.ts'

const router = useRouter()

// 状态定义
const loading = ref(true)
const isEditMode = ref(false)
const showDeleteDialog = ref(false)
const cartList = ref<CartItem[]>([])
const recommendList = ref<any[]>([])

// 计算属性：按店铺分组
const groupedCart = computed(() => {
  const groups: Record<string, { shopName: string; checked: boolean; items: CartItem[] }> = {}

  cartList.value.forEach(item => {
    const shopId = item.shopId || 'default'
    if (!groups[shopId]) {
      groups[shopId] = {
        shopName: item.shopName || '店铺',
        checked: false,
        items: []
      }
    }
    groups[shopId].items.push(item)
  })

  // 计算店铺的全选状态
  Object.values(groups).forEach(group => {
    group.checked = group.items.every(item => item.checked)
  })

  return Object.values(groups)
})

// 计算属性：全选状态
const allChecked = computed({
  get: () => {
    return cartList.value.length > 0 && cartList.value.every(item => item.checked)
  },
  set: (value: boolean) => {
    cartList.value.forEach(item => {
      item.checked = value
    })
  }
})

// 计算属性：选中商品数量
const selectedCount = computed(() => {
  return cartList.value.filter(item => item.checked).length
})

// 计算属性：总价
const totalPrice = computed(() => {
  return cartList.value
      .filter(item => item.checked)
      .reduce((sum, item) => sum + (item.price * item.number), 0)
      .toFixed(2)
})

// 获取购物车列表
const fetchCartList = async () => {
  try {
    loading.value = true
    const response = await getCartList()
    if (response.errno === 0) {
      cartList.value = response.data.cartList || []
      cartList.value.forEach(item => {
        item.checked = false
        item.stock = 999 // 实际应从接口获取
      })
    }
  } catch (error) {
    showToast('获取购物车失败')
  } finally {
    loading.value = false
  }
}

// 获取推荐商品
const fetchRecommend = async () => {
  try {
    const response = await getGoodsList({ isHot: true, limit: 6 })
    if (response.errno === 0) {
      recommendList.value = response.data.list || []
    }
  } catch (error) {
    console.error('获取推荐商品失败:', error)
  }
}

// 切换编辑模式
const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
}

// 切换店铺选中状态
const toggleShop = (shopIndex: number) => {
  const shop = groupedCart.value[shopIndex]
  shop.checked = !shop.checked
  shop.items.forEach(item => {
    item.checked = shop.checked
  })
}

// 切换商品选中状态
const toggleItem = (item: CartItem) => {
  item.checked = !item.checked
}

// 切换全选
const toggleAll = () => {
  allChecked.value = !allChecked.value
}

// 商品数量变更
const handleNumberChange = async (item: CartItem) => {
  try {
    await updateCart({
      id: item.id,
      number: item.number
    })
    // 更新成功
  } catch (error) {
    showToast('更新数量失败')
    // 回滚数量
    fetchCartList()
  }
}

// 删除单个商品
const handleRemoveItem = (item: CartItem) => {
  item.checked = true
  showDeleteDialog.value = true
}

// 批量删除
const handleBatchRemove = () => {
  if (selectedCount.value === 0) {
    showToast('请选择要删除的商品')
    return
  }
  showDeleteDialog.value = true
}

// 确认删除
const confirmDelete = async () => {
  try {
    const ids = cartList.value
        .filter(item => item.checked)
        .map(item => item.id)

    const response = await deleteCart({ ids })
    if (response.errno === 0) {
      showToast('删除成功')
      await fetchCartList()
      if (isEditMode.value && cartList.value.length === 0) {
        isEditMode.value = false
      }
    }
  } catch (error) {
    showToast('删除失败')
  }
}

// 去结算
const handleCheckout = async () => {
  if (selectedCount.value === 0) {
    showToast('请选择要结算的商品')
    return
  }

  try {
    // 获取选中的商品ID
    const checkedItems = cartList.value.filter(item => item.checked)
    const cartIds = checkedItems.map(item => item.id)

    // 调用结算接口
    const response = await checkoutCart({ cartIds })
    if (response.errno === 0) {
      // 跳转到订单确认页
      router.push({
        path: '/order/checkout',
        query: {
          cartIds: cartIds.join(','),
          from: 'cart'
        }
      })
    }
  } catch (error) {
    showToast('结算失败')
  }
}

// 添加推荐商品
const handleAddRecommend = async (item: any) => {
  try {
    // 调用加入购物车接口
    showToast('已加入购物车')
    // 刷新购物车列表
    await fetchCartList()
  } catch (error) {
    showToast('添加失败')
  }
}

// 跳转到商品详情
const goToGoodsDetail = (goodsId: number) => {
  router.push(`/goods/${goodsId}`)
}

// 跳转到首页
const goToHome = () => {
  router.push('/')
}

// 生命周期
onMounted(() => {
  fetchCartList()
  fetchRecommend()
})
</script>

<style scoped>
.cart {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 60px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
}

.empty-text {
  color: #999;
  font-size: 16px;
  margin: 16px 0;
}

/* 店铺分组 */
.shop-section {
  background-color: #fff;
  margin: 8px 12px;
  border-radius: 8px;
  overflow: hidden;
}

.shop-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.shop-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.shop-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

/* 商品列表 */
.goods-list {
  padding: 0 16px;
}

.goods-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.goods-item:last-child {
  border-bottom: none;
}

.goods-content {
  display: flex;
  flex: 1;
  margin-left: 12px;
  cursor: pointer;
}

.goods-info {
  flex: 1;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.goods-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods-specs {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.goods-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.goods-price {
  font-size: 16px;
  font-weight: 500;
  color: #f44;
}

.goods-actions {
  display: flex;
  align-items: center;
}

/* 推荐商品 */
.recommend-section {
  background-color: #fff;
  margin: 12px;
  padding: 16px;
  border-radius: 8px;
}

.recommend-title {
  text-align: center;
  font-size: 14px;
  color: #999;
  margin-bottom: 16px;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.recommend-item {
  text-align: center;
  cursor: pointer;
}

.recommend-name {
  font-size: 12px;
  color: #333;
  margin: 8px 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recommend-price {
  font-size: 14px;
  color: #f44;
  font-weight: 500;
  margin-bottom: 8px;
}

.recommend-item .van-button {
  width: 80px;
  height: 28px;
  font-size: 12px;
}

/* 底部结算栏 */
.cart-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.footer-left {
  flex: 0 0 auto;
}

.footer-center {
  flex: 1;
  text-align: right;
  margin-right: 12px;
}

.total-price {
  font-size: 14px;
  color: #666;
}

.price {
  font-size: 16px;
  font-weight: 500;
  color: #f44;
}

.footer-right .van-button {
  min-width: 100px;
  height: 40px;
  border-radius: 20px;
}

/* 响应式调整 */
@media (max-width: 375px) {
  .recommend-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-right .van-button {
    min-width: 80px;
  }
}
</style>