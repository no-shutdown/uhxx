"use strict";
// 薄荷生活 - 工具函数库
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.validatePhone = exports.throttle = exports.debounce = exports.deepClone = exports.generateId = exports.getYearRange = exports.getMonthRange = exports.isSameDay = exports.daysBetween = exports.formatAmount = exports.formatDate = exports.formatTime = void 0;
/**
 * 格式化时间
 */
const formatTime = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return ([year, month, day].map(formatNumber).join('/') +
        ' ' +
        [hour, minute, second].map(formatNumber).join(':'));
};
exports.formatTime = formatTime;
/**
 * 格式化数字，小于10的数字前面补0
 */
const formatNumber = (n) => {
    const s = n.toString();
    return s[1] ? s : '0' + s;
};
/**
 * 格式化日期为 YYYY-MM-DD 格式
 */
const formatDate = (date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return [year, month, day].map(formatNumber).join('-');
};
exports.formatDate = formatDate;
/**
 * 格式化金额，添加千分位分隔符
 */
const formatAmount = (amount, withSymbol = true) => {
    const formatted = amount.toLocaleString('zh-CN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
    return withSymbol ? `¥${formatted}` : formatted;
};
exports.formatAmount = formatAmount;
/**
 * 计算两个日期之间的天数差
 */
const daysBetween = (date1, date2) => {
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
    const timeDiff = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
};
exports.daysBetween = daysBetween;
/**
 * 判断是否为同一天
 */
const isSameDay = (date1, date2) => {
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};
exports.isSameDay = isSameDay;
/**
 * 获取月份的第一天和最后一天
 */
const getMonthRange = (year, month) => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    return {
        start: firstDay,
        end: lastDay,
        startStr: (0, exports.formatDate)(firstDay),
        endStr: (0, exports.formatDate)(lastDay)
    };
};
exports.getMonthRange = getMonthRange;
/**
 * 获取年份的第一天和最后一天
 */
const getYearRange = (year) => {
    const firstDay = new Date(year, 0, 1);
    const lastDay = new Date(year, 11, 31);
    return {
        start: firstDay,
        end: lastDay,
        startStr: (0, exports.formatDate)(firstDay),
        endStr: (0, exports.formatDate)(lastDay)
    };
};
exports.getYearRange = getYearRange;
/**
 * 生成唯一ID
 */
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
exports.generateId = generateId;
/**
 * 深拷贝对象
 */
const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (obj instanceof Array) {
        return obj.map(item => (0, exports.deepClone)(item));
    }
    if (typeof obj === 'object') {
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = (0, exports.deepClone)(obj[key]);
            }
        }
        return cloned;
    }
    return obj;
};
exports.deepClone = deepClone;
/**
 * 防抖函数
 */
const debounce = (func, wait) => {
    let timeout = null;
    return function (...args) {
        const context = this;
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
};
exports.debounce = debounce;
/**
 * 节流函数
 */
const throttle = (func, wait) => {
    let lastTime = 0;
    return function (...args) {
        const context = this;
        const now = Date.now();
        if (now - lastTime >= wait) {
            lastTime = now;
            func.apply(context, args);
        }
    };
};
exports.throttle = throttle;
/**
 * 验证手机号
 */
const validatePhone = (phone) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
};
exports.validatePhone = validatePhone;
/**
 * 验证邮箱
 */
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
