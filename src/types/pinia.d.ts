import 'pinia'

declare module 'pinia' {
    export interface DefineStoreOptionsBase<S, Store> {
        /**
         * 持久化配置（由 pinia-plugin-persistedstate-2 提供）
         */
        persist?: any // 可从插件导入具体类型，例如 import type { StoreOptions } from 'pinia-plugin-persistedstate-2'
    }
}