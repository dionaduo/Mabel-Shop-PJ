// 分类信息接口（适用于一级和二级分类）
interface Category {
    id: number
    name: string
    keywords: string
    desc: string
    pid: number
    iconUrl: string
    picUrl: string
    level: string      // 'L1' 或 'L2'
    sortOrder: number
    addTime: string
    updateTime: string
    deleted: boolean
}

// 分类数据接口
interface CategoryData {
    currentCategory: Category           // 当前选中的一级分类
    currentSubCategory: Category[]      // 对应的二级分类列表
}

// API 响应接口
interface CategoryResponse {
    errno: number
    data: CategoryData
    errmsg: string
}