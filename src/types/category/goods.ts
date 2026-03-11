import type { GoodsItem } from '../home/homeData.ts'

// 商品基础接口（从homeData.ts导入，避免重复定义）
export type { GoodsItem } from '../home/homeData.ts'

export interface FilterCategory {
    id: number
    name: string
    keywords?: string
    desc?: string
    pid?: number
    iconUrl?: string
    picUrl?: string
    level?: string
    sortOrder?: number
}

export interface GoodsListData {
    total: number
    pages: number
    limit: number
    page: number
    list: GoodsItem[]
    filterCategoryList: FilterCategory[]
}

export interface GoodsListResponse {
    pages: any
    filterCategoryList: never[]
    list: any
    errno: number
    data: GoodsListData
    errmsg: string
}