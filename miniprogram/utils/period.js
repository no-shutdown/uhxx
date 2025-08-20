"use strict";
// 薄荷生活 - 经期计算工具
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodCalculator = void 0;
const util_1 = require("./util");
/**
 * 经期计算工具类
 */
class PeriodCalculator {
    /**
     * 计算下次经期预测
     */
    static predictNextPeriod(periodData) {
        if (!periodData.lastPeriod) {
            return null;
        }
        const lastPeriodDate = new Date(periodData.lastPeriod);
        const cycleLength = periodData.cycleLength || 28;
        const today = new Date();
        // 计算下次经期日期
        const nextPeriodDate = new Date(lastPeriodDate.getTime() + cycleLength * 24 * 60 * 60 * 1000);
        // 计算排卵日（经期开始前14天）
        const ovulationDate = new Date(nextPeriodDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        // 计算易孕期（排卵日前5天到排卵日后1天）
        const fertileWindowStart = new Date(ovulationDate.getTime() - 5 * 24 * 60 * 60 * 1000);
        const fertileWindowEnd = new Date(ovulationDate.getTime() + 1 * 24 * 60 * 60 * 1000);
        // 计算距离下次经期的天数
        const daysToNextPeriod = Math.ceil((nextPeriodDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
        // 计算当前周期第几天
        const cycleDay = Math.floor((today.getTime() - lastPeriodDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
        // 判断当前阶段
        const phase = this.getCurrentPhase(today, lastPeriodDate, periodData.periodLength, cycleLength);
        return {
            nextPeriodDate,
            ovulationDate,
            fertileWindowStart,
            fertileWindowEnd,
            daysToNextPeriod: Math.max(0, daysToNextPeriod),
            cycleDay: Math.max(1, cycleDay),
            phase
        };
    }
    /**
     * 获取当前月经周期阶段
     */
    static getCurrentPhase(currentDate, lastPeriodDate, periodLength, cycleLength) {
        const daysSinceLastPeriod = Math.floor((currentDate.getTime() - lastPeriodDate.getTime()) / (24 * 60 * 60 * 1000));
        if (daysSinceLastPeriod < 0) {
            return 'luteal'; // 如果当前日期在上次经期之前，认为是黄体期
        }
        if (daysSinceLastPeriod < periodLength) {
            return 'menstrual'; // 经期
        }
        const ovulationDay = cycleLength - 14; // 排卵日通常在下次经期前14天
        if (daysSinceLastPeriod < ovulationDay - 2) {
            return 'follicular'; // 卵泡期
        }
        if (daysSinceLastPeriod <= ovulationDay + 2) {
            return 'ovulation'; // 排卵期
        }
        return 'luteal'; // 黄体期
    }
    /**
     * 判断指定日期是否为经期
     */
    static isPeriodDay(date, periodData) {
        const targetDate = typeof date === 'string' ? new Date(date) : date;
        return periodData.periods.some(period => {
            const startDate = new Date(period.startDate);
            const endDate = new Date(period.endDate);
            return targetDate >= startDate && targetDate <= endDate;
        });
    }
    /**
     * 判断指定日期是否为排卵期
     */
    static isOvulationDay(date, periodData) {
        if (!periodData.lastPeriod)
            return false;
        const targetDate = typeof date === 'string' ? new Date(date) : date;
        const lastPeriodDate = new Date(periodData.lastPeriod);
        const cycleLength = periodData.cycleLength || 28;
        // 计算排卵日（下次经期前14天）
        const nextPeriodDate = new Date(lastPeriodDate.getTime() + cycleLength * 24 * 60 * 60 * 1000);
        const ovulationDate = new Date(nextPeriodDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        // 排卵期前后2天
        const diffDays = Math.abs((targetDate.getTime() - ovulationDate.getTime()) / (24 * 60 * 60 * 1000));
        return diffDays <= 2;
    }
    /**
     * 判断指定日期是否为预测经期
     */
    static isPredictedPeriodDay(date, periodData) {
        if (!periodData.lastPeriod)
            return false;
        const targetDate = typeof date === 'string' ? new Date(date) : date;
        const lastPeriodDate = new Date(periodData.lastPeriod);
        const cycleLength = periodData.cycleLength || 28;
        const periodLength = periodData.periodLength || 5;
        // 计算下次经期开始和结束日期
        const nextPeriodStart = new Date(lastPeriodDate.getTime() + cycleLength * 24 * 60 * 60 * 1000);
        const nextPeriodEnd = new Date(nextPeriodStart.getTime() + (periodLength - 1) * 24 * 60 * 60 * 1000);
        return targetDate >= nextPeriodStart && targetDate <= nextPeriodEnd;
    }
    /**
     * 判断指定日期是否为易孕期
     */
    static isFertileDay(date, periodData) {
        if (!periodData.lastPeriod)
            return false;
        const targetDate = typeof date === 'string' ? new Date(date) : date;
        const lastPeriodDate = new Date(periodData.lastPeriod);
        const cycleLength = periodData.cycleLength || 28;
        // 计算排卵日
        const nextPeriodDate = new Date(lastPeriodDate.getTime() + cycleLength * 24 * 60 * 60 * 1000);
        const ovulationDate = new Date(nextPeriodDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        // 易孕期：排卵日前5天到排卵日后1天
        const fertileStart = new Date(ovulationDate.getTime() - 5 * 24 * 60 * 60 * 1000);
        const fertileEnd = new Date(ovulationDate.getTime() + 1 * 24 * 60 * 60 * 1000);
        return targetDate >= fertileStart && targetDate <= fertileEnd;
    }
    /**
     * 计算平均周期长度
     */
    static calculateAverageCycle(periods) {
        if (periods.length < 2) {
            return 28; // 默认周期长度
        }
        const cycles = [];
        for (let i = 0; i < periods.length - 1; i++) {
            const currentPeriod = new Date(periods[i].startDate);
            const nextPeriod = new Date(periods[i + 1].startDate);
            const cycleLength = Math.abs((0, util_1.daysBetween)(currentPeriod, nextPeriod));
            // 只考虑合理的周期长度（21-45天）
            if (cycleLength >= 21 && cycleLength <= 45) {
                cycles.push(cycleLength);
            }
        }
        if (cycles.length === 0) {
            return 28;
        }
        const sum = cycles.reduce((total, cycle) => total + cycle, 0);
        return Math.round(sum / cycles.length);
    }
    /**
     * 计算平均经期长度
     */
    static calculateAveragePeriodLength(periods) {
        if (periods.length === 0) {
            return 5; // 默认经期长度
        }
        const lengths = [];
        periods.forEach(period => {
            const startDate = new Date(period.startDate);
            const endDate = new Date(period.endDate);
            const length = (0, util_1.daysBetween)(startDate, endDate) + 1;
            // 只考虑合理的经期长度（2-10天）
            if (length >= 2 && length <= 10) {
                lengths.push(length);
            }
        });
        if (lengths.length === 0) {
            return 5;
        }
        const sum = lengths.reduce((total, length) => total + length, 0);
        return Math.round(sum / lengths.length);
    }
    /**
     * 生成日历数据
     */
    static generateCalendarData(year, month, periodData) {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        const firstDayWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        const today = new Date();
        const calendarDays = [];
        // 添加上个月的日期
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        const prevMonthLastDay = new Date(prevYear, prevMonth, 0).getDate();
        for (let i = firstDayWeek - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            const dateStr = `${prevYear}-${prevMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            calendarDays.push({
                day: day,
                date: dateStr,
                class: 'other-month',
                isToday: false,
                isPeriod: false,
                isOvulation: false,
                isPredicted: false,
                isFertile: false
            });
        }
        // 添加当月的日期
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const currentDate = new Date(year, month - 1, day);
            const isToday = (0, util_1.isSameDay)(currentDate, today);
            const isPeriod = this.isPeriodDay(currentDate, periodData);
            const isOvulation = this.isOvulationDay(currentDate, periodData);
            const isPredicted = this.isPredictedPeriodDay(currentDate, periodData);
            const isFertile = this.isFertileDay(currentDate, periodData);
            let dayClass = '';
            if (isToday)
                dayClass = 'today';
            else if (isPeriod)
                dayClass = 'period';
            else if (isOvulation)
                dayClass = 'ovulation';
            else if (isPredicted)
                dayClass = 'predicted';
            else if (isFertile)
                dayClass = 'fertile';
            calendarDays.push({
                day: day,
                date: dateStr,
                class: dayClass,
                isToday,
                isPeriod,
                isOvulation,
                isPredicted,
                isFertile
            });
        }
        // 添加下个月的日期
        const remainingDays = 42 - calendarDays.length;
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        for (let day = 1; day <= remainingDays; day++) {
            const dateStr = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            calendarDays.push({
                day: day,
                date: dateStr,
                class: 'other-month',
                isToday: false,
                isPeriod: false,
                isOvulation: false,
                isPredicted: false,
                isFertile: false
            });
        }
        return calendarDays;
    }
    /**
     * 获取周期阶段描述
     */
    static getPhaseDescription(phase) {
        const descriptions = {
            'menstrual': '经期 - 注意休息，保持温暖',
            'follicular': '卵泡期 - 精力充沛，适合运动',
            'ovulation': '排卵期 - 易孕期，注意避孕',
            'luteal': '黄体期 - 情绪波动，注意调节'
        };
        return descriptions[phase] || '未知阶段';
    }
    /**
     * 获取流量描述
     */
    static getFlowDescription(flow) {
        const descriptions = {
            'light': '少量',
            'normal': '正常',
            'heavy': '较多',
            'very_heavy': '很多'
        };
        return descriptions[flow] || '未知';
    }
}
exports.PeriodCalculator = PeriodCalculator;
