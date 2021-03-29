/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-15 13:25:23
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-03-18 21:38:41
 * @FilePath: \tastygo\miniprogram\pages\about\index.js
 */
// pages/about/index.js
Page({
    onShareAppMessage: function() {

    },
    goback() {
        wx.switchTab({ url: '/pages/menu/index' })
    }
})