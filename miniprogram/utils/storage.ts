// 薄荷生活 - 本地存储管理

/**
 * 存储键名常量
 */
export const STORAGE_KEYS = {
  USER_INFO: 'userInfo',
  TRANSACTIONS: 'transactions',
  PERIOD_DATA: 'periodData',
  SETTINGS: 'settings',
  FIRST_USE_DATE: 'firstUseDate',
  NOTIFICATION_SETTINGS: 'notificationSettings'
}

/**
 * 用户信息接口
 */
export interface UserInfo {
  nickName: string
  avatarUrl: string
  birthday: string
  signature: string
  updatedAt: string
}

/**
 * 交易记录接口
 */
export interface Transaction {
  id: string | number
  type: 'income' | 'expense'
  amount: number
  category: string
  categoryName: string
  icon: string
  note: string
  date: string
  createdAt: string
}

/**
 * 经期记录接口
 */
export interface PeriodRecord {
  id: string | number
  startDate: string
  endDate: string
  flow: 'light' | 'normal' | 'heavy' | 'very_heavy'
  note: string
  createdAt: string
}

/**
 * 症状记录接口
 */
export interface SymptomRecord {
  id: string | number
  date: string
  mood: string
  symptoms: string[]
  note: string
  createdAt: string
}

/**
 * 经期数据接口
 */
export interface PeriodData {
  periods: PeriodRecord[]
  symptoms: SymptomRecord[]
  lastPeriod: string | null
  cycleLength: number
  periodLength: number
}

/**
 * 设置接口
 */
export interface Settings {
  theme: 'default' | 'dark'
  currency: string
  language: 'zh-CN' | 'en-US'
  notifications: {
    period: boolean
    accounting: boolean
    reminder: boolean
  }
}

/**
 * 存储管理类
 */
export class StorageManager {
  /**
   * 获取用户信息
   */
  static getUserInfo(): UserInfo | null {
    try {
      const userInfo = wx.getStorageSync(STORAGE_KEYS.USER_INFO)
      return userInfo || null
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  }

  /**
   * 保存用户信息
   */
  static setUserInfo(userInfo: UserInfo): boolean {
    try {
      wx.setStorageSync(STORAGE_KEYS.USER_INFO, userInfo)
      return true
    } catch (error) {
      console.error('保存用户信息失败:', error)
      return false
    }
  }

  /**
   * 获取交易记录
   */
  static getTransactions(): Transaction[] {
    try {
      const transactions = wx.getStorageSync(STORAGE_KEYS.TRANSACTIONS)
      return transactions || []
    } catch (error) {
      console.error('获取交易记录失败:', error)
      return []
    }
  }

  /**
   * 保存交易记录
   */
  static setTransactions(transactions: Transaction[]): boolean {
    try {
      wx.setStorageSync(STORAGE_KEYS.TRANSACTIONS, transactions)
      return true
    } catch (error) {
      console.error('保存交易记录失败:', error)
      return false
    }
  }

  /**
   * 添加交易记录
   */
  static addTransaction(transaction: Transaction): boolean {
    try {
      const transactions = this.getTransactions()
      transactions.unshift(transaction)
      return this.setTransactions(transactions)
    } catch (error) {
      console.error('添加交易记录失败:', error)
      return false
    }
  }

  /**
   * 删除交易记录
   */
  static deleteTransaction(id: string | number): boolean {
    try {
      const transactions = this.getTransactions()
      const filteredTransactions = transactions.filter(t => t.id !== id)
      return this.setTransactions(filteredTransactions)
    } catch (error) {
      console.error('删除交易记录失败:', error)
      return false
    }
  }

  /**
   * 获取经期数据
   */
  static getPeriodData(): PeriodData {
    try {
      const periodData = wx.getStorageSync(STORAGE_KEYS.PERIOD_DATA)
      return periodData || {
        periods: [],
        symptoms: [],
        lastPeriod: null,
        cycleLength: 28,
        periodLength: 5
      }
    } catch (error) {
      console.error('获取经期数据失败:', error)
      return {
        periods: [],
        symptoms: [],
        lastPeriod: null,
        cycleLength: 28,
        periodLength: 5
      }
    }
  }

  /**
   * 保存经期数据
   */
  static setPeriodData(periodData: PeriodData): boolean {
    try {
      wx.setStorageSync(STORAGE_KEYS.PERIOD_DATA, periodData)
      return true
    } catch (error) {
      console.error('保存经期数据失败:', error)
      return false
    }
  }

  /**
   * 添加经期记录
   */
  static addPeriodRecord(record: PeriodRecord): boolean {
    try {
      const periodData = this.getPeriodData()
      periodData.periods.unshift(record)
      periodData.lastPeriod = record.startDate
      
      // 计算周期长度
      if (periodData.periods.length > 1) {
        const lastPeriod = new Date(periodData.periods[1].startDate)
        const currentPeriod = new Date(record.startDate)
        const cycleLength = Math.round((currentPeriod.getTime() - lastPeriod.getTime()) / (24 * 60 * 60 * 1000))
        if (cycleLength > 0 && cycleLength < 60) {
          periodData.cycleLength = cycleLength
        }
      }
      
      // 计算经期长度
      const startDate = new Date(record.startDate)
      const endDate = new Date(record.endDate)
      const periodLength = Math.round((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1
      if (periodLength > 0 && periodLength < 15) {
        periodData.periodLength = periodLength
      }
      
      return this.setPeriodData(periodData)
    } catch (error) {
      console.error('添加经期记录失败:', error)
      return false
    }
  }

  /**
   * 添加症状记录
   */
  static addSymptomRecord(record: SymptomRecord): boolean {
    try {
      const periodData = this.getPeriodData()
      
      // 检查是否已有当天的记录，如果有则更新
      const existingIndex = periodData.symptoms.findIndex(s => s.date === record.date)
      if (existingIndex > -1) {
        periodData.symptoms[existingIndex] = record
      } else {
        periodData.symptoms.unshift(record)
      }
      
      return this.setPeriodData(periodData)
    } catch (error) {
      console.error('添加症状记录失败:', error)
      return false
    }
  }

  /**
   * 获取设置
   */
  static getSettings(): Settings {
    try {
      const settings = wx.getStorageSync(STORAGE_KEYS.SETTINGS)
      return settings || {
        theme: 'default',
        currency: '¥',
        language: 'zh-CN',
        notifications: {
          period: true,
          accounting: true,
          reminder: true
        }
      }
    } catch (error) {
      console.error('获取设置失败:', error)
      return {
        theme: 'default',
        currency: '¥',
        language: 'zh-CN',
        notifications: {
          period: true,
          accounting: true,
          reminder: true
        }
      }
    }
  }

  /**
   * 保存设置
   */
  static setSettings(settings: Settings): boolean {
    try {
      wx.setStorageSync(STORAGE_KEYS.SETTINGS, settings)
      return true
    } catch (error) {
      console.error('保存设置失败:', error)
      return false
    }
  }

  /**
   * 获取首次使用日期
   */
  static getFirstUseDate(): string | null {
    try {
      return wx.getStorageSync(STORAGE_KEYS.FIRST_USE_DATE) || null
    } catch (error) {
      console.error('获取首次使用日期失败:', error)
      return null
    }
  }

  /**
   * 设置首次使用日期
   */
  static setFirstUseDate(date: string): boolean {
    try {
      wx.setStorageSync(STORAGE_KEYS.FIRST_USE_DATE, date)
      return true
    } catch (error) {
      console.error('设置首次使用日期失败:', error)
      return false
    }
  }

  /**
   * 清除所有数据
   */
  static clearAll(): boolean {
    try {
      wx.clearStorageSync()
      return true
    } catch (error) {
      console.error('清除数据失败:', error)
      return false
    }
  }

  /**
   * 获取存储信息
   */
  static getStorageInfo() {
    try {
      return wx.getStorageInfoSync()
    } catch (error) {
      console.error('获取存储信息失败:', error)
      return null
    }
  }

  /**
   * 导出数据
   */
  static exportData() {
    try {
      const data = {
        userInfo: this.getUserInfo(),
        transactions: this.getTransactions(),
        periodData: this.getPeriodData(),
        settings: this.getSettings(),
        firstUseDate: this.getFirstUseDate(),
        exportTime: new Date().toISOString()
      }
      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error('导出数据失败:', error)
      return null
    }
  }

  /**
   * 导入数据
   */
  static importData(dataStr: string): boolean {
    try {
      const data = JSON.parse(dataStr)
      
      if (data.userInfo) {
        this.setUserInfo(data.userInfo)
      }
      if (data.transactions) {
        this.setTransactions(data.transactions)
      }
      if (data.periodData) {
        this.setPeriodData(data.periodData)
      }
      if (data.settings) {
        this.setSettings(data.settings)
      }
      if (data.firstUseDate) {
        this.setFirstUseDate(data.firstUseDate)
      }
      
      return true
    } catch (error) {
      console.error('导入数据失败:', error)
      return false
    }
  }
}
