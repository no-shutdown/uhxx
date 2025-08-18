// pages/accounting/accounting.ts
Page({
  data: {
    // 筛选相关
    activeFilter: 'today', // 'today' | 'month' | 'year'
    filterText: '今日',
    
    // 统计数据
    totalIncome: '0',
    totalExpense: '186',
    netIncome: '0',
    topCategory: '餐饮',
    
    // 交易数据
    transactions: [],
    groupedTransactions: [],
    
    // 分类统计
    categoryStats: [
      { category: 'food', name: '餐饮', percentage: 45, color: '#FF9800' },
      { category: 'transport', name: '交通', percentage: 25, color: '#2196F3' },
      { category: 'shopping', name: '购物', percentage: 20, color: '#9C27B0' },
      { category: 'other', name: '其他', percentage: 10, color: '#4CAF50' }
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
    console.log('记账页面加载')
    this.loadData()
  },

  onShow() {
    console.log('记账页面显示')
    this.refreshData()
  },

  onPullDownRefresh() {
    this.refreshData()
    wx.stopPullDownRefresh()
  },

  // 加载数据
  loadData() {
    try {
      const transactions = wx.getStorageSync('transactions') || []
      this.processTransactions(transactions)
    } catch (error) {
      console.error('加载数据失败:', error)
    }
  },

  // 刷新数据
  refreshData() {
    this.loadData()
  },

  // 处理交易数据
  processTransactions(allTransactions: any[]) {
    // 根据筛选条件过滤交易
    const filteredTransactions = this.filterTransactions(allTransactions)
    
    // 计算统计数据
    this.calculateStatistics(filteredTransactions)
    
    // 分组交易记录
    this.groupTransactionsByDate(filteredTransactions)
    
    // 计算分类统计
    this.calculateCategoryStats(filteredTransactions)
  },

  // 根据筛选条件过滤交易
  filterTransactions(transactions: any[]): any[] {
    const now = new Date()
    const { activeFilter } = this.data
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      
      switch (activeFilter) {
        case 'today':
          return this.isSameDay(transactionDate, now)
        case 'month':
          return transactionDate.getMonth() === now.getMonth() && 
                 transactionDate.getFullYear() === now.getFullYear()
        case 'year':
          return transactionDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
  },

  // 判断是否为同一天
  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  },

  // 计算统计数据
  calculateStatistics(transactions: any[]) {
    let totalIncome = 0
    let totalExpense = 0
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount
      } else {
        totalExpense += transaction.amount
      }
    })
    
    const netIncome = totalIncome - totalExpense
    
    this.setData({
      totalIncome: this.formatAmount(totalIncome),
      totalExpense: this.formatAmount(totalExpense),
      netIncome: this.formatAmount(Math.abs(netIncome))
    })
  },

  // 按日期分组交易记录
  groupTransactionsByDate(transactions: any[]) {
    const groups: { [key: string]: any[] } = {}
    
    transactions.forEach(transaction => {
      const date = this.formatDate(transaction.date)
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push({
        ...transaction,
        time: this.formatTime(transaction.date),
        amount: this.formatAmount(transaction.amount, false)
      })
    })
    
    const groupedTransactions = Object.keys(groups)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map(date => ({
        date: this.formatDateDisplay(date),
        transactions: groups[date].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      }))
    
    this.setData({
      transactions: transactions,
      groupedTransactions: groupedTransactions
    })
  },

  // 计算分类统计
  calculateCategoryStats(transactions: any[]) {
    const expenseTransactions = transactions.filter(t => t.type === 'expense')
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)
    
    if (totalExpense === 0) {
      this.setData({
        categoryStats: [],
        topCategory: '暂无'
      })
      return
    }
    
    const categoryTotals: { [key: string]: number } = {}
    expenseTransactions.forEach(transaction => {
      const category = transaction.category
      categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount
    })
    
    const categoryStats = Object.keys(categoryTotals)
      .map(category => ({
        category,
        name: this.getCategoryName(category),
        amount: categoryTotals[category],
        percentage: Math.round((categoryTotals[category] / totalExpense) * 100),
        color: this.getCategoryColor(category)
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4)
    
    const topCategory = categoryStats.length > 0 ? categoryStats[0].name : '暂无'
    
    this.setData({
      categoryStats,
      topCategory
    })
  },

  // 切换筛选条件
  switchFilter(e: any) {
    const filter = e.currentTarget.dataset.filter
    const filterTexts = {
      'today': '今日',
      'month': '本月',
      'year': '本年'
    }
    
    this.setData({
      activeFilter: filter,
      filterText: filterTexts[filter as keyof typeof filterTexts]
    })
    
    this.loadData()
  },

  // 格式化金额
  formatAmount(amount: number, withComma: boolean = true): string {
    if (withComma) {
      return amount.toLocaleString()
    }
    return amount.toString()
  },

  // 格式化日期
  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  },

  // 格式化日期显示
  formatDateDisplay(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000))
    
    if (diffDays === 0) {
      return '今天'
    } else if (diffDays === 1) {
      return '昨天'
    } else if (diffDays === 2) {
      return '前天'
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`
    }
  },

  // 格式化时间
  formatTime(dateString: string): string {
    const date = new Date(dateString)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  },

  // 获取分类名称
  getCategoryName(value: string): string {
    const allCategories = [...this.data.incomeCategories, ...this.data.expenseCategories]
    const category = allCategories.find(cat => cat.value === value)
    return category ? category.label.substring(2) : '其他'
  },

  // 获取分类颜色
  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'food': '#FF9800',
      'transport': '#2196F3',
      'shopping': '#9C27B0',
      'housing': '#4CAF50',
      'medical': '#F44336',
      'education': '#FF5722',
      'entertainment': '#E91E63',
      'communication': '#00BCD4',
      'salary': '#4CAF50',
      'parttime': '#8BC34A',
      'investment': '#FFC107',
      'gift': '#E91E63'
    }
    return colors[category] || '#666666'
  },

  // 打开交易弹窗
  openTransactionModal() {
    const categories = this.data.modalType === 'income' ? this.data.incomeCategories : this.data.expenseCategories

    this.setData({
      showModal: true,
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

  // 切换弹窗类型
  switchModalType(e: any) {
    const type = e.currentTarget.dataset.type
    const categories = type === 'income' ? this.data.incomeCategories : this.data.expenseCategories

    this.setData({
      modalType: type,
      categories: categories,
      selectedCategory: ''
    })
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

  // 获取分类图标
  getCategoryIcon(value: string): string {
    const allCategories = [...this.data.incomeCategories, ...this.data.expenseCategories]
    const category = allCategories.find(cat => cat.value === value)
    return category ? category.label.substring(0, 2) : '💰'
  }
})
