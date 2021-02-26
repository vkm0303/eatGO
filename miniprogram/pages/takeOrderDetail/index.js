/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-13 14:23:30
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-27 00:10:07
 * @FilePath: \tastygo\miniprogram\pages\takeOrderDetail\index.js
 */

const { getOrderDetail } = require('../../api/api');

Page({
    data: {
        foods: [{
                name: '烧鸭饭',
                imgUrl: 'https://image.16pic.com/00/69/73/16pic_6973241_s.jpg?imageView2/0/format/png',
                num: 2,
                price: 9
            },
            {
                name: '咸水鸡饭',
                imgUrl: 'https://image.16pic.com/00/69/73/16pic_6973241_s.jpg?imageView2/0/format/png',
                num: 2,
                price: 8
            },
        ],
        orderDetail: {},
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
    }
})