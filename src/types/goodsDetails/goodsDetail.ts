// 规格值接口
export interface SpecificationValue {
    id: number
    goodsId: number
    specification: string
    value: string
    picUrl: string
    addTime: string
    updateTime: string
    deleted: boolean
}

// 规格接口
export interface SpecificationItem {
    name: string
    valueList: SpecificationValue[]
}

// 货品接口
export interface ProductItem {
    id: number
    goodsId: number
    specifications: string[]
    price: number
    number: number
    url: string
    addTime: string
    updateTime: string
    deleted: boolean
}

// 商品属性接口
export interface AttributeItem {
    id: number
    goodsId: number
    attribute: string
    value: string
    addTime: string
    updateTime: string
    deleted: boolean
}

// 常见问题接口
export interface IssueItem {
    id: number
    question: string
    answer: string
    addTime: string
    updateTime: string
    deleted: boolean
}

// 评价图片接口
export interface CommentPic {
    picUrl: string
}

// 评价接口
export interface CommentItem {
    id: number
    addTime: string
    picList: string[]
    adminContent: string
    nickname: string
    avatar: string
    content: string
}

// 评价数据接口
export interface CommentData {
    data: CommentItem[]
    count: number
}

// 品牌接口（复用已有）
export interface BrandItem {
    id: number
    name: string
    desc: string
    picUrl: string
    sortOrder: number
    floorPrice: number
    addTime: string
    updateTime: string
    deleted: boolean
}

// 商品基本信息接口
export interface GoodsInfo {
    id: number
    goodsSn: string
    name: string
    categoryId: number
    brandId: number
    gallery: string[]
    keywords: string
    brief: string
    isOnSale: boolean
    sortOrder: number
    picUrl: string
    shareUrl: string
    isNew: boolean
    isHot: boolean
    unit: string
    counterPrice: number
    retailPrice: number
    addTime: string
    updateTime: string
    deleted: boolean
    detail: string
}

// 商品详情主数据接口
export interface GoodsDetailData {
    specificationList: SpecificationItem[]
    groupon: any[]
    issue: IssueItem[]
    userHasCollect: number
    shareImage: string
    comment: CommentData
    share: boolean
    attribute: AttributeItem[]
    brand: BrandItem | null
    productList: ProductItem[]
    info: GoodsInfo
}

// 商品详情响应接口
export interface GoodsDetailResponse {
    errno: number
    data: GoodsDetailData
    errmsg: string
}

// 购物车数量响应接口
export interface CartCountResponse {
    errno: number
    data: number
    errmsg: string
}
// 加入购物车参数
export interface AddCartParams {
    goodsId: number
    productId: number
    number: number
}

// 加入购物车响应
export interface AddCartResponse {
    errno: number
    data: {
        cartId?: number
        cartTotal?: {
            goodsCount: number
            goodsAmount: number
            checkedGoodsCount: number
            checkedGoodsAmount: number
        }
    }
    errmsg: string
}

// 立即购买参数（快速加入购物车）
export interface FastAddParams extends AddCartParams {}

// 立即购买响应
export interface FastAddResponse extends AddCartResponse {
    data: {
        cartId: number
    }
}