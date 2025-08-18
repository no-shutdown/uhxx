// 薄荷生活 - 工具函数库

/**
 * 格式化时间
 */
export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

/**
 * 格式化数字，小于10的数字前面补0
 */
const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

/**
 * 格式化日期为 YYYY-MM-DD 格式
 */
export const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

/**
 * 格式化金额，添加千分位分隔符
 */
export const formatAmount = (amount: number, withSymbol: boolean = true) => {
  const formatted = amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })
  return withSymbol ? `¥${formatted}` : formatted
}

/**
 * 计算两个日期之间的天数差
 */
export const daysBetween = (date1: Date | string, date2: Date | string) => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2

  const timeDiff = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

/**
 * 判断是否为同一天
 */
export const isSameDay = (date1: Date | string, date2: Date | string) => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2

  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate()
}

/**
 * 获取月份的第一天和最后一天
 */
export const getMonthRange = (year: number, month: number) => {
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)

  return {
    start: firstDay,
    end: lastDay,
    startStr: formatDate(firstDay),
    endStr: formatDate(lastDay)
  }
}

/**
 * 获取年份的第一天和最后一天
 */
export const getYearRange = (year: number) => {
  const firstDay = new Date(year, 0, 1)
  const lastDay = new Date(year, 11, 31)

  return {
    start: firstDay,
    end: lastDay,
    startStr: formatDate(firstDay),
    endStr: formatDate(lastDay)
  }
}

/**
 * 生成唯一ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 深拷贝对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T
  }

  if (typeof obj === 'object') {
    const cloned = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }

  return obj
}

/**
 * 防抖函数
 */
export const debounce = (func: Function, wait: number) => {
  let timeout: number | null = null

  return function(this: any, ...args: any[]) {
    const context = this

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

/**
 * 节流函数
 */
export const throttle = (func: Function, wait: number) => {
  let lastTime = 0

  return function(this: any, ...args: any[]) {
    const context = this
    const now = Date.now()

    if (now - lastTime >= wait) {
      lastTime = now
      func.apply(context, args)
    }
  }
}

/**
 * 验证手机号
 */
export const validatePhone = (phone: string) => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证邮箱
 */
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
