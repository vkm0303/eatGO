/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-22 19:12:19
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-22 20:31:58
 * @FilePath: \tastygo\miniprogram\pages\userInfo\index.js
 */

const app = getApp();
var wxid = '';
var phone = '';
var { userInfo } = app.globalData;

Page({

    data: {
        userInfo: {}
    },
    onLoad: function(options) {
        const that = this;
        that.setData({
            userInfo
        })
    },

    wxidInput(e) {
        wxid = e.detail.value;
    },

    phoneInput(e) {
        phone = e.detail.value;
    },

    save() {
        wx.showLoading({
            title: '正在保存',
        });
        userInfo.wxid = wxid;
        userInfo.phone = phone;
        app.globalData.userInfo = userInfo;
        wx.setStorageSync('userInfo', userInfo);
        wx.hideLoading();
        wx.showToast({
            title: '保存成功',
            icon: 'none'
        });
    }

})