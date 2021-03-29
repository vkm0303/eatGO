/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-15 13:25:23
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-03-17 23:20:37
 * @FilePath: \tastygo\miniprogram\pages\accountManage\index.js
 */

Page({
    data: {
        isLogin: false
    },
    onShow: function(options) {
        const that = this;
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            that.setData({
                headPicUrl: userInfo.avatar,
                name: userInfo.realName,
                no: userInfo.campusId,
                isLogin: true
            })
        }
    },
    exitLoginState() {
        wx.setStorageSync('loginState', false)
        wx.removeStorageSync('userInfo');
        wx.removeStorageSync('queryPassword');
        this.setData({ isLogin: false })
    }
})