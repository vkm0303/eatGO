/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-10 23:59:19
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-03-07 21:19:14
 * @FilePath: \tastygo\miniprogram\pages\my\index.js
 */
const loginState = wx.getStorageSync('loginState');
Page({
    data: {
        isLogin: loginState,
    },
    onLoad: function() {

    },
    onShow: function() {
        const that = this;
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            that.setData({
                headPicUrl: userInfo.avatar,
                name: userInfo.realName,
                no: userInfo.campusId,
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