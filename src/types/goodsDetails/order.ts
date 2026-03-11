// ============ 地址相关类型 ============

// 地址项接口
export interface AddressItem {
    id: number
    name: string
    userId: number
    province: string
    city: string
    county: string
    addressDetail: string
    areaCode: string
    postalCode: string
    tel: string
    isDefault: boolean
    addTime: string
    updateTime: string
    deleted: boolean
}

// 地址列表响应
export interface AddressListResponse {
    errno: number
    data: {
        total: number
        pages: number
        limit: number
        page: number
        list: AddressItem[]
    }
    errmsg: string
}

// 保存地址参数
export interface AddressSaveParams {
    id?: number
    name: string
    tel: string
    province: string
    city: string
    county: string
    areaCode: string
    addressDetail: string
    isDefault?: boolean
    postalCode?: string
}

// 保存地址响应
export interface AddressSaveResponse {
    errno: number
    data: {
        id: number
    }
    errmsg: string
}

// ============ 优惠券相关类型 ============

// 优惠券选择参数
export interface CouponSelectParams {
    cartId: number
    grouponRulesId?: number
}

// 优惠券项接口
export interface CouponItem {
    id: number
    name: string
    desc: string
    tag: string
    discount: number
    min: number
    days: number
}

// 优惠券选择响应
export interface CouponSelectResponse {
    errno: number
    data: CouponItem[]
    errmsg: string
}

// ============ 购物车结算相关类型 ============

// 结算商品项接口
export interface CheckedGoodsItem {
    id: number
    userId: number
    goodsId: number
    goodsSn: string
    goodsName: string
    productId: number
    price: number
    number: number
    specifications: string[]
    checked: boolean
    picUrl: string
    addTime: string
    updateTime: string
    deleted: boolean
}

// 购物车结算响应
export interface CartCheckoutResponse {
    errno: number
    data: {
        grouponRulesId: number
        actualPrice: number
        orderTotalPrice: number
        cartId: number
        userCouponId: number
        couponId: number
        goodsTotalPrice: number
        addressId: number
        grouponPrice: number
        checkedAddress: AddressItem
        couponPrice: number
        availableCouponLength: number
        freightPrice: number
        checkedGoodsList: CheckedGoodsItem[]
    }
    errmsg: string
}

// ============ 订单相关类型 ============

// 订单提交参数
export interface OrderSubmitParams {
    cartId: number
    addressId: number
    couponId?: number
    userCouponId?: number
    grouponRulesId?: number
    message?: string
}

// 订单提交响应
export interface OrderSubmitResponse {
    errno: number
    data: {
        orderId: number
        grouponLinkId: number
        payed: boolean
    }
    errmsg: string
}

// 订单操作选项
export interface HandleOption {
    cancel: boolean
    delete: boolean
    pay: boolean
    comment: boolean
    confirm: boolean
    refund: boolean
    rebuy: boolean
    aftersale: boolean
}

// 订单信息接口
export interface OrderInfo {
    consignee: string
    address: string
    addTime: string
    orderSn: string
    actualPrice: number
    mobile: string
    message: string
    orderStatusText: string
    aftersaleStatus: number
    goodsPrice: number
    couponPrice: number
    id: number
    freightPrice: number
    handleOption: HandleOption
}

// 订单商品接口
export interface OrderGoodsItem {
    id: number
    orderId: number
    goodsId: number
    goodsName: string
    goodsSn: string
    productId: number
    number: number
    price: number
    specifications: string[]
    picUrl: string
    comment: number
    addTime: string
    updateTime: string
    deleted: boolean
}

// 订单详情响应
export interface OrderDetailResponse {
    errno: number
    data: {
        expressInfo: any[]
        orderInfo: OrderInfo
        orderGoods: OrderGoodsItem[]
    }
    errmsg: string
}

// 支付参数
export interface OrderPayParams {
    orderId: number
    payType?: 'wechat' | 'alipay'
}

// 支付响应
export interface OrderPayResponse {
    errno: number
    data: {
        paySign?: string
        timestamp?: string
        nonceStr?: string
        prepayId?: string
        signType?: string
        package?: string
        payUrl?: string
        mwebUrl?: string
    }
    errmsg: string
}