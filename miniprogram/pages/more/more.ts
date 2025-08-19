// pages/more/more.ts
import { UserProfile, WxEvent, FormSubmitEvent, InputEvent, PickerEvent } from '../../types/index'

Page({
  data: {
    // 用户信息
    userInfo: {
      nickName: '薄荷用户',
      avatarUrl: '',
      birthday: '',
      signature: '让生活更精致，让每一天都充满活力'
    },
    
    // 统计数据
    transactionCount: 0,
    periodCount: 0,
    usageDays: 1,
    
    // 弹窗状态
    showProfileModal: false,
    
    // 编辑资料表单
    profileForm: {
      nickName: '',
      avatarUrl: '',
      birthday: '',
      signature: ''
    }
  },

  onLoad() {
    console.log('更多页面加载')
    this.loadUserData()
    this.loadStatistics()
  },

  onShow() {
    console.log('更多页面显示')
    this.refreshData()
  },

  // 加载用户数据
  loadUserData() {
    try {
      const userInfo = wx.getStorageSync('userInfo') || {}
      this.setData({
        userInfo: {
          nickName: userInfo.nickName || '薄荷用户',
          avatarUrl: userInfo.avatarUrl || '',
          birthday: userInfo.birthday || '',
          signature: userInfo.signature || '让生活更精致，让每一天都充满活力'
        }
      })
    } catch (error) {
      console.error('加载用户数据失败:', error)
    }
  },

  // 加载统计数据
  loadStatistics() {
    try {
      // 交易记录统计
      const transactions = wx.getStorageSync('transactions') || []
      
      // 经期记录统计
      const periodData = wx.getStorageSync('periodData') || { periods: [] }
      
      // 使用天数统计
      const firstUseDate = wx.getStorageSync('firstUseDate')
      let usageDays = 1
      if (firstUseDate) {
        const now = new Date()
        const firstUse = new Date(firstUseDate)
        usageDays = Math.max(1, Math.ceil((now.getTime() - firstUse.getTime()) / (24 * 60 * 60 * 1000)))
      } else {
        // 如果没有记录首次使用日期，则记录当前时间
        wx.setStorageSync('firstUseDate', new Date().toISOString())
      }
      
      this.setData({
        transactionCount: transactions.length,
        periodCount: periodData.periods.length,
        usageDays: usageDays
      })
    } catch (error) {
      console.error('加载统计数据失败:', error)
    }
  },

  // 刷新数据
  refreshData() {
    this.loadUserData()
    this.loadStatistics()
  },

  // 编辑资料
  editProfile() {
    const { userInfo } = this.data
    this.setData({
      showProfileModal: true,
      profileForm: {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        birthday: userInfo.birthday,
        signature: userInfo.signature
      }
    })
  },

  // 关闭资料弹窗
  closeProfileModal() {
    this.setData({
      showProfileModal: false
    })
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 空函数，用于阻止事件冒泡
  },

  // 选择头像
  chooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({
          'profileForm.avatarUrl': tempFilePath
        })
      },
      fail: (error) => {
        console.error('选择头像失败:', error)
        wx.showToast({
          title: '选择头像失败',
          icon: 'none'
        })
      }
    })
  },

  // 昵称输入
  onNickNameInput(e: InputEvent) {
    this.setData({
      'profileForm.nickName': e.detail.value
    })
  },

  // 生日变化
  onBirthdayChange(e: PickerEvent) {
    this.setData({
      'profileForm.birthday': e.detail.value
    })
  },

  // 签名输入
  onSignatureInput(e: InputEvent) {
    this.setData({
      'profileForm.signature': e.detail.value
    })
  },

  // 提交资料
  submitProfile(e: FormSubmitEvent) {
    const { profileForm } = this.data
    
    // 验证数据
    if (!profileForm.nickName.trim()) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      })
      return
    }
    
    // 保存用户信息
    try {
      const userInfo = {
        nickName: profileForm.nickName.trim(),
        avatarUrl: profileForm.avatarUrl,
        birthday: profileForm.birthday,
        signature: profileForm.signature.trim() || '让生活更精致，让每一天都充满活力',
        updatedAt: new Date().toISOString()
      }
      
      wx.setStorageSync('userInfo', userInfo)
      
      this.setData({
        userInfo: userInfo
      })
      
      wx.showToast({
        title: '✅ 资料更新成功！',
        icon: 'none'
      })
      
      this.closeProfileModal()
    } catch (error) {
      console.error('保存用户信息失败:', error)
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      })
    }
  },

  // 导航到记账页面
  navigateToAccounting() {
    wx.switchTab({
      url: '/pages/accounting/accounting'
    })
  },

  // 导航到经期页面
  navigateToPeriod() {
    wx.switchTab({
      url: '/pages/period/period'
    })
  },

  // 查看交易统计
  viewTransactionStats() {
    wx.showToast({
      title: '功能开发中...',
      icon: 'none'
    })
  },

  // 查看经期统计
  viewPeriodStats() {
    wx.showToast({
      title: '功能开发中...',
      icon: 'none'
    })
  },

  // 查看使用统计
  viewUsageStats() {
    wx.showToast({
      title: '功能开发中...',
      icon: 'none'
    })
  },

  // 打开通知设置
  openNotificationSettings() {
    wx.showModal({
      title: '通知设置',
      content: '是否开启经期提醒和记账提醒？',
      confirmText: '开启',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '通知已开启',
            icon: 'success'
          })
        }
      }
    })
  },

  // 打开隐私设置
  openPrivacySettings() {
    wx.showModal({
      title: '隐私设置',
      content: '您的数据仅存储在本地，我们不会收集任何个人隐私信息。',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 打开数据管理
  openDataManagement() {
    wx.showActionSheet({
      itemList: ['导出数据', '备份数据', '清理缓存', '重置所有数据'],
      success: (res) => {
        const actions = ['导出数据', '备份数据', '清理缓存', '重置所有数据']
        const action = actions[res.tapIndex]
        
        if (action === '重置所有数据') {
          wx.showModal({
            title: '确认重置',
            content: '此操作将清除所有数据，且无法恢复，确定要继续吗？',
            confirmText: '确定重置',
            confirmColor: '#ff4444',
            success: (modalRes) => {
              if (modalRes.confirm) {
                this.resetAllData()
              }
            }
          })
        } else {
          wx.showToast({
            title: `${action}功能开发中...`,
            icon: 'none'
          })
        }
      }
    })
  },

  // 重置所有数据
  resetAllData() {
    try {
      wx.clearStorageSync()
      wx.showToast({
        title: '数据已重置',
        icon: 'success'
      })
      
      // 重新初始化数据
      setTimeout(() => {
        this.refreshData()
      }, 1000)
    } catch (error) {
      console.error('重置数据失败:', error)
      wx.showToast({
        title: '重置失败',
        icon: 'none'
      })
    }
  },

  // 关于我们
  openAbout() {
    wx.showModal({
      title: '关于薄荷生活',
      content: '薄荷生活 v1.0.0\n\n一款专为女性设计的智能生活助手，提供记账、经期管理等功能，让生活更精致。\n\n© 2024 薄荷生活团队',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 意见反馈
  openFeedback() {
    wx.showModal({
      title: '意见反馈',
      content: '感谢您使用薄荷生活！如有任何建议或问题，请通过以下方式联系我们：\n\n邮箱：feedback@minlife.com\n微信：MinLifeApp',
      showCancel: false,
      confirmText: '知道了'
    })
  }
})
