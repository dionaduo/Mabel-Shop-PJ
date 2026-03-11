// 购物车商品项接口
export interface CartItem {
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
    shopId?: string
    shopName?: string
    stock?: number
    addTime: string
    updateTime: string
    deleted: boolean
}

// 购物车列表响应
export interface CartListResponse {
    errno: number
    data: {
        cartList: CartItem[]
        cartTotal: {
            goodsCount: number
            goodsAmount: number
            checkedGoodsCount: number
            checkedGoodsAmount: number
        }
    }
    errmsg: string
}

// 更新购物车参数
export interface UpdateCartParams {
    id: number
    number: number
}

// 删除购物车参数
export interface DeleteCartParams {
    ids: number[]
}

// 结算参数
export interface CheckoutParams {
    cartIds: number[]
    addressId?: number
    couponId?: number
}

// 结算响应
export interface CheckoutResponse {
    errno: number
    data: {
        orderTotalPrice: number
        goodsTotalPrice: number
        freightPrice: number
        couponPrice: number
        actualPrice: number
        checkedGoodsList: CartItem[]
        checkedAddress: any
        availableCouponLength: number
    }
    errmsg: string
}