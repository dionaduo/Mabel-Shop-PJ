import { httpRequest } from '@/utils/request'
import type { LoginParams, LoginResult, ApiResponse } from '@/types/mine/login.ts'

/**
 * 用户登录
 * @param data 用户名和密码
 * @returns Promise
 */
export const login = (data: LoginParams): Promise<ApiResponse<LoginResult>> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/auth/login',
        method: 'POST',
        data
    })
}