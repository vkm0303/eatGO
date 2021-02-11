/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2020-09-21 11:44:34
 * @LastEditors: AS
 * @LastEditTime: 2021-02-09 23:33:36
 * @FilePath: \好吃GO\miniprogram\app.js
 */
//app.js
App({
    onLaunch: function() {
        const that = this
            // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
                success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                }
            })
            // 获取用户信息
        wx.getSetting({
                success: res => {
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                        wx.getUserInfo({
                            success: res => {
                                // 可以将 res 发送给后台解码出 unionId
                                //that.globalData.userInfo.nickname = res.userInfo.nickname
                                //that.globalData.userInfo.avatarUrl = res.userInfo.avatarUrl

                                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                // 所以此处加入 callback 以防止这种情况
                                //if (this.userInfoReadyCallback) {
                                //    this.userInfoReadyCallback(res)
                                //}
                            }
                        })
                    }
                }
            })
            //初始化地址信息
            //const app = getApp()
            //初始化用户信息
        const loginState = wx.getStorageSync('loginState')
        if (loginState) {
            const userInfo = wx.getStorageSync('userInfo')
            that.globalData.userInfo = userInfo
            that.globalData.isLogin = loginState
        }
        wx.cloud.init()
        const addressList = wx.getStorageSync('addressList')
        if (addressList) {
            addressList.map((item) => {
                if (item.isDefault) {
                    that.globalData.defaultAddress = item
                    that.globalData.currentAddress = item
                }
            })
        }
        const db = wx.cloud.database()
        db.collection('beiqu_menu').get().then(res => {
            wx.setStorageSync('beiqu_menu', res.data)
        })
        db.collection('nanqu_menu').get().then(res => {
            wx.setStorageSync('nanqu_menu', res.data)
        })
        db.collection('zuyun_menu').get().then(res => {
            wx.setStorageSync('zuyun_menu', res.data)
        })
        db.collection('shijin_menu').get().then(res => {
            wx.setStorageSync('shijin_menu', res.data)
        })
    },
    globalData: {
        userInfo: {},
        currentAddress: '',
        defaultAddress: '',
        isLogin: false,
        apiBaseUrl: 'https://www.tastygo.cn/haochigoserver/wxapi',
    }
})