/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-15 13:25:26
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-03-28 22:09:08
 * @FilePath: \tastygo\miniprogram\pages\successMessage\index.js
 */

const { getOrderDetail, cancelOrder } = require("../../api/api");

Page({
    data: {
        orderDetail: [],
        tablewares: ['无需餐具', '1份', '2份', '3份', '4份', '5份']
    },

    onLoad: async function(options) {
        const { orderId } = options;
        let res = await getOrderDetail({ id: orderId });
        this.setData({
            orderDetail: res.data[0]
        });
    },

    goToOrderDetail() {
        const { orderId } = this.data.orderDetail;
        wx.navigateTo({ url: `/pages/myOrderDetail/index?orderId=${orderId}` });
    },

    cancel() {
        wx.showModal({
            title: '提示',
            content: '是否确定取消订单？',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#e93f3b',
            success: async(result) => {
                if (result.confirm) {
                    let res = await cancelOrder({
                        orderId: this.data.orderDetail.orderId,
                        orderType: 'release'
                    });
                    console.log(res)
                    if (res.code == 200) {
                        wx.showModal({
                            title: '提示',
                            content: '取消成功',
                            showCancel: false
                        });
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: res.msg,
                            showCancel: false
                        });
                    }
                }
            }
        });
    }
})