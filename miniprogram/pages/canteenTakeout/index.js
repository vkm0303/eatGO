wx.cloud.init()
const DB = wx.cloud.database()
Page({
    data: {
        //"我要带"变量
        curStartingIdx: 0,
        startingOptions: ['北区食堂', '北区西餐厅', '竹韵食堂', '石井食堂'],
        curFocusIdx: 0,
        focusOptions: ['男生宿舍17B', '男生宿舍17A', '女生宿舍17B'],
        //"我要吃"变量
        orderDetail: [],
        orderList: [],
        tabIndex: 0,
        getWayIndex: -1,
    },
    onLoad: function(options) {
        const canteenOrder = wx.getStorageSync("canteenOrder");
        if (canteenOrder.length === 0) {
            return
        }
        let totalPrice = 0
        let totalNum = 0
        for (let i = 0; i < canteenOrder.length; i++) {
            totalPrice += Number(canteenOrder[i].totalPrice)
            totalNum += Number(canteenOrder[i].num)
        }
        wx.showLoading({ mask: false })
        this.setData({
            orderDetail: canteenOrder,
            totalNum,
            totalPrice,
            isLogin: true
        })
        wx.hideLoading()
    },
    onShow: function() {
        const app = getApp()
        const { currentAddress } = app.globalData
        if (currentAddress.address != null) {
            this.setData({
                currentAddress: currentAddress,
                isAddressExist: true,
            })
        } else
            this.setData({ isAddressExist: false })
    },
    //切换Tabs
    handleItemChange(e) {

            const db = wx.cloud.database();
            db.collection('sztu_order')
                .where({ isReceive: false })
                .get().then(res => { this.setData({ orderList: res.data }) })  

    },
    moveLeft(e) {
        const that = this;
        const { index } = e.currentTarget.dataset;
        
        if(that.data.tabIndex === 1) {
            let translateLeft = wx.createAnimation({
                duration: 200,
                timingFunction: 'linear',
                delay: 0,
            });
            translateLeft.translateX(0).step();
            that.setData({
                tabIndex: index,
                moveAnimation: translateLeft.export(),
            });
        }
    },
    moveRight(e) {
        const that = this;
        const { index } = e.currentTarget.dataset;
        if(that.data.tabIndex === 0) {
            let translateRight = wx.createAnimation({
                duration: 200,
                timingFunction: 'linear',
                delay: 0,
            });
            translateRight.translateX(110).step();
            that.setData({
                tabIndex: index,
                moveAnimation: translateRight.export(),
            });
        }
        that.handleItemChange();
    },
    SelectorItemSelect(e) {
        const that = this;
        const { flag } = e.currentTarget.dataset;
        const { index } = e.detail;
        if(flag === 0) {
            that.setData({
                curStartingIdx: index
            });
        } else {
            that.setData({
                curFocusIdx: index
            });
        }
    },

    handleWaySelect(e) {
        const that = this;
        let { index } = e.currentTarget.dataset;
        if(that.data.getWayIndex === index) {
            index = -1;
        }
        that.setData({
            getWayIndex: index
        })
    },

    gotoSubmit() {
        const that = this;
        const { getWayIndex } = that.data;
        if(getWayIndex !== 0 && getWayIndex !== 1) {
            wx.showToast({
                title: '您还未选择取餐方式',
                icon: 'none'
            });
        } else {
            let getWay = (getWayIndex === 0 ? 'byself' : 'byDelivery');
            wx.navigateTo({url: `/pages/pay/index?getWay=${getWay}`});
        }
    },

    receiveOrder() {
        wx.showModal({
            title: '确认提示',
            content: '是否确定接单？',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
                if(result.confirm){
                    wx.navigateTo({url: '/pages/takeOrderDetail/index'});
                }
            }
        });
    }


    // handleReduceNum(e) {
    //     let { index, price } = e.currentTarget.dataset
    //     let { orderDetail } = this.data
    //         //判断是否移除商品操作
    //     if (orderDetail[index].num === 1) {
    //         wx.showModal({
    //             title: '提示',
    //             content: '是否移除该菜品',
    //             cancelText: '取消',
    //             cancelColor: '#3CC51F',
    //             confirmText: '移除',
    //             confirmColor: '#dbdbdb',
    //             success: (result) => {
    //                 if (result.confirm) {
    //                     orderDetail.splice(index, 1)
    //                     this.setData({
    //                         orderDetail,
    //                         totalNum: --this.data.totalNum,
    //                         totalPrice: this.data.totalPrice - e.currentTarget.dataset.price
    //                     })
    //                     wx.setStorageSync('canteenOrder', orderDetail)
    //                 }
    //             }
    //         });
    //     } else {
    //         orderDetail[index].num--;
    //         orderDetail[index].totalPrice -= Number(price)
    //         this.setData({
    //             orderDetail,
    //             totalNum: --this.data.totalNum,
    //             totalPrice: this.data.totalPrice - e.currentTarget.dataset.price
    //         })
    //         wx.setStorageSync('canteenOrder', orderDetail)
    //     }
    // },
    // handleAddNum(e) {
    //     let { index, price } = e.currentTarget.dataset
    //     let { orderDetail } = this.data
    //     orderDetail[index].num++;
    //     orderDetail[index].totalPrice += Number(price)
    //     this.setData({
    //         orderDetail,
    //         totalNum: ++this.data.totalNum,
    //         totalPrice: this.data.totalPrice + Number(price)
    //     })
    //     wx.setStorageSync('canteenOrder', orderDetail)
    // },
    // handAddFood() {
    //     wx.switchTab({
    //         url: '/pages/index/index'
    //     });
    // },
    // handlePay() {
    //     const app = getApp()
    //     if (app.globalData.isLogin) {
    //         if (this.data.totalNum) {
    //             if (this.data.defaultAddress === false)
    //                 wx.showToast({
    //                     title: '很没有添加地址噢~',
    //                     icon: 'none',
    //                     duration: 1000
    //                 });
    //             let url = "/pages/pay/index?totalPrice=" + this.data.totalPrice + "&totalNum=" + this.data.totalNum
    //             let pages = getCurrentPages();
    //             // 数组中索引最大的页面--当前页面
    //             let currentPage = pages[pages.length - 1];
    //             let index = currentPage.options.index
    //             if (index) url += "&index=" + index
    //             console.log(url)
    //             wx.navigateTo({ url: url });
    //         } else {
    //             wx.showToast({
    //                 title: '你还没有添加菜品噢~',
    //                 icon: 'none'
    //             });
    //         }
    //     } else {
    //         wx.showToast({
    //             title: '请登录',
    //             icon: 'none'
    //         })
    //     }
    // }
})