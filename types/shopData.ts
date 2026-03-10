// 商品基础接口
export interface GoodsItem {
    id: number
    name: string
    brief: string
    picUrl: string
    isNew: boolean
    isHot: boolean
    counterPrice: number
    retailPrice: number
}

// 优惠券接口
export interface CouponItem {
    id: number
    name: string
    desc: string
    tag: string
    discount: number
    min: number
    days: number
}

// 频道接口
export interface ChannelItem {
    id: number
    name: string
    iconUrl: string
}

// 团购接口
export interface GrouponItem {
    id: number
    name: string
    brief: string
    picUrl: string
    counterPrice: number
    retailPrice: number
    grouponPrice: number
    grouponDiscount: number
    grouponMember: number
    expireTime: string
}

// 轮播图接口
export interface BannerItem {
    id: number
    name: string
    link: string
    url: string
    position: number
    content: string
    enabled: boolean
    addTime: string
    updateTime: string
    deleted: boolean
}

// 品牌接口
export interface BrandItem {
    id: number
    name: string
    desc: string
    picUrl: string
    floorPrice: number
}

// 专题接口
export interface TopicItem {
    id: number
    title: string
    subtitle: string
    price: number
    readCount: string
    picUrl: string
}

// 楼层分类接口
export interface FloorItem {
    name: string
    goodsList: GoodsItem[]
    id: number
}

// 首页数据主接口
export interface HomeData {
    newGoodsList: GoodsItem[]
    couponList: CouponItem[]
    channel: ChannelItem[]
    grouponList: GrouponItem[]
    banner: BannerItem[]
    brandList: BrandItem[]
    hotGoodsList: GoodsItem[]
    topicList: TopicItem[]
    floorGoodsList: FloorItem[]
}

// 响应接口
export interface ApiResponse<T = HomeData> {
    errno: number
    data: T
    errmsg: string
}