/*
 * @Description: 
 * @Author: AS
 * @Date: 2021-02-11 14:23:03
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-03-01 23:03:12
 * @FilePath: \tastygo\miniprogram\pages\myOrderList\index.js
 */

const { getUserOrder, cancelOrder } = require('../../api/api');

const PAGESIZE = 10;
var currentPage = 0;
const orderType = ['release', 'receive'];

Page({

    data: {
        tabIdx: 0,
        releaseOrderList: [],
        receiveOrderList: [],
        getWays: ['自提', '送餐上门'],

        loadingTips: '',
        loading: true
    },

    onLoad: function(options) {

        this.changeBgcColor();
    },

    onShow: function() {
        const { tabIdx } = this.data;
        wx.showLoading({
            title: '加载中',
        });
        this.getUserOrderList(orderType[tabIdx], true);
        wx.hideLoading();
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
        this.getUserOrderList(orderType[current], true);
    },

    scrollToLower() {
        currentPage++;
        this.getUserOrderList(orderType[this.data.tabIdx]);
    },

    async getUserOrderList(orderType, isClearData = false) {
        let { releaseOrderList, receiveOrderList } = this.data;
        const userInfo = wx.getStorageSync('userInfo');
        if (isClearData) {
            currentPage = 0;
        }
        const params = {
            id: userInfo.no,
            orderType,
            currentPage,
            pageSize: PAGESIZE
        };
        let res = await getUserOrder(params);

        let loadingTips = '';
        if (!res.data.length) {
            loadingTips = '已经到底了'
        }

        if (orderType === 'release') {
            if (isClearData) {
                releaseOrderList = [];
            }
            releaseOrderList.push(...res.data);
            console.log(releaseOrderList)

            this.setData({
                releaseOrderList,
                loadingTips,
                loading: false
            });
        } else {
            if (isClearData) {
                receiveOrderList = [];
            }
            receiveOrderList.push(...res.data);

            console.log(receiveOrderList)
            this.setData({
                receiveOrderList,
                loadingTips,
                loading: false
            });
        }
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
                            title: '刷新数据...'
                        });
                        that.getUserOrderList(orderType[tabIdx], true);
                        wx.hideLoading();
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

    goToOrderDetail(e) {
        const orderId = e.currentTarget.dataset.orderid;
        wx.navigateTo({
            url: `/pages/takeOrderDetail/index?orderId=${orderId}`
        });
    },

    //阻止点击穿透
    preventTap() {},
})