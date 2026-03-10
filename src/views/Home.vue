<template>
  <div class="container">
    <!-- 搜索区域 -->
    <div class="home search">
      <van-search v-model="search_value" placeholder="请输入搜索关键词" />
    </div>
    <!-- 轮播图 -->
    <div class="home swiper">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="red">
        <van-swipe-item v-for="item in banner_data_value.banner" :key="item.id">
          <img :src="item.url" alt="" style="width: 100%; height: 200px; object-fit: cover;" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <!--    宫格频道-->
    <van-grid :column-num="3">
      <van-grid-item v-for="item in channel_data_value.channel" :key="item.id" :icon="item.iconUrl" :text="item.name" />
    </van-grid>

    <!--    优惠卷-->
    <p>优惠卷
    <span style="float: right;">查看更多优惠卷<van-icon name="arrow" /></span>
    </p>

    <van-card
        num="2"
        price="2.00"
        desc="描述信息"
        title="商品标题"
        thumb="aaa"
    >
      <template #tags>
        <van-tag plain type="primary">标签</van-tag>
        <van-tag plain type="primary">标签</van-tag>
      </template>
    </van-card>

    <!--    团购-->
    <p>团购
      <span style="float: right;">查看更多团购<van-icon name="arrow" /></span>
    </p>
    <van-card
        v-for="item in groupon_data_value.groupon"
        :price="item.grouponPrice"
        :origin-price="item.retailPrice"
        :desc="item.brief"
        :title="item.name"
        :thumb="item.picUrl"
    >
      <template #tags>
        <van-tag plain type="primary">20人成团</van-tag>
        <van-tag plain type="danger">20元立减</van-tag>
      </template>
    </van-card>

<!--    品牌商直购-->
    <p>品牌商直购
      <span style="float: right;">检查更多品牌商<van-icon name="arrow" /></span>
    </p>
    <van-grid :border="false" :column-num="2" :gutter="3">
      <van-grid-item v-for="item in brand_data_value.brandList">
        <van-image
            :src="item.picUrl"
            style="width: 100%; height: 100%; object-fit: cover;"
        />
        <p>{{item.name}}</p>
      </van-grid-item>
    </van-grid>

<!--    新品首发-->
      <p>新品首发
        <span style="float: right;">查看更多新品<van-icon name="arrow" /></span>
      </p>
      <van-grid :border="false" :column-num="2" :gutter="3">
        <van-grid-item v-for="item in newGoods_data_value.newGoods" >
          <van-image
              :src="item.picUrl"
          />
          <p>{{item.name}}</p>
          <span style="color: greenyellow">{{item.counterPrice}}元</span>
        </van-grid-item>
      </van-grid>

<!--    人气推荐-->
    <p>人气推荐
      <span style="float: right;">查看更多人气商品<van-icon name="arrow" /></span>
    </p>
    <van-card
        v-for="item in hotGoods_data_value.hotGoods"
        :price="item.counterPrice"
        :origin-price="item.retailPrice"
        :desc="item.brief"
        :title="item.name"
        :thumb="item.picUrl"
    >
      <template #tags>
        <van-tag plain type="primary">新品</van-tag>
      </template>
    </van-card>

<!--    专题-->
    <p>专题
      <span style="float: right;">查看更多专题<van-icon name="arrow" /></span>
    </p>
    <van-grid :border="false" :column-num="2" :gutter="3">
      <van-grid-item v-for="item in topic_data_value.topic">
        <van-image
            :src="item.picUrl"
            style="width: 100%; height: 100%; object-fit: cover;"
        />
        <p style="color: #be8d52">{{item.title}}</p>
        <p style="color: #be8d52;font-size: 12px">{{item.subtitle}}</p>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script setup lang="ts">
import { GetHome } from '@/api'
import { onMounted, reactive, ref } from 'vue'
import { showToast } from 'vant'
import type {
  BannerItem,
  BrandItem,
  ChannelItem,
  CouponItem,
  GoodsItem,
  GrouponItem,
  TopicItem
} from '../../types/shopData'

const search_value = ref('')
const banner_data_value = reactive({ banner: [] as BannerItem[] })
const channel_data_value = reactive({ channel: [] as ChannelItem[]})
const coupon_data_value = reactive({ coupon: [] as CouponItem[]})
const groupon_data_value = reactive({ groupon: [] as GrouponItem[]})
const brand_data_value = reactive({ brandList: [] as BrandItem[]})
const newGoods_data_value = reactive({ newGoods: [] as GoodsItem[] })
const hotGoods_data_value = reactive({ hotGoods: [] as GoodsItem[] })
const topic_data_value = reactive({ topic: [] as TopicItem[] })

//错误信息捕捉
function errorHandler(error: any) {
  const message = error.response?.data?.errmsg || error.message || '网络错误，请检查后端服务是否启动'
  showToast(message)
}
//获取轮播图
async function getBanner() {
  try {
    const res = await GetHome()
    if (res?.data?.banner) {
      banner_data_value.banner = res.data.banner
    }
  } catch (error: any) {
    errorHandler( error)
  }
}
//获取频道文字
async function getChannel() {
  try {
    const res = await GetHome()
    if (res?.data?.channel) {
      channel_data_value.channel = res.data.channel
    }
  } catch (error: any) {
    errorHandler( error)
  }
}

//获取优惠卷数据
async function getCoupon() {
  try {
    const res = await GetHome()
    if (res?.data?.couponList) {
      coupon_data_value.coupon = res.data.couponList
    }
  } catch (error: any) {
    errorHandler(error)
  }
}

//获取团购数据
async function getGroupon() {
  try {
    const res = await GetHome()
    if (res?.data?.grouponList) {
      groupon_data_value.groupon = res.data.grouponList
    }
  } catch (error: any) {
    errorHandler(error)
  }
}

//获取品牌数据
async function getBrand() {
  try {
    const res = await GetHome()
    if (res?.data?.brandList) {
      brand_data_value.brandList = res.data.brandList
    }
  } catch (error: any) {
    errorHandler(error)
  }
}

//获取新商品数据
async function getNewGoods() {
  try {
    const res = await GetHome()
    if (res?.data?.newGoodsList) {
      newGoods_data_value.newGoods = res.data.newGoodsList
    }
  } catch (error: any) {
    errorHandler(error)
  }
}

//获取热销商品数据
async function getHotGoods() {
  try {
    const res = await GetHome()
    if (res?.data?.hotGoodsList) {
      hotGoods_data_value.hotGoods = res.data.hotGoodsList
    }
  } catch (error: any) {
    errorHandler(error)
  }
}

//获取专题数据
async function getTopic() {
  try {
    const res = await GetHome()
    if (res?.data?.topicList) {
      topic_data_value.topic = res.data.topicList
    }
  } catch (error: any) {
    errorHandler(error)
  }
}
const getData = async () => {
  await getBanner()
  await getChannel()
  await getCoupon()
  await getGroupon()
  await getBrand()
  await getNewGoods()
  await getHotGoods()
  await getTopic()
}
onMounted(async () => {
await getData()
})
</script>

<style scoped>
*{
  margin: 0 auto;
  padding: 0;
}
.container {
  min-width: 320px;
  max-width: 780px;
  padding: 10px;
  margin-bottom: 10%;
}
.home.swiper {
  margin-top: 10px;
}

.my-swipe {
  height: 200px;
}

.my-swipe img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>