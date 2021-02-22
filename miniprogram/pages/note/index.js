/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-11 23:42:27
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-22 17:38:21
 * @FilePath: \tastygo\miniprogram\pages\note\index.js
 */
Page({
    data: {
        note: ''
    },
    onLoad: function() {
        const that = this;
        let pages = getCurrentPages();
        let prePage = pages[pages.length - 2];
        that.setData({
            note: prePage.data.note
        })
    },
    handleInput(e) {
        const that = this;
        const note = e.detail.value || '';
        that.setData({
            note
        });
    },
    handleConfirm() {
        const that = this;
        let pages = getCurrentPages();
        let prePage = pages[pages.length - 2];
        prePage.setData({
            note: that.data.note
        });

        wx.navigateBack({
            delta: 1
        });
    },
})