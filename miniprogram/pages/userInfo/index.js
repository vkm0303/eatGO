/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-22 19:12:19
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-03-08 09:45:33
 * @FilePath: \tastygo\miniprogram\pages\userInfo\index.js
 */

const { updateUserInfo, getUserInfo } = require('../../api/api');

var userInfo = {};

Page({

    data: {
        userInfo: {}
    },
    onLoad: async function(options) {
        const that = this;
        userInfo = wx.getStorageSync('userInfo');
        const res = await getUserInfo({ id: userInfo.campusId });
        if (res.code === 200) {
            userInfo = res.data;
            wx.setStorageSync('userInfo', userInfo);
        }
        that.setData({
            userInfo
        })
    },

    wxidInput(e) {
        userInfo.wxId = e.detail.value;
    },

    phoneInput(e) {
        userInfo.phone = e.detail.value;
    },

    async save() {
        wx.showLoading({
            title: '正在保存',
        });
        const params = {
            campusId: userInfo.campusId,
            wxId: userInfo.wxId,
            phone: userInfo.phone
        };
        wx.hideLoading();
        let res = await updateUserInfo(params);
        if (res.code === 200) {
            wx.setStorageSync('userInfo', userInfo);
            wx.showToast({
                title: '保存成功',
                icon: 'none'
            });
        } else {
            wx.showToast({
                title: '保存失败',
                icon: 'none'
            });
        }
    }

})