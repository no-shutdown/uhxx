// 小程序类型定义

// 全局应用接口
export interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo
    transactions: Transaction[]
    periodData: PeriodData
    settings: AppSettings
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback
}

// 交易记录接口
export interface Transaction {
  id: number
  type: 'income' | 'expense'
  amount: number
  category: string
  categoryName: string
  icon: string
  note: string
  date: string
  time?: string
}

// 分类接口
export interface Category {
  value: string
  label: string
}

// 经期数据接口
export interface PeriodData {
  lastPeriod?: string
  cycleLength: number
  periodLength: number
  predictions: PeriodPrediction[]
  records?: PeriodRecord[]
  symptoms?: any[]
}

// 经期预测接口
export interface PeriodPrediction {
  date: string
  type: 'period' | 'ovulation'
  confidence: number
}

// 经期记录接口
export interface PeriodRecord {
  id: number
  date: string
  type: 'period_start' | 'period_end' | 'symptom'
  flow?: 'light' | 'normal' | 'heavy' | 'very_heavy'
  mood?: string
  symptoms?: string[]
  note?: string
}

// 应用设置接口
export interface AppSettings {
  theme: 'default' | 'dark'
  currency: string
  notifications?: boolean
  reminderDays?: number
}

// 表单数据接口
export interface FormData {
  amount: string
  note: string
}

// 分类统计接口
export interface CategoryStat {
  category: string
  name: string
  amount: number
  percentage: number
  color: string
}

// 日历日期接口
export interface CalendarDay {
  date: number
  fullDate: string
  isToday: boolean
  isPeriod: boolean
  isOvulation: boolean
  isCurrentMonth: boolean
  hasRecord: boolean
}

// 页面数据接口
export interface PageData {
  [key: string]: any
}

// 事件对象接口
export interface WxEvent {
  currentTarget: {
    dataset: {
      [key: string]: any
    }
  }
  detail: {
    value?: any
    [key: string]: any
  }
}

// 表单提交事件接口
export interface FormSubmitEvent {
  detail: {
    value: {
      [key: string]: string
    }
  }
}

// 输入事件接口
export interface InputEvent {
  detail: {
    value: string
  }
}

// 选择器事件接口
export interface PickerEvent {
  detail: {
    value: number | number[]
  }
}

// 页面选项接口
export interface PageOptions {
  [key: string]: string
}

// 分组交易接口
export interface GroupedTransaction {
  date: string
  transactions: Transaction[]
}

// 统计数据接口
export interface Statistics {
  totalIncome: string
  totalExpense: string
  netIncome: string
  topCategory: string
}

// 经期统计接口
export interface PeriodStats {
  averageCycle: number
  averagePeriod: number
  daysToNext: number
  accuracy: number
  lastPeriodText: string
  nextPeriodText: string
  ovulationText: string
}

// 用户信息接口
export interface UserProfile {
  nickname: string
  avatar: string
  age?: number
  height?: number
  weight?: number
  cycleLength?: number
  periodLength?: number
}

// 快捷操作接口
export interface QuickAction {
  id: string
  title: string
  icon: string
  type: 'income' | 'expense'
  category: string
  amount?: number
}

// 图表数据接口
export interface ChartData {
  labels: string[]
  datasets: {
    data: number[]
    colors: string[]
  }[]
}

// 通知设置接口
export interface NotificationSettings {
  periodReminder: boolean
  ovulationReminder: boolean
  budgetAlert: boolean
  reminderTime: string
}

// 导出类型
export type TransactionType = 'income' | 'expense'
export type PeriodType = 'period' | 'ovulation'
export type FlowType = 'light' | 'normal' | 'heavy' | 'very_heavy'
export type ThemeType = 'default' | 'dark'
export type FilterType = 'today' | 'month' | 'year'
