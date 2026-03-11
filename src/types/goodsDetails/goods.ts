// 商品列表项接口
export interface GoodsListItem {
    id: number
    name: string
    brief: string
    picUrl: string
    isNew: boolean
    isHot: boolean
    counterPrice: number
    retailPrice: number
    goodsBrief?: string
}

// 商品列表响应
export interface GoodsListResponse {
    errno: number
    data: {
        list: GoodsListItem[]
        total: number
        page: number
        limit: number
        pages: number
        filterCategory?: any[]
        goodsList?: GoodsListItem[]
    }
    errmsg: string
}

// 商品列表查询参数
export interface GoodsListParams {
    categoryId?: number
    brandId?: number
    keyword?: string
    isNew?: boolean
    isHot?: boolean
    page?: number
    limit?: number
    sort?: 'price' | 'add_time' | 'sales'
    order?: 'asc' | 'desc'
    priceMin?: number
    priceMax?: number
}