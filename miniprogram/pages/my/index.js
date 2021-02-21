/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-10 23:59:19
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-21 20:08:21
 * @FilePath: \tastygo\miniprogram\pages\my\index.js
 */
Page({
    data: {
        isLogin: false
    },
    onLoad: function(options) {},
    onShow: function() {
        const app = getApp()
        if (app.globalData.isLogin) {
            const userInfo = wx.getStorageSync('userInfo');
            if (userInfo) {
                app.globalData.isLogin = true
                this.setData({
                    headPicUrl: userInfo.avatarUrl,
                    name: userInfo.realname,
                    no: userInfo.no,
                    isLogin: true
                })
            }
        } else
            this.setData({ isLogin: false })
    },
    handleLogin(e) {
        wx.navigateTo({
            url: '/pages/login/index'
        })
    }
})