/*
 * @Description: 
 * @Author: AS
 * @Date: 2021-02-11 14:23:03
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-25 01:09:56
 * @FilePath: \tastygo\miniprogram\pages\myOrderList\index.js
 */

const { getUserOrder, cancelOrder } = require('../../api/api');

const PAGESIZE = 10;
var currentPage = 0;
const orderType = ['release', 'receive'];

Page({

    data: {
        tabIdx: 0,
        orderList: [],
        getWays: ['自提', '送餐上门'],
    },

    onLoad: function(options) {

        this.changeBgcColor();
    },

    onShow: function() {
        const { tabIdx } = this.data;
        wx.showLoading({
            title: '加载中',
        });
        this.getUserOrderList(orderType[tabIdx]);
    },

    onPullDownRefresh: function() {

    },

    onReachBottom: function() {

    },

    onShareAppMessage: function() {

    },

    tabsItemChange(e) {
        const { index } = e.currentTarget.dataset;
        this.setData({
            tabIdx: index
        });
    },

    swiperItemChange(e) {
        const { current } = e.detail;
        this.setData({
            tabIdx: current
        });
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        this.getUserOrderList(orderType[current]);
    },

    scrollToLower() {
        this.setData({
            isShowLoading: true
        });
        currentPage++;
        this.getUserOrderList(orderType[this.data.tabIdx]);
    },

    async getUserOrderList(orderType) {
        const userInfo = wx.getStorageSync('userInfo');
        const params = {
            id: userInfo.no,
            orderType,
            currentPage,
            pageSize: PAGESIZE
        };
        let res = await getUserOrder(params);
        let orderList = res.data;
        this.setData({
            orderList
        });
        wx.hideLoading();
    },

    cancelOrder(e) {
        const that = this;
        const { tabIdx } = that.data;
        const orderId = e.currentTarget.dataset.orderid;
        wx.showModal({
            title: '取消订单',
            content: '是否确定取消？',
            confirmColor: '#FF561B',
            success: async(result) => {
                if (result.confirm) {
                    const params = {
                        orderId,
                        orderType: 'release'
                    };
                    const res = await cancelOrder(params);
                    console.log(res)
                    if (res.msg === 'success') {
                        wx.showLoading({
                            title: '刷新数据...',
                            mask: true
                        });
                        that.getUserOrderList(orderType[tabIdx]);
                    } else {
                        wx.showToast({
                            title: '取消订单失败',
                            icon: 'none'
                        });
                    }
                }
            }
        });
    },

    changeBgcColor() {
        let activeAni = wx.createAnimation({
            duration: 300
        });
        activeAni.backgroundColor('#ff824e').step();

        let disactiveAni = wx.createAnimation({
            duration: 300
        });
        disactiveAni.backgroundColor('#f7d6b1').step();

        this.setData({
            activeAni: activeAni.export(),
            disactiveAni: disactiveAni.export()
        });

    },

    //阻止点击穿透
    preventTap() {},
})