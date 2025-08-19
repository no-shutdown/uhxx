// app.ts
import { IAppOption } from './types/index'

App<IAppOption>({
  globalData: {
    userInfo: undefined,
    transactions: [], // 交易记录
    periodData: {
      cycleLength: 28,
      periodLength: 5,
      predictions: []
    }, // 经期数据
    settings: {
      theme: 'default',
      currency: '¥'
    }
  },
  onLaunch() {
    console.log('🌱 薄荷生活 - 智能生活助手启动')

    // 初始化本地存储
    this.initStorage()

    // 登录
    wx.login({
      success: res => {
        console.log('登录成功:', res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
      fail: err => {
        console.error('登录失败:', err)
      }
    })
  },

  onShow() {
    console.log('小程序显示')
  },

  onHide() {
    console.log('小程序隐藏')
  },

  // 初始化存储
  initStorage() {
    try {
      // 初始化交易记录
      const transactions = wx.getStorageSync('transactions')
      if (!transactions) {
        wx.setStorageSync('transactions', [])
      }

      // 初始化经期数据
      const periodData = wx.getStorageSync('periodData')
      if (!periodData) {
        wx.setStorageSync('periodData', {
          lastPeriod: null,
          cycleLength: 28,
          periodLength: 5,
          predictions: []
        })
      }

      // 初始化设置
      const settings = wx.getStorageSync('settings')
      if (!settings) {
        wx.setStorageSync('settings', this.globalData.settings)
      }
    } catch (error) {
      console.error('初始化存储失败:', error)
    }
  }
})