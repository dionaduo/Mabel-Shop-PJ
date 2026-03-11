import { httpRequest } from '@/utils/request.ts'
import type {
    AddressListResponse,
    AddressSaveParams,
    AddressSaveResponse
} from '@/types/goodsDetails/order.ts'

/**
 * 获取地址列表
 * @description GET请求
 */
export const getAddressList = (): Promise<AddressListResponse> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/address/list',
        method: 'GET'
    })
}

/**
 * 保存/添加新地址
 * @param data 地址信息
 * @description POST请求
 */
export const saveAddress = (data: AddressSaveParams): Promise<AddressSaveResponse> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/address/save',
        method: 'POST',
        data
    })
}

/**
 * 删除地址
 * @param id 地址ID
 */
export const deleteAddress = (id: number): Promise<{ errno: number; errmsg: string }> => {
    return httpRequest({
        url: 'http://hmapp.net:8080/wx/address/delete',
        method: 'POST',
        data: { id }
    })
}