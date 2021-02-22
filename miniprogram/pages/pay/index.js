/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-10 23:59:19
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-22 20:59:01
 * @FilePath: \tastygo\miniprogram\pages\pay\index.js
 */
const { toTimeStamp, timeCountDown } = require("../../utils/util");
const { getAddressList, getMenuDetail, submitOrder } = require('../../api/api');

var canteenOrder = wx.getStorageSync('canteenOrder');
var address = '男生宿舍17A';

Page({
    data: {
        ishideTimePicker: false,
        timeBoxIndex: -1,
        startTime: '00:00',
        endTime: '23:59',
        presetHours: '12',
        presetMinutes: '30',
        tablewares: ["无需餐具", '1 份', '2 份', '3 份', '4 份', '5 份'],
        tbwIdx: -1,
        note: '',
        orderDetail: [],
        focusOptions: [
            '男生宿舍17B',
            '男生宿舍17A',
        ],
        getWay: 'byDelivery',
        timeOptions: [{
                time: '11:20',
                status: 0,
            },
            {
                time: '11:40',
                status: 1,
            },
            {
                time: '12:20',
                status: -1
            },
            {
                time: '12:40',
                status: 1
            }
        ],
        countDownTxt: {
            hou: '00',
            min: '00',
            sec: '00'
        },

        totalPrice: 0
    },
    onLoad: async function(options) {
        const that = this;
        const { getWay } = options;

        wx.showLoading({ title: '加载中' });

        that.setDefaultTime();
        that.setTimeRange();
        let orderDetail = [];

        for (let el of canteenOrder.menusId) {
            let res = await getMenuDetail(el.menuId)
            res.data[0].num = el.num;
            orderDetail.push(res.data[0]);
        };

        //获取收货地址列表
        const data = await getAddressList();
        let focusOptions = [];
        if (data.length) {
            for (let v of data) {
                focusOptions.push(v.addressName);
            }
        } else {
            focusOptions = ['男生宿舍17B', '男生宿舍17A', '女生宿舍17B'];
        }

        canteenOrder.price += 4;

        that.setData({
            getWay,
            focusOptions,
            orderDetail,
            totalPrice: canteenOrder.price.toFixed(1)
        });
        let endTime = toTimeStamp('21:20:00');
        timeCountDown(that, endTime);

        wx.hideLoading();
    },
    onShow: function() {
        const that = this;
        canteenOrder = wx.getStorageSync('canteenOrder');
    },
    async handleOrderSubmit() {
        const that = this;
        const { presetHours, presetMinutes, tbwIdx, note } = that.data;
        const app = getApp();
        const campusId = app.globalData.userInfo.no;
        canteenOrder.menusId = JSON.stringify(canteenOrder.menusId);
        canteenOrder.campusId = campusId;
        canteenOrder.address = address;
        canteenOrder.arrivalTime = presetHours + ':' + presetMinutes;
        canteenOrder.note = note;
        canteenOrder.tableware = tbwIdx || 1;
        console.log(canteenOrder)

        let res = await submitOrder(canteenOrder);
        console.log(res);
        if (res.msg === 'success') {
            wx.removeStorageSync('canteenOrder');
            wx.removeStorageSync('orderDetail');
            wx.navigateTo({ url: '/pages/successMessage/index' });
        } else {
            wx.showToast({
                title: '提交失败',
                icon: 'none',
                duration: 3000
            });
        }
    },
    handleTimeBoxClick(e) {
        const that = this;
        let { index } = e.currentTarget.dataset;
        let ishideTimePicker = false;
        if (index === that.data.timeBoxIndex) {
            if (index === 1) {
                ishideTimePicker = true;
            }
            index = -1;
        }
        if (index === 0) {
            that.setDefaultTime();
        }
        that.setData({
            timeBoxIndex: index,
        });
    },

    handleTimeSelect(e) {
        const that = this;
        let presetTime = e.detail.value;
        const presetHours = presetTime.split(':')[0];
        const presetMinutes = presetTime.split(':')[1];
        that.setData({
            presetHours,
            presetMinutes,
        });
    },

    handleCancelSelect() {
        const that = this;
        this.setData({
            timeBoxIndex: -1,
        })
    },

    handlePickerChange(e) {
        const that = this;
        const tbwIdx = Number(e.detail.value);
        that.setData({
            tbwIdx,
        })
    },

    handleAddressSelect(e) {
        const that = this;
        const { index } = e.detail;
        address = that.data.focusOptions[index];
    },

    handleAddressInput(e) {
        address += ' ';
        address += e.detail.value;
    },

    setDefaultTime() {
        const that = this;
        let nowDate = new Date();
        let nowHours = nowDate.getHours();
        let nowMinutes = nowDate.getMinutes();
        let presetHours, presetMinutes;
        if (nowHours < 11 && nowHours >= 9) {
            presetHours = 11;
            presetMinutes = 30;
        } else if (nowHours >= 13 && nowHours < 17) {
            presetHours = 17;
            presetMinutes = 30;
        } else if (nowHours >= 21 || (nowHours === 20 && nowMinutes > 30) || nowHours < 7) {
            presetHours = 7;
            presetMinutes = 30;
        } else {
            presetHours = nowHours;
            presetMinutes = nowMinutes;
            if (presetMinutes + 30 >= 60) {
                if (presetHours + 1 >= 24) {
                    presetHours = 0;
                } else {
                    presetHours++;
                }
                presetMinutes -= 30;
            } else {
                presetMinutes += 30;
            }
        }
        if (presetHours < 10) {
            presetHours = '0' + presetHours;
        }
        if (presetMinutes < 10) {
            presetMinutes = '0' + presetMinutes;
        }
        that.setData({
            presetHours,
            presetMinutes
        });
    },

    setTimeRange() {
        const that = this;
        let nowDate = new Date();
        let nowHours = nowDate.getHours();
        let nowMinutes = nowDate.getMinutes();
        let startTime, endTime;
        if (nowHours < 10) {
            startTime = '0' + nowHours;
        } else {
            startTime = '' + nowHours;
        }
        startTime += ':'
        if (nowMinutes < 10) {
            startTime += '0' + nowMinutes;
        } else {
            startTime += nowMinutes;
        }
        endTime = '23:59';
        that.setData({
            startTime,
            endTime,
        })
    },
})