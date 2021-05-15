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
        isShow: false
    },
    onLoad: function () {

    },
    onShow: function () {
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
            that.setData({
                isLogin: false
            })
        }
        wx.cloud.database().collection('hideSomething')
            .doc("myOrder")
            .get({
                success(res) {
                    console.log("请求成功", res.data.isShow)
                    that.setData({
                        isShow: res.data.isShow
                    })
                },
                fail(res) {
                    console.log("请求失败", res)
                }
            })
    },
    handleLogin(e) {
        wx.navigateTo({
            url: '/pages/login/index'
        })
    }

})