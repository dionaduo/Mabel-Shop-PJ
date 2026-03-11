export const deepClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj))
}

export const isDataEqual = (a: any, b: any): boolean => {
    return JSON.stringify(a) === JSON.stringify(b)
}

// 带过期时间（默认 1 小时，可自行调整）
const DEFAULT_EXPIRE = 1000 * 60 * 60 // 1小时

export const loadCache = <T>(key: string): T | null => {
    const str = localStorage.getItem(key)
    if (!str) return null
    try {
        const cached = JSON.parse(str) as { data: T; timestamp: number }
        // 超过过期时间仍返回缓存（stale-while-revalidate 策略）
        if (Date.now() - cached.timestamp > DEFAULT_EXPIRE) {
            console.log(`[${key}] 缓存已过期，但仍使用陈旧数据`)
        }
        return cached.data
    } catch (e) {
        localStorage.removeItem(key)
        return null
    }
}

export const saveCache = <T>(key: string, data: T) => {
    const cached = {
        data,
        timestamp: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(cached))
}