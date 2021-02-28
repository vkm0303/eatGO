/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-13 14:23:30
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-28 13:37:50
 * @FilePath: \tastygo\miniprogram\pages\myOrderDetail\index.js
 */

const { getOrderDetail, changeOrderStatus } = require('../../api/api');

// var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
// var qqmapsdk;
Page({
    data: {
        getWay: '',
        status: ['订单取消', '等待接单', '等待配送', '正在配送', '已送达', '待确认收货', '已结束']
    },
    onLoad: async function(options) {
        const that = this;
        const { orderId } = options;
        that.getDetail(orderId);
        // qqmapsdk = new QQMapWX({
        //     key: 'DFJBZ-NRAKU-TVBVU-BQCDA-KZVIE-MSFNQ'
        // });
        // qqmapsdk.search({
        //     keyword: '深圳技术大学北区食堂',
        //     region: '深圳市',
        //     success: (res) => {
        //         // console.log(res)
        //         let latitude = res.data[3].location.lat;
        //         let longitude = res.data[3].location.lng;
        //         qqmapsdk.search({
        //             keyword: '深圳技术大学学生公寓17B栋',
        //             region: '深圳市',
        //             complete: (res2) => {
        //                 console.log(res2)
        //                 qqmapsdk.calculateDistance({
        //                     mode: 'walking',
        //                     from: {
        //                         latitude: res.data[3].location.lat,
        //                         longitude: res.data[3].location.lng,
        //                     },
        //                     to: [{
        //                         latitude: res2.data[0].location.lat,
        //                         longitude: res2.data[0].location.lng,
        //                     }],
        //                     complete: (res3) => {
        //                         console.log(res3)
        //                     }
        //                 })
        //             }
        //         });
        //         let markers = [{
        //             latitude,
        //             longitude,
        //             iconPath: '../../images/logo.png',
        //             width: 30,
        //             height: 30,
        //         }];
        //         that.setData({
        //             latitude,
        //             longitude,
        //             markers
        //         })
        //     }
        // });
    },

    onShow: function() {},

    async orderReceived() {
        const that = this;
        const { orderId } = that.data.orderDetail;
        const params = {
            orderId,
            orderType: 'release',
            action: '3'
        };

        const res = await changeOrderStatus(params);

        if (res.code === 200) {
            that.getDetail(orderId);
        }
    },

    async getDetail(orderId) {
        const that = this;
        const res = await getOrderDetail({ id: orderId });
        const orderDetail = res.data[0];
        that.setData({
            orderDetail
        });
    }
})