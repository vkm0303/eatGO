/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-10 23:59:19
 * @LastEditors: AmsChen
 * @LastEditTime: 2021-05-17 23:58:27
 * @FilePath: \miniprogram\pages\pay\index.js
 */
const { toTimeStamp, timeCountDown } = require("../../utils/util");
const { getAddressList, submitOrder } = require('../../api/api');

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
        const { timeOptions } = that.data;

        if (getWay == 1) {
            canteenOrder.price += 2;
        } else {
            for (let el of timeOptions) {
                if (el.status !== -1) {
                    canteenOrder.arrivalTime = el.time;
                    break;
                }
            }
        }

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
        const canteenOrder = wx.getStorageSync('canteenOrder');
        if (!canteenOrder) {
            wx.navigateBack({
                delta: 1
            });
        }
    },

    handleOrderSubmit() {
        const that = this;
        if (addressDetail === '' && that.data.getWay == 1) {
            wx.showToast({
                title: '未填写详细地址',
                icon: 'none',
                duration: 2000,
            });
            return;
        }

        wx.showModal({
            title: '确认订单',
            content: '是否确认提交？',
            showCancel: true,
            success: async(result) => {
                if (result.confirm) {
                    const { presetHours, presetMinutes, tbwIdx, note } = that.data;
                    let canteenOrder = wx.getStorageSync('canteenOrder');
                    const { campusId } = wx.getStorageSync('userInfo');

                    //存储订单相关信息
                    canteenOrder.menusId = JSON.stringify(canteenOrder.menusId);
                    canteenOrder.campusId = campusId;
                    canteenOrder.arrivalTime = presetHours + ':' + presetMinutes;
                    canteenOrder.note = note;
                    canteenOrder.tableware = tbwIdx === -1 ? 1 : tbwIdx;

                    let tmplIds = ['XVye3K92uvlam8-NvQrXbNQEtvyG6Uzzuc4xXjgsaw8', 'g04W0i3K_tv76nEVrINmDR0bIhd-Wwu-3HhmSXItPOo', 'G0Cx1K1RxDKKR6rD2oDo2H9JEAIZumZ9BTRzXLnnA9c'];

                    //根据取餐方式选择对应订阅消息模板及地址
                    if (that.data.getWay == 1) {
                        canteenOrder.addressId = addressList[addressIdx].addressId;
                        canteenOrder.addressDetail = addressDetail;
                    } else {
                        canteenOrder.addressId = 0;
                        canteenOrder.addressDetail = '北区食堂二楼正门左侧置物架';
                        tmplIds = ['y4ngSfCL3EkzkZEIcpZxvFsJAkKfWk7IwwOGqyObQiQ'];

                    }

                    let res = await submitOrder(canteenOrder);
                    if (res.msg === 'success') {
                        wx.requestSubscribeMessage({ tmplIds }); //弹出订阅通知

                        //去除订单存储
                        wx.removeStorageSync('canteenOrder');
                        wx.removeStorageSync('orderDetail');

                        wx.navigateTo({ url: `/pages/successMessage/index?orderId=${res.orderId}` }); //跳转至成功页面
                    } else {
                        wx.showToast({
                            title: '提交失败',
                            icon: 'none',
                            duration: 3000
                        });
                    }
                }
            }
        });
    },

    goBackToMenu() {
        wx.switchTab({
            url: '/pages/menu/index'
        });
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

    //时间选择
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

    //餐具选择
    handlePickerChange(e) {
        const that = this;
        const tbwIdx = Number(e.detail.value);
        that.setData({
            tbwIdx,
        })
    },

    //选择下拉框地址
    handleAddressSelect(e) {
        addressIdx = e.detail.index;
    },

    //输入详细地址
    handleAddressInput(e) {
        addressDetail = e.detail.value;
    },

    //设置默认时间
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

    //设置可选择时间范围
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