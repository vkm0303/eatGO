/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-13 14:23:30
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-03-28 14:51:47
 * @FilePath: \tastygo\miniprogram\pages\takeOrderDetail\index.js
 */

const { getOrderDetail, changeOrderStatus } = require('../../api/api');

Page({
    data: {
        orderDetail: {},
        status: ['订单取消', '等待接单', '等待打包', '等待配送', '已送达', '待确认收货', '已结束'],
        loading: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function(options) {
        wx.showLoading();
        const { orderId } = options;
        const res = await getOrderDetail({ id: orderId });
        let orderDetail = res.data[0];
        console.log(res)
        this.setData({
            orderDetail,
            loading: false
        });
        wx.hideLoading();
    },

    //复制信息
    copy(e) {
        const { content } = e.currentTarget.dataset;
        wx.setClipboardData({ data: content });
    },

    //确认送达
    async deliver() {
        const { orderDetail } = this.data;
        if (orderDetail.status != 2) {
            return;
        }
        const params = {
            orderId: orderDetail.orderId,
            orderType: 'release',
            action: '3'
        }
        let res = await changeOrderStatus(params);
        console.log(res)
    }
})