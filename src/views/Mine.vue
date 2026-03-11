<!-- Mine.vue -->
<template>
  <div class="tabbar-user view-router">
    <!-- 头部用户信息 -->
    <div class="user_header">
      <i class="user_set van-icon van-icon-setting"></i>
      <div class="user_avatar">
        <img
            src="#"
            alt="头像"
            width="55"
            height="55"
        />
      </div>
      <div>用户123</div>
    </div>

    <!-- 我的订单部分 -->
    <div>
      <van-cell-group>
        <van-cell
            title="我的订单"
            is-link
            label="全部订单"
            to="/user/order/list/0"
            value-class="text-desc"
        />
      </van-cell-group>

      <div class="order_status van-row">
        <div class="van-col van-col--6">
          <div class="order_status_icon">
            <van-icon name="pending-payment" size="24" />
          </div>
          <div>待付款</div>
        </div>
        <div class="van-col van-col--6">
          <div class="order_status_icon">
            <van-icon name="description" size="24" />
          </div>
          <div>待发货</div>
        </div>
        <div class="van-col van-col--6">
          <div class="order_status_icon">
            <van-icon name="logistics" size="24" />
          </div>
          <div>待收货</div>
        </div>
        <div class="van-col van-col--6">
          <div class="order_status_icon">
            <van-icon name="passed" size="24" />
          </div>
          <div>已完成</div>
        </div>
      </div>
    </div>

    <!-- 我的优惠券部分 -->
    <div>
      <van-cell-group>
        <van-cell
            title="我的优惠券"
            is-link
            label="全部优惠券"
            to="/user/coupon/list/0"
            value-class="text-desc"
        />
      </van-cell-group>

      <div class="coupon_status van-row">
        <div class="van-col van-col--8">
          <div class="coupon_status_icon">
            <van-icon name="coupon" size="24" />
          </div>
          <div>待使用</div>
        </div>
        <div class="van-col van-col--8">
          <div class="coupon_status_icon">
            <van-icon name="coupon" size="24" color="#ee0a24" />
          </div>
          <div>已使用</div>
        </div>
        <div class="van-col van-col--8">
          <div class="coupon_status_icon">
            <van-icon name="closed" size="24" />
          </div>
          <div>过期关闭</div>
        </div>
      </div>
    </div>

    <!-- 其他模块 -->
    <div class="user_module">
      <van-cell-group>
        <van-cell title="我的收藏" is-link to="/user/favorite" icon="star" />
        <van-cell title="收货地址" is-link to="/user/address" icon="location" />
        <van-cell title="服务中心" is-link to="/service" icon="service" />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// 如果后续需要动态数据，可以在这里定义
// const userInfo = ref({ name: '用户123', avatar: '...' })
</script>

<style scoped>
.tabbar-user {
  min-height: 100vh;
  background: #f7f8fa;
}

.user_header {
  position: relative;
  padding: 40px 16px 20px;
  background: #ff4d4f; /* 红色背景，跟截图一致 */
  color: white;
  text-align: center;
  font-size: 16px;
}

.user_set {
  position: absolute;
  right: 16px;
  top: 40px;
  font-size: 24px;
}

.user_avatar {
  margin: 0 auto 8px;
}

.user_avatar img {
  border-radius: 50%;
  border: 3px solid #fff;
}

.order_status,
.coupon_status {
  padding: 16px 0;
  text-align: center;
  background: #fff;
}

.order_status_icon,
.coupon_status_icon {
  margin-bottom: 8px;
  font-size: 28px;
  color: #1989fa; /* 可根据实际主题调整颜色 */
}

.text-desc {
  color: #969799;
  font-size: 14px;
}

.van-col--6 div,
.van-col--8 div {
  font-size: 13px;
  color: #323233;
}

.van-cell__value {
  flex: none;
}

.user_module {
  margin-top: 12px;
}
</style>