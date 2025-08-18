// pages/home/home.ts
Page({
  data: {
    // 收支数据
    monthlyIncome: '8,500',
    monthlyExpense: '3,240',
    monthlyBalance: '5,260',
    incomeGrowth: 12,
    expenseGrowth: 5,
    balanceGrowth: 18,
    currentMonth: '1',

    // 经期数据
    daysToNextPeriod: 8,
    averageCycle: 28,
    accuracy: 92,
    periodStatus: '正常周期',
    
    // 最近交易
    recentTransactions: [
      {
        id: 1,
        title: '午餐时光',
        time: '12:30',
        categoryName: '餐饮美食',
        category: 'food',
        icon: '🍽️',
        amount: '38',
        type: 'expense'
      },
      {
        id: 2,
        title: '地铁出行',
        time: '09:15',
        categoryName: '交通出行',
        category: 'transport',
        icon: '🚇',
        amount: '6',
        type: 'expense'
      },
      {
        id: 3,
        title: '月度工资',
        time: '昨天',
        categoryName: '工作收入',
        category: 'income',
        icon: '💰',
        amount: '8,500',
        type: 'income'
      }
    ],
    
    // 弹窗相关
    showModal: false,
    modalType: 'expense', // 'income' | 'expense'
    selectedCategory: '',
    formData: {
      amount: '',
      note: ''
    },
    
    // 分类数据
    incomeCategories: [
      { value: 'salary', label: '💰 工资' },
      { value: 'parttime', label: '💼 兼职' },
      { value: 'investment', label: '📈 投资' },
      { value: 'gift', label: '🎁 红包' },
      { value: 'transfer', label: '💳 转账' },
      { value: 'bonus', label: '🏆 奖金' },
      { value: 'financial', label: '💎 理财' },
      { value: 'other', label: '🌟 其他' }
    ],
    
    expenseCategories: [
      { value: 'food', label: '🍽️ 餐饮' },
      { value: 'transport', label: '🚇 交通' },
      { value: 'shopping', label: '🛍️ 购物' },
      { value: 'housing', label: '🏠 住房' },
      { value: 'medical', label: '💊 医疗' },
      { value: 'education', label: '📚 教育' },
      { value: 'entertainment', label: '🎮 娱乐' },
      { value: 'communication', label: '📱 通讯' }
    ],
    
    categories: []
  },

  onLoad() {
    console.log('首页加载')
    this.loadData()
  },

  onShow() {
    console.log('首页显示')
    this.refreshData()
  },

  // 加载数据
  loadData() {
    // 从本地存储加载数据
    try {
      const transactions = wx.getStorageSync('transactions') || []
      const periodData = wx.getStorageSync('periodData') || {}
      
      // 计算本月收支
      this.calculateMonthlySummary(transactions)
      
      // 更新经期信息
      this.updatePeriodInfo(periodData)
      
      // 更新最近交易
      this.updateRecentTransactions(transactions)
    } catch (error) {
      console.error('加载数据失败:', error)
    }
  },

  // 刷新数据
  refreshData() {
    this.loadData()
  },

  // 计算本月收支
  calculateMonthlySummary(transactions: any[]) {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    let income = 0
    let expense = 0

    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date)
      if (transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear) {
        if (transaction.type === 'income') {
          income += transaction.amount
        } else {
          expense += transaction.amount
        }
      }
    })

    const balance = income - expense

    this.setData({
      monthlyIncome: this.formatAmount(income),
      monthlyExpense: this.formatAmount(expense),
      monthlyBalance: this.formatAmount(balance),
      currentMonth: (currentMonth + 1).toString()
    })
  },

  // 更新经期信息
  updatePeriodInfo(periodData: any) {
    if (periodData.lastPeriod) {
      const lastPeriod = new Date(periodData.lastPeriod)
      const now = new Date()
      const cycleLength = periodData.cycleLength || 28
      
      // 计算距离下次经期的天数
      const nextPeriod = new Date(lastPeriod.getTime() + cycleLength * 24 * 60 * 60 * 1000)
      const daysToNext = Math.ceil((nextPeriod.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
      
      this.setData({
        daysToNextPeriod: Math.max(0, daysToNext),
        averageCycle: cycleLength
      })
    }
  },

  // 更新最近交易
  updateRecentTransactions(transactions: any[]) {
    const recent = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
      .map(transaction => ({
        ...transaction,
        time: this.formatTime(transaction.date),
        amount: this.formatAmount(transaction.amount, false)
      }))
    
    this.setData({
      recentTransactions: recent
    })
  },

  // 格式化金额
  formatAmount(amount: number, withComma: boolean = true): string {
    if (withComma) {
      return amount.toLocaleString()
    }
    return amount.toString()
  },

  // 格式化时间
  formatTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000))
    
    if (diffDays === 0) {
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    } else if (diffDays === 1) {
      return '昨天'
    } else {
      return `${diffDays}天前`
    }
  },

  // 打开交易弹窗
  openTransactionModal(e: any) {
    const type = e.currentTarget.dataset.type || 'expense'
    const categories = type === 'income' ? this.data.incomeCategories : this.data.expenseCategories
    
    this.setData({
      showModal: true,
      modalType: type,
      categories: categories,
      selectedCategory: '',
      formData: {
        amount: '',
        note: ''
      }
    })
  },

  // 关闭弹窗
  closeModal() {
    this.setData({
      showModal: false
    })
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 空函数，用于阻止事件冒泡
  },

  // 选择分类
  selectCategory(e: any) {
    const value = e.currentTarget.dataset.value
    this.setData({
      selectedCategory: value
    })
  },

  // 输入金额
  onAmountInput(e: any) {
    this.setData({
      'formData.amount': e.detail.value
    })
  },

  // 输入备注
  onNoteInput(e: any) {
    this.setData({
      'formData.note': e.detail.value
    })
  },

  // 提交交易
  submitTransaction(e: any) {
    const { amount, note } = e.detail.value
    const { modalType, selectedCategory } = this.data
    
    // 验证数据
    if (!amount || !selectedCategory) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }
    
    // 构造交易数据
    const transaction = {
      id: Date.now(),
      type: modalType,
      amount: parseFloat(amount),
      category: selectedCategory,
      note: note || '',
      date: new Date().toISOString(),
      categoryName: this.getCategoryName(selectedCategory),
      icon: this.getCategoryIcon(selectedCategory)
    }
    
    // 保存到本地存储
    try {
      const transactions = wx.getStorageSync('transactions') || []
      transactions.unshift(transaction)
      wx.setStorageSync('transactions', transactions)
      
      wx.showToast({
        title: '✅ 记录添加成功！',
        icon: 'none'
      })
      
      // 关闭弹窗并刷新数据
      this.closeModal()
      this.refreshData()
    } catch (error) {
      console.error('保存交易失败:', error)
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      })
    }
  },

  // 获取分类名称
  getCategoryName(value: string): string {
    const allCategories = [...this.data.incomeCategories, ...this.data.expenseCategories]
    const category = allCategories.find(cat => cat.value === value)
    return category ? category.label.substring(2) : '其他'
  },

  // 获取分类图标
  getCategoryIcon(value: string): string {
    const allCategories = [...this.data.incomeCategories, ...this.data.expenseCategories]
    const category = allCategories.find(cat => cat.value === value)
    return category ? category.label.substring(0, 2) : '💰'
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
  }
})
