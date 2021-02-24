/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-22 19:12:19
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-24 13:06:35
 * @FilePath: \tastygo\miniprogram\pages\userInfo\index.js
 */
var wxid = '';
var phone = '';
var userInfo = {};

Page({

    data: {
        userInfo: {}
    },
    onLoad: function(options) {
        const that = this;
        userInfo = wx.getStorageSync('userInfo');
        that.setData({
            userInfo
        })
    },

    wxidInput(e) {
        userInfo.wxid = e.detail.value;
    },

    phoneInput(e) {
        userInfo.phone = e.detail.value;
    },

    save() {
        wx.showLoading({
            title: '正在保存',
        });
        console.log(userInfo)
        wx.setStorageSync('userInfo', userInfo);
        wx.hideLoading();
        wx.showToast({
            title: '保存成功',
            icon: 'none'
        });
    }

})