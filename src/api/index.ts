import { httpRequest } from '@/utils/request'
import type { HomeData, ApiResponse } from '../../types/shopData'

export const GetHome = (): Promise<ApiResponse<HomeData>> => {
    return httpRequest({
        url: 'api/wx/home/index',
        method: 'GET',
    })
}