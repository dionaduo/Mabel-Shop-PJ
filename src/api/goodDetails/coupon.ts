import { httpRequest } from '@/utils/request.ts'
import type {
    CouponSelectParams,
    CouponSelectResponse
} from '@/types/goodsDetails/order.ts'

/**
 * 获取可用优惠券列表
 * @param params cartId和grouponRulesId
 * @description GET请求
 */
export const getCouponSelectList = (params: CouponSelectParams): Promise<CouponSelectResponse> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/coupon/selectlist',
        method: 'GET',
        params
    })
}