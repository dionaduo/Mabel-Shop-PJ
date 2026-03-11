import { httpRequest } from '@/utils/request.ts'
import type {
    CartListResponse,
    UpdateCartParams,
    DeleteCartParams,
    CheckoutParams,
    CheckoutResponse
} from '@/types/goodsDetails/cart.ts'

/**
 * 获取购物车列表
 */
export const getCartList = (): Promise<CartListResponse> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/cart/index',
        method: 'GET'
    })
}

/**
 * 更新购物车商品数量
 * @param data
 */
export const updateCart = (data: UpdateCartParams): Promise<{ errno: number; errmsg: string }> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/cart/update',
        method: 'POST',
        data
    })
}

/**
 * 删除购物车商品
 * @param data
 */
export const deleteCart = (data: DeleteCartParams): Promise<{ errno: number; errmsg: string }> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/cart/delete',
        method: 'POST',
        data
    })
}

/**
 * 购物车结算
 * @param params
 */
export const checkoutCart = (params: CheckoutParams): Promise<CheckoutResponse> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/cart/checkout',
        method: 'GET',
        params
    })
}

/**
 * 清空购物车
 */
export const clearCart = (): Promise<{ errno: number; errmsg: string }> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/cart/clear',
        method: 'POST'
    })
}