import { httpRequest } from '@/utils/request'
import type { HomeData, ApiResponse } from '@/types/home/homeData.ts'
import type {CategoryResponse} from "@/types/goodsDetails/category.ts";
export * from './goodDetails/goods.ts'
export * from './goodDetails/cart.ts'
export * from './goodDetails/address.ts'
export * from './goodDetails/coupon.ts'
export * from './goodDetails/order.ts'
export * from './category/goods.ts'
// 添加参数类型
interface RequestOptions {
    signal?: AbortSignal  // 可选的取消信号
}

export const GetHome = (options?: RequestOptions): Promise<ApiResponse<HomeData>> => {
    return httpRequest({
        url: 'api/wx/home/index',
        method: 'GET',
        ...options  // 展开 options，包含 signal
    })
}

// 获取当前分类及其子分类
export const GetCategory = (params: number, options?: {
    signal?: AbortSignal
}): Promise<CategoryResponse> => {
    return httpRequest({
        url: `api/wx/catalog/current?id=${params}`,
        method: 'GET',
        ...options
    })
}