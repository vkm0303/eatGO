/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-15 13:25:25
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-24 14:29:09
 * @FilePath: \tastygo\miniprogram\pages\myCollection\index.js
 */
const app = getApp()
var account = ''
let indexs = []

Page({
    data: {
        isLogin: app.globalData.isLogin
    },
    onLoad: function(options) {},
    onShow: function() {

        if (app.globalData.isLogin)
            account = app.globalData.userInfo.no
        this.onLoadCollectionList()
    },
    onLoadCollectionList() {
        const that = this;
    },
    handleCancelCollect(e) {
        const { index } = e.currentTarget.dataset
        const that = this
        wx.showModal({
            title: '提示',
            content: '是否取消收藏',
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
        }).then(result => {
            if (result.confirm) {
                db.collection('user_collection').doc(indexs[index]._id).remove().then(() => {
                    that.onLoadCollectionList()
                })
            }
        })
    }
})