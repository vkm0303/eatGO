/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2020-09-21 11:44:34
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-03-07 21:20:24
 * @FilePath: \tastygo\miniprogram\app.js
 */
App({
    onLaunch: function() {
        const that = this

        // 登录
        wx.login({
                success: res => {
                    console.log(res)
                    wx.getUserInfo({
                        withCredentials: 'false',
                        lang: 'zh_CN',
                        timeout: 10000,
                        success: (result) => {
                            let userInfo = wx.getStorageSync('userInfo');
                            userInfo.nickname = result.nickName;
                            userInfo.avartar = result.avartarUrl;
                        }
                    });
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
        });

        // 获取系统信息
        const systemInfo = wx.getSystemInfoSync();
        // 胶囊按钮位置信息
        const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
        // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
        that.globalData.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height + systemInfo.statusBarHeight;
        that.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
        that.globalData.menuBottom = menuButtonInfo.top - systemInfo.statusBarHeight;
        that.globalData.menuHeight = menuButtonInfo.height;

        //初始化用户信息
        const loginState = wx.getStorageSync('loginState')
        if (loginState) {
            const userInfo = wx.getStorageSync('userInfo')
            that.globalData.userInfo = userInfo
            that.globalData.isLogin = loginState
        }

        wx.removeStorageSync('canteenOrder');
        wx.removeStorageSync('orderDetail');
    },
    globalData: {
        userInfo: {},
        isLogin: false,
        apiBaseUrl: 'https://www.tastygo.cn/haochigoserver/wxapi',

        navBarHeight: 0, // 导航栏高度
        menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
        menuBottom: 0, // 胶囊距底部间距（保持底部间距一致）
        menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
    }
})