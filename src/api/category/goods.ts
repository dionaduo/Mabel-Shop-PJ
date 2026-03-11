import { httpRequest } from '@/utils/request.ts'
import type {GoodsListResponse} from "@/types/category/goods.ts";

export const GetGoodsList = (
    categoryId: number,
    page: number = 1,
    limit: number = 10
) => {
    return httpRequest.get<GoodsListResponse>('http://hmapp.net:8080/wx/goods/list', {
        params: { categoryId, page, limit }
    })
}