export interface GoodsItem {
    id: number
    name: string
    brief: string
    picUrl: string
    isNew: boolean
    isHot: boolean
    counterPrice: number
    retailPrice: number
}

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
    errno: number
    data: GoodsListData
    errmsg: string
}