/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-10 23:59:19
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-03-01 00:29:19
 * @FilePath: \tastygo\miniprogram\pages\pay\index.js
 */
const { toTimeStamp, timeCountDown } = require("../../utils/util");
const { getAddressList, getMenuDetail, submitOrder } = require('../../api/api');

var addressIdx = 0;
var addressList = [];
var addressDetail = '';

Page({
    data: {
        ishideTimePicker: false,
        timeBoxIndex: 0,
        startTime: '00:00',
        endTime: '23:59',
        presetHours: '12',
        presetMinutes: '30',
        tablewares: ["无需餐具", '1 份', '2 份', '3 份', '4 份', '5 份'],
        tbwIdx: -1,
        note: '',
        orderDetail: [],
        focusOptions: [
            '男生宿舍17A',
            '男生宿舍17B',
        ],
        addressList: [],
        getWay: 0,
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
        wx.showLoading({ title: '加载中' });

        let canteenOrder = wx.getStorageSync('canteenOrder');
        let orderDetail = wx.getStorageSync('orderDetail');
        const { getWay } = options;

        canteenOrder.price += 4;
        that.setData({
            getWay,
            orderDetail,
            totalPrice: canteenOrder.price.toFixed(1)
        });

        that.setDefaultTime(); //设置默认时间
        that.setTimeRange(); //设置时间选择器范围

        //获取收货地址列表
        let res = await getAddressList();
        addressList = res.data;
        let focusOptions = [];
        if (addressList.length) {
            for (let v of addressList) {
                focusOptions.push(v.addressName);
            }
        } else {
            focusOptions = ['男生宿舍17B', '男生宿舍17A', '女生宿舍17B'];
        }

        that.setData({
            focusOptions,
        });
        let endTime = toTimeStamp('21:20:00');
        timeCountDown(that, endTime);

        wx.hideLoading();
    },
    onShow: function() {
        const that = this;
        const canteenOrder = wx.getStorageSync('canteenOrder');
        if (!canteenOrder) {
            wx.navigateBack({
                delta: 1
            });
        }
    },
    async handleOrderSubmit() {
        const that = this;

        if (addressDetail === '' && that.data.getWay == 1) {
            wx.showToast({
                title: '未填写详细地址',
                icon: 'none',
                duration: 2000,
            });
            return;
        }

        const { presetHours, presetMinutes, tbwIdx, note } = that.data;
        let canteenOrder = wx.getStorageSync('canteenOrder');
        const campusId = wx.getStorageSync('userInfo').no;

        canteenOrder.menusId = JSON.stringify(canteenOrder.menusId);
        canteenOrder.campusId = campusId;
        canteenOrder.addressId = addressList[addressIdx].addressId;
        canteenOrder.addressDetail = addressDetail;
        canteenOrder.arrivalTime = presetHours + ':' + presetMinutes;
        canteenOrder.note = note;
        canteenOrder.tableware = tbwIdx === -1 ? 1 : tbwIdx;

        let res = await submitOrder(canteenOrder);
        console.log(res);
        if (res.msg === 'success') {
            wx.requestSubscribeMessage({
                tmplIds: ['LjrtLzhdr9neIoNPR8s08SLWKxyv6creVn627vrqQtU', 'GgNdlRXIff0qE3t3AP6VHMtg1nyqtzqcYDo4ZHwJmHo', 'Ylw5kbld12nZ5qvCM2tEwaoV7F7S1barD5YCxi8GpNM']
            })
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
        if (index === 0) {
            that.setDefaultTime();
        }
        that.setData({
            timeBoxIndex: index,
        });
    },

    pickerTimeSelect(e) {
        const that = this;
        let presetTime = e.detail.value;
        const presetHours = presetTime.split(':')[0];
        const presetMinutes = presetTime.split(':')[1];
        that.setData({
            presetHours,
            presetMinutes,
        });
    },

    handlePickerChange(e) {
        const that = this;
        const tbwIdx = Number(e.detail.value);
        that.setData({
            tbwIdx,
        })
    },

    handleAddressSelect(e) {
        addressIdx = e.detail.index;
    },

    handleAddressInput(e) {
        addressDetail = e.detail.value;
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