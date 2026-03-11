import { httpRequest } from '@/utils/request.ts'
import type {
    GoodsDetailResponse,
    CartCountResponse,
    AddCartParams,
    AddCartResponse,
    FastAddParams,
    FastAddResponse
} from '@/types/goodsDetails/goodsDetail.ts'
import type {
    GoodsListResponse,
    GoodsListParams
} from '@/types/goodsDetails/goods.ts'

// 请求选项接口
interface RequestOptions {
    signal?: AbortSignal
}

/**
 * 获取商品详情
 * @param id 商品ID
 * @param options 请求选项
 * @description GET请求 - 获取商品详细信息
 */
export const getGoodsDetail = (id: number | string, options?: RequestOptions): Promise<GoodsDetailResponse> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/goods/detail',
        method: 'GET',
        params: { id },
        ...options
    })
}

/**
 * 获取购物车商品数量
 * @param options 请求选项
 * @description GET请求 - 获取购物车中的商品总数
 */
export const getCartCount = (options?: RequestOptions): Promise<CartCountResponse> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/cart/goodscount',
        method: 'GET',
        ...options
    })
}

/**
 * 加入购物车
 * @param data 加入购物车参数
 * @description POST请求 - 将商品加入购物车
 */
export const addToCart = (data: AddCartParams): Promise<AddCartResponse> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/cart/add',
        method: 'POST',
        data
    })
}

/**
 * 立即购买（快速加入购物车）
 * @param data 立即购买参数
 * @description POST请求 - 直接购买，快速加入购物车并跳转结算
 */
export const fastAddToCart = (data: FastAddParams): Promise<FastAddResponse> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/cart/fastadd',
        method: 'POST',
        data
    })
}

/**
 * 收藏/取消收藏商品
 * @param goodsId 商品ID
 * @param type 操作类型：add-收藏，delete-取消收藏
 * @description POST请求 - 收藏或取消收藏商品
 */
export const toggleCollect = (goodsId: number, type: 'add' | 'delete'): Promise<{ errno: number; errmsg: string }> => {
    return httpRequest({
        url: `http://hmapp.net:8080/wx/collect/${type}`,
        method: 'POST',
        data: { goodsId }
    })
}

/**
 * 获取商品列表
 * @param params 查询参数
 * @description GET请求 - 获取商品列表（支持分类、品牌、关键词筛选）
 */
export const getGoodsList = (params: GoodsListParams): Promise<GoodsListResponse> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/goods/list',
        method: 'GET',
        params
    })
}

/**
 * 获取热销商品列表
 * @param limit 数量限制，默认6
 * @description GET请求 - 获取热销商品
 */
export const getHotGoods = (limit: number = 6): Promise<GoodsListResponse> => {
    return getGoodsList({ isHot: true, limit })
}

/**
 * 获取新品商品列表
 * @param limit 数量限制，默认6
 * @description GET请求 - 获取最新商品
 */
export const getNewGoods = (limit: number = 6): Promise<GoodsListResponse> => {
    return getGoodsList({ isNew: true, limit })
}

/**
 * 根据分类获取商品列表
 * @param categoryId 分类ID
 * @param page 页码，默认1
 * @param limit 每页数量，默认10
 * @description GET请求 - 获取指定分类下的商品
 */
export const getGoodsByCategory = (categoryId: number, page: number = 1, limit: number = 10): Promise<GoodsListResponse> => {
    return getGoodsList({ categoryId, page, limit })
}

/**
 * 搜索商品
 * @param keyword 搜索关键词
 * @param page 页码，默认1
 * @param limit 每页数量，默认10
 * @description GET请求 - 根据关键词搜索商品
 */
export const searchGoods = (keyword: string, page: number = 1, limit: number = 10): Promise<GoodsListResponse> => {
    return getGoodsList({ keyword, page, limit })
}

/**
 * 获取品牌商品列表
 * @param brandId 品牌ID
 * @param page 页码，默认1
 * @param limit 每页数量，默认10
 * @description GET请求 - 获取指定品牌的商品
 */
export const getGoodsByBrand = (brandId: number, page: number = 1, limit: number = 10): Promise<GoodsListResponse> => {
    return getGoodsList({ brandId, page, limit })
}

/**
 * 获取商品评价列表
 * @param goodsId 商品ID
 * @param page 页码
 * @param limit 每页数量
 * @description GET请求 - 获取商品的所有评价
 */
export const getGoodsComments = (goodsId: number, page: number = 1, limit: number = 10): Promise<any> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/comment/list',
        method: 'GET',
        params: {
            valueId: goodsId,
            type: 0, // 0:商品评价
            page,
            limit
        }
    })
}

/**
 * 获取商品评价数量统计
 * @param goodsId 商品ID
 * @description GET请求 - 获取商品评价的统计信息
 */
export const getGoodsCommentCount = (goodsId: number): Promise<any> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/comment/count',
        method: 'GET',
        params: {
            valueId: goodsId,
            type: 0
        }
    })
}

/**
 * 获取商品关联推荐
 * @param goodsId 商品ID
 * @description GET请求 - 获取商品详情页的关联推荐商品
 */
export const getRelatedGoods = (goodsId: number): Promise<GoodsListResponse> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/goods/related',
        method: 'GET',
        params: { id: goodsId }
    })
}

/**
 * 获取商品分类列表
 * @description GET请求 - 获取所有商品分类
 */
export const getGoodsCategory = (): Promise<any> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/catalog/index',
        method: 'GET'
    })
}

/**
 * 获取当前分类及其子分类
 * @param id 分类ID
 * @description GET请求 - 获取指定分类及其子分类
 */
export const getCurrentCategory = (id: number): Promise<any> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/catalog/current',
        method: 'GET',
        params: { id }
    })
}