import { httpRequest } from '@/utils/request.ts'
import type {
    OrderSubmitParams,
    OrderSubmitResponse,
    OrderDetailResponse,
    OrderPayParams,
    OrderPayResponse
} from '@/types/goodsDetails/order.ts'

/**
 * 提交订单
 * @param data 订单信息
 * @description POST请求
 */
export const submitOrder = (data: OrderSubmitParams): Promise<OrderSubmitResponse> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/order/submit',
        method: 'POST',
        data
    })
}

/**
 * 获取订单详情
 * @param orderId 订单ID
 * @description GET请求
 */
export const getOrderDetail = (orderId: number): Promise<OrderDetailResponse> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/order/detail',
        method: 'GET',
        params: { orderId }
    })
}

/**
 * H5支付
 * @param data 支付参数
 * @description POST请求
 */
export const h5Pay = (data: OrderPayParams): Promise<OrderPayResponse> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/order/h5pay',
        method: 'POST',
        data
    })
}

/**
 * 取消订单
 * @param orderId 订单ID
 */
export const cancelOrder = (orderId: number): Promise<{ errno: number; errmsg: string }> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/order/cancel',
        method: 'POST',
        data: { orderId }
    })
}