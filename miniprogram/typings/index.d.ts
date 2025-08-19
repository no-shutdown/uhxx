/// <reference types="miniprogram-api-typings" />

// 全局类型声明
declare global {
  // 应用实例类型
  interface IAppOption {
    globalData: {
      userInfo?: WechatMiniprogram.UserInfo
      transactions: import('../types/index').Transaction[]
      periodData: import('../types/index').PeriodData
      settings: import('../types/index').AppSettings
    }
    userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback
  }
}

// 模块声明
declare module '*.json' {
  const value: any
  export default value
}

declare module '*.wxml' {
  const value: string
  export default value
}

declare module '*.wxss' {
  const value: string
  export default value
}

// 导出空对象以使此文件成为模块
export {}
