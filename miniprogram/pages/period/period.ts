// pages/period/period.ts
Page({
  data: {
    // 日历相关
    currentYear: 2024,
    currentMonth: 1,
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    calendarDays: [],
    
    // 统计数据
    averageCycle: 28,
    averagePeriod: 5,
    daysToNext: 8,
    accuracy: 92,
    
    // 周期信息
    lastPeriodText: '1月3日 - 1月7日',
    nextPeriodText: '1月31日（预测）',
    ovulationText: '1月17日 - 1月19日',
    
    // 弹窗状态
    showPeriodModal: false,
    showSymptomModal: false,
    
    // 经期记录表单
    periodForm: {
      startDate: '',
      endDate: '',
      flow: '',
      note: ''
    },
    
    // 症状记录表单
    symptomForm: {
      date: '',
      mood: '',
      symptoms: [],
      note: ''
    },
    
    // 选项数据
    flowOptions: [
      { value: 'light', label: '少量', icon: '💧' },
      { value: 'normal', label: '正常', icon: '💧💧' },
      { value: 'heavy', label: '较多', icon: '💧💧💧' },
      { value: 'very_heavy', label: '很多', icon: '💧💧💧💧' }
    ],
    
    moodOptions: [
      { value: 'very_happy', icon: '😄' },
      { value: 'happy', icon: '😊' },
      { value: 'normal', icon: '😐' },
      { value: 'sad', icon: '😔' },
      { value: 'very_sad', icon: '😢' }
    ],
    
    symptomOptions: [
      { value: 'cramps', label: '痛经', icon: '😣' },
      { value: 'headache', label: '头痛', icon: '🤕' },
      { value: 'bloating', label: '腹胀', icon: '🤰' },
      { value: 'fatigue', label: '疲劳', icon: '😴' },
      { value: 'mood_swings', label: '情绪波动', icon: '😤' },
      { value: 'acne', label: '痘痘', icon: '😷' },
      { value: 'breast_tenderness', label: '胸部胀痛', icon: '💔' },
      { value: 'back_pain', label: '腰痛', icon: '🦴' },
      { value: 'nausea', label: '恶心', icon: '🤢' }
    ],
    
    // 经期数据
    periodData: {
      periods: [],
      symptoms: [],
      lastPeriod: null,
      cycleLength: 28,
      periodLength: 5
    }
  },

  onLoad() {
    console.log('经期页面加载')
    this.initCalendar()
    this.loadPeriodData()
  },

  onShow() {
    console.log('经期页面显示')
    this.refreshData()
  },

  // 初始化日历
  initCalendar() {
    const now = new Date()
    this.setData({
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1
    })
    this.generateCalendar()
  },

  // 生成日历
  generateCalendar() {
    const { currentYear, currentMonth } = this.data
    const firstDay = new Date(currentYear, currentMonth - 1, 1)
    const lastDay = new Date(currentYear, currentMonth, 0)
    const firstDayWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()
    
    const calendarDays = []
    
    // 添加上个月的日期
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear
    const prevMonthLastDay = new Date(prevYear, prevMonth, 0).getDate()
    
    for (let i = firstDayWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i
      calendarDays.push({
        day: day,
        date: `${prevYear}-${prevMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        class: 'other-month'
      })
    }
    
    // 添加当月的日期
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      const dayClass = this.getDayClass(dateStr)
      
      calendarDays.push({
        day: day,
        date: dateStr,
        class: dayClass
      })
    }
    
    // 添加下个月的日期
    const remainingDays = 42 - calendarDays.length
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear
    
    for (let day = 1; day <= remainingDays; day++) {
      calendarDays.push({
        day: day,
        date: `${nextYear}-${nextMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        class: 'other-month'
      })
    }
    
    this.setData({
      calendarDays: calendarDays
    })
  },

  // 获取日期样式类
  getDayClass(dateStr: string): string {
    const date = new Date(dateStr)
    const today = new Date()
    const { periodData } = this.data
    
    // 检查是否是今天
    if (this.isSameDay(date, today)) {
      return 'today'
    }
    
    // 检查是否是经期
    if (this.isPeriodDay(dateStr)) {
      return 'period'
    }
    
    // 检查是否是排卵期
    if (this.isOvulationDay(dateStr)) {
      return 'ovulation'
    }
    
    // 检查是否是预测经期
    if (this.isPredictedPeriodDay(dateStr)) {
      return 'predicted'
    }
    
    return ''
  },

  // 判断是否为同一天
  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  },

  // 判断是否是经期
  isPeriodDay(dateStr: string): boolean {
    const { periodData } = this.data
    return periodData.periods.some((period: any) => {
      const startDate = new Date(period.startDate)
      const endDate = new Date(period.endDate)
      const currentDate = new Date(dateStr)
      return currentDate >= startDate && currentDate <= endDate
    })
  },

  // 判断是否是排卵期
  isOvulationDay(dateStr: string): boolean {
    // 简单的排卵期计算：经期开始后14天左右
    const { periodData } = this.data
    if (!periodData.lastPeriod) return false
    
    const lastPeriodDate = new Date(periodData.lastPeriod)
    const ovulationDate = new Date(lastPeriodDate.getTime() + 14 * 24 * 60 * 60 * 1000)
    const currentDate = new Date(dateStr)
    
    // 排卵期前后2天
    const diffDays = Math.abs((currentDate.getTime() - ovulationDate.getTime()) / (24 * 60 * 60 * 1000))
    return diffDays <= 2
  },

  // 判断是否是预测经期
  isPredictedPeriodDay(dateStr: string): boolean {
    const { periodData } = this.data
    if (!periodData.lastPeriod) return false
    
    const lastPeriodDate = new Date(periodData.lastPeriod)
    const nextPeriodDate = new Date(lastPeriodDate.getTime() + periodData.cycleLength * 24 * 60 * 60 * 1000)
    const currentDate = new Date(dateStr)
    
    // 预测经期持续时间
    const periodEndDate = new Date(nextPeriodDate.getTime() + (periodData.periodLength - 1) * 24 * 60 * 60 * 1000)
    
    return currentDate >= nextPeriodDate && currentDate <= periodEndDate
  },

  // 加载经期数据
  loadPeriodData() {
    try {
      const periodData = wx.getStorageSync('periodData') || {
        periods: [],
        symptoms: [],
        lastPeriod: null,
        cycleLength: 28,
        periodLength: 5
      }
      
      this.setData({
        periodData: periodData,
        averageCycle: periodData.cycleLength,
        averagePeriod: periodData.periodLength
      })
      
      this.updatePeriodInfo()
      this.generateCalendar() // 重新生成日历以应用经期标记
    } catch (error) {
      console.error('加载经期数据失败:', error)
    }
  },

  // 刷新数据
  refreshData() {
    this.loadPeriodData()
  },

  // 更新经期信息
  updatePeriodInfo() {
    const { periodData } = this.data
    
    if (periodData.lastPeriod) {
      const lastPeriod = new Date(periodData.lastPeriod)
      const nextPeriod = new Date(lastPeriod.getTime() + periodData.cycleLength * 24 * 60 * 60 * 1000)
      const now = new Date()
      
      // 计算距离下次经期的天数
      const daysToNext = Math.ceil((nextPeriod.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
      
      // 计算排卵期
      const ovulationStart = new Date(lastPeriod.getTime() + 12 * 24 * 60 * 60 * 1000)
      const ovulationEnd = new Date(lastPeriod.getTime() + 16 * 24 * 60 * 60 * 1000)
      
      this.setData({
        daysToNext: Math.max(0, daysToNext),
        lastPeriodText: this.formatDateRange(periodData.lastPeriod, periodData.lastPeriod),
        nextPeriodText: `${this.formatDate(nextPeriod.toISOString())}（预测）`,
        ovulationText: `${this.formatDate(ovulationStart.toISOString())} - ${this.formatDate(ovulationEnd.toISOString())}`
      })
    }
  },

  // 格式化日期
  formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  },

  // 格式化日期范围
  formatDateRange(startStr: string, endStr: string): string {
    const start = new Date(startStr)
    const end = new Date(endStr)
    return `${start.getMonth() + 1}月${start.getDate()}日 - ${end.getMonth() + 1}月${end.getDate()}日`
  },

  // 上一个月
  prevMonth() {
    let { currentYear, currentMonth } = this.data
    currentMonth--
    if (currentMonth < 1) {
      currentMonth = 12
      currentYear--
    }
    this.setData({
      currentYear,
      currentMonth
    })
    this.generateCalendar()
  },

  // 下一个月
  nextMonth() {
    let { currentYear, currentMonth } = this.data
    currentMonth++
    if (currentMonth > 12) {
      currentMonth = 1
      currentYear++
    }
    this.setData({
      currentYear,
      currentMonth
    })
    this.generateCalendar()
  },

  // 选择日期
  selectDate(e: any) {
    const date = e.currentTarget.dataset.date
    console.log('选择日期:', date)

    wx.showToast({
      title: `已选择 ${this.formatDate(date)}`,
      icon: 'none'
    })
  },

  // 记录经期
  recordPeriod() {
    const today = new Date().toISOString().split('T')[0]
    this.setData({
      showPeriodModal: true,
      'periodForm.startDate': today,
      'periodForm.endDate': '',
      'periodForm.flow': '',
      'periodForm.note': ''
    })
  },

  // 记录症状
  recordSymptom() {
    const today = new Date().toISOString().split('T')[0]
    this.setData({
      showSymptomModal: true,
      'symptomForm.date': today,
      'symptomForm.mood': '',
      'symptomForm.symptoms': [],
      'symptomForm.note': ''
    })
  },

  // 关闭经期弹窗
  closePeriodModal() {
    this.setData({
      showPeriodModal: false
    })
  },

  // 关闭症状弹窗
  closeSymptomModal() {
    this.setData({
      showSymptomModal: false
    })
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 空函数，用于阻止事件冒泡
  },

  // 开始日期变化
  onStartDateChange(e: any) {
    this.setData({
      'periodForm.startDate': e.detail.value
    })
  },

  // 结束日期变化
  onEndDateChange(e: any) {
    this.setData({
      'periodForm.endDate': e.detail.value
    })
  },

  // 选择流量
  selectFlow(e: any) {
    const value = e.currentTarget.dataset.value
    this.setData({
      'periodForm.flow': value
    })
  },

  // 经期备注输入
  onPeriodNoteInput(e: any) {
    this.setData({
      'periodForm.note': e.detail.value
    })
  },

  // 症状日期变化
  onSymptomDateChange(e: any) {
    this.setData({
      'symptomForm.date': e.detail.value
    })
  },

  // 选择心情
  selectMood(e: any) {
    const value = e.currentTarget.dataset.value
    this.setData({
      'symptomForm.mood': value
    })
  },

  // 切换症状
  toggleSymptom(e: any) {
    const value = e.currentTarget.dataset.value
    const symptoms = [...this.data.symptomForm.symptoms]
    const index = symptoms.indexOf(value)

    if (index > -1) {
      symptoms.splice(index, 1)
    } else {
      symptoms.push(value)
    }

    this.setData({
      'symptomForm.symptoms': symptoms
    })
  },

  // 症状备注输入
  onSymptomNoteInput(e: any) {
    this.setData({
      'symptomForm.note': e.detail.value
    })
  },

  // 提交经期记录
  submitPeriodRecord(e: any) {
    const { periodForm } = this.data

    // 验证数据
    if (!periodForm.startDate || !periodForm.endDate || !periodForm.flow) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    // 验证日期
    if (new Date(periodForm.startDate) > new Date(periodForm.endDate)) {
      wx.showToast({
        title: '结束日期不能早于开始日期',
        icon: 'none'
      })
      return
    }

    // 保存经期记录
    try {
      const periodData = wx.getStorageSync('periodData') || {
        periods: [],
        symptoms: [],
        lastPeriod: null,
        cycleLength: 28,
        periodLength: 5
      }

      const newPeriod = {
        id: Date.now(),
        startDate: periodForm.startDate,
        endDate: periodForm.endDate,
        flow: periodForm.flow,
        note: periodForm.note,
        createdAt: new Date().toISOString()
      }

      periodData.periods.unshift(newPeriod)
      periodData.lastPeriod = periodForm.startDate

      // 计算周期长度
      if (periodData.periods.length > 1) {
        const lastPeriod = new Date(periodData.periods[1].startDate)
        const currentPeriod = new Date(periodForm.startDate)
        const cycleLength = Math.round((currentPeriod.getTime() - lastPeriod.getTime()) / (24 * 60 * 60 * 1000))
        if (cycleLength > 0 && cycleLength < 60) {
          periodData.cycleLength = cycleLength
        }
      }

      // 计算经期长度
      const startDate = new Date(periodForm.startDate)
      const endDate = new Date(periodForm.endDate)
      const periodLength = Math.round((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1
      if (periodLength > 0 && periodLength < 15) {
        periodData.periodLength = periodLength
      }

      wx.setStorageSync('periodData', periodData)

      wx.showToast({
        title: '✅ 经期记录成功！',
        icon: 'none'
      })

      // 关闭弹窗并刷新数据
      this.closePeriodModal()
      this.refreshData()
    } catch (error) {
      console.error('保存经期记录失败:', error)
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      })
    }
  },

  // 提交症状记录
  submitSymptomRecord(e: any) {
    const { symptomForm } = this.data

    // 验证数据
    if (!symptomForm.date) {
      wx.showToast({
        title: '请选择日期',
        icon: 'none'
      })
      return
    }

    // 保存症状记录
    try {
      const periodData = wx.getStorageSync('periodData') || {
        periods: [],
        symptoms: [],
        lastPeriod: null,
        cycleLength: 28,
        periodLength: 5
      }

      const newSymptom = {
        id: Date.now(),
        date: symptomForm.date,
        mood: symptomForm.mood,
        symptoms: symptomForm.symptoms,
        note: symptomForm.note,
        createdAt: new Date().toISOString()
      }

      // 检查是否已有当天的记录，如果有则更新
      const existingIndex = periodData.symptoms.findIndex((s: any) => s.date === symptomForm.date)
      if (existingIndex > -1) {
        periodData.symptoms[existingIndex] = newSymptom
      } else {
        periodData.symptoms.unshift(newSymptom)
      }

      wx.setStorageSync('periodData', periodData)

      wx.showToast({
        title: '✅ 症状记录成功！',
        icon: 'none'
      })

      // 关闭弹窗并刷新数据
      this.closeSymptomModal()
      this.refreshData()
    } catch (error) {
      console.error('保存症状记录失败:', error)
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      })
    }
  }
})
