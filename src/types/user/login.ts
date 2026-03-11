/**
 * 登录请求参数
 */
export interface LoginParams {
    username: string
    password: string
}

/**
 * 用户信息
 */
export interface UserInfo {
    nickName: string
    avatarUrl: string
}

/**
 * 登录响应数据
 */
export interface LoginResult {
    userInfo: UserInfo
    token: string
}

/**
 * API 统一响应格式
 */
export interface ApiResponse<T = any> {
    errno: number
    data: T
    errmsg: string
}