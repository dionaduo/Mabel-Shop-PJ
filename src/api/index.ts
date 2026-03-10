import { httpRequest } from '@/utils/request'
import type { HomeData, ApiResponse } from '../../types/shopData'

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