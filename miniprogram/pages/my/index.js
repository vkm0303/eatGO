/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-10 23:59:19
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-23 16:05:16
 * @FilePath: \tastygo\miniprogram\pages\my\index.js
 */
Page({
    data: {
        isLogin: false,
    },
    onShow: function() {
        const that = this;
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            that.setData({
                headPicUrl: userInfo.avatarUrl,
                name: userInfo.realname,
                no: userInfo.no,
                isLogin: true
            })
        } else {
            that.setData({ isLogin: false })
        }
    },
    handleLogin(e) {
        wx.navigateTo({
            url: '/pages/login/index'
        })
    }
})