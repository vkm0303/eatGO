/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-10 23:59:19
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-11 17:05:08
 * @FilePath: \tastygo\miniprogram\pages\pay\index.js
 */
 
Page({
    data: {
        array:["无需餐具", 1, 2, 3, 4, 5],
        arrIndex: -1,
    },
    onLoad: function(options) {
        const canteenOrder = wx.getStorageSync('canteenOrder')
        this.setData({
            canteenOrder,
            totalNum: options.totalNum,
            totalPrice: options.totalPrice
        })
    },
    onShow: function() {
        const app = getApp();
        this.setData({ addressInfo: app.globalData.currentAddress })
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
    
    handlePickerChange(e) {
        const that = this;
        const arrIndex = Number(e.detail.value);
        that.setData({
            arrIndex,
        })
        console.log(arrIndex)
    }
})