/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-22 19:12:19
 * @LastEditors: AmsChen
 * @LastEditTime: 2021-05-16 00:22:06
 * @FilePath: \miniprogram\pages\userInfo\index.js
 */

const { updateUserInfo, getUserInfo } = require('../../api/api');

var userInfo = {};

Page({

    data: {
        userInfo: {},
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

    uploadQrCode() {
        const that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album'],
            success: (res)=>{
                let { userInfo } = that.data;
                userInfo.qrCode = res.tempFilePaths[0];
                that.setData({
                    userInfo,
                });
            },
        });
    },

    previewImg() {
        wx.previewImage({
            urls: [this.data.userInfo.qrCode]
        });
    },

    async save() {
        wx.showLoading({
            title: '正在保存',
        });
        const params = {
            campusId: userInfo.campusId,
            wxId: userInfo.wxId,
            phone: userInfo.phone,
            path: userInfo.qrCode,
        };
        wx.hideLoading();
        let res = await updateUserInfo(params);
        console.log(res);
        if (res['code'] === 200) {
            wx.setStorageSync('userInfo', userInfo);
            wx.showToast({
                title: '保存成功',
                icon: 'none',
                success: () => {
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 500);
                }
            });
        } else {
            wx.showToast({
                title: '保存失败',
                icon: 'none'
            });
        }
    }

})