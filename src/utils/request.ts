import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
export const httpRequest = axios.create({
    //   baseURL: '',
    timeout: 5000,
})

//请求拦截
httpRequest.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
        // 携带请求头
        // config.headers.Authorization="xxx"
        return config
    },
    (err: AxiosError) => {
        return Promise.reject(err)
    },
)

//响应拦截
httpRequest.interceptors.response.use(
    (response: AxiosResponse<any>) => {
        return response.data
    },
    (err: AxiosError) => {
        return Promise.reject(err)
    },
)
