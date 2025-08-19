/// <reference path="./types/wx/index.d.ts" />

// 全局类型声明
declare global {
  // 扩展 wx 全局对象
  namespace WechatMiniprogram {
    interface Wx {
      // 可以在这里添加自定义的 wx 方法类型
    }
  }

  // 全局变量
  const wx: WechatMiniprogram.Wx
  const App: WechatMiniprogram.App.Constructor
  const Page: WechatMiniprogram.Page.Constructor
  const Component: WechatMiniprogram.Component.Constructor
  const Behavior: WechatMiniprogram.Behavior.Constructor
  const getApp: WechatMiniprogram.GetApp
  const getCurrentPages: WechatMiniprogram.GetCurrentPages

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
