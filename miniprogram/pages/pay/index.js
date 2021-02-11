/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-10 23:59:19
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-11 21:07:03
 * @FilePath: \tastygo\miniprogram\pages\pay\index.js
 */
 
Page({
    data: {
        ishideTimePicker: false,
        timeBoxIndex: -1,
        startTime: '00:00',
        endTime: '23:59',
        presetHours: '12',
        presetMinutes: '30',
        array:["无需餐具", '1 份', '2 份', '3 份', '4 份', '5 份'],
        arrIndex: -1,
    },
    onLoad: function(options) {
        const that = this;
        that.setTimeRange();
        const canteenOrder = wx.getStorageSync('canteenOrder')
        that.setData({
            canteenOrder,
            totalNum: options.totalNum,
            totalPrice: options.totalPrice
        })
    },
    onShow: function() {
        const that = this;
        const app = getApp();
        that.setData({ addressInfo: app.globalData.currentAddress })
    },
    handleOrderPay() {
        //wx.showLoading({ title: '支付中' })
        let date = new Date();
        let currentDate = '' + date.getFullYear() + (date.getMonth() + 1) + date.getDate()
        console.log(currentDate)
        console.log(date.getFullYear())
        console.log(date.getMonth() + 1)
        console.log(date.getDate())
        let orderNo = "01" +
            setTimeout(() => {
                wx.hideLoading()
                wx.showToast({
                    title: '支付成功',
                    success: () => {
                        const db = wx.cloud.database()
                        db.collection('sztu_order').add({
                            data: {
                                account: 123456,
                                receiveAddress: this.data.addressInfo,
                                totalPrice: this.data.totalPrice,
                                totalNum: this.data.totalNum,
                                detail: this.data.canteenOrder,
                                isReceive: false
                            }
                        })
                    }
                });
            }, 1000)

    },

    handleTimeBoxClick(e) {
        const that = this;
        let { index } = e.currentTarget.dataset;
        let ishideTimePicker = false;
        if(index === that.data.timeBoxIndex) {
            if(index === 1) {
                ishideTimePicker = true;
            }
            index = -1;
        }
        if(index === 0) {
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
        const arrIndex = Number(e.detail.value);
        that.setData({
            arrIndex,
        })
        console.log(arrIndex)
    },

    setDefaultTime() {
        const that = this;
        let nowDate = new Date();
        let nowHours = nowDate.getHours();
        let nowMinutes = nowDate.getMinutes();
        let presetHours, presetMinutes;
        if(nowHours < 11 && nowHours >= 9) {
            presetHours = 11;
            presetMinutes = 30;
        } else if(nowHours >= 13 && nowHours < 17) {
            presetHours = 17;
            presetMinutes = 30;
        } else if(nowHours >= 21 || (nowHours === 20 &&nowMinutes > 30) || nowHours < 7) {
            presetHours = 7;
            presetMinutes = 30;
        } else {
            presetHours = nowHours;
            presetMinutes = nowMinutes;
            if(presetMinutes + 30 >= 60) {
                if(presetHours + 1 >= 24) {
                    presetHours = 0;
                } else {
                    presetHours ++;
                }
                presetMinutes = 60 - nowMinutes;
            } else {
                presetMinutes += 30;
            }
        }
        if(presetHours < 10) {
            presetHours = '0' + presetHours;
        }
        if(presetMinutes < 10) {
            presetMinutes = '0' +presetMinutes;
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
        let startTime, endTime; 
        if(nowHours >= 9 && nowHours < 11) {
            startTime = '11:00';
            endTime = '13:20'
        } else if(nowHours >= 14 && nowHours <=21) {
            startTime = '17:00';
            endTime = '21:20';
        } else {
            startTime = '07:00';
            endTime = '09:20'
        }
        that.setData({
            startTime,
            endTime,
        })
    },
})