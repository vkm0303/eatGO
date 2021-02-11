wx.cloud.init()
const DB = wx.cloud.database()
Page({
    data: {
        //"我要带"变量
        isAddressClick: false,
        isTakeAddressClick: false,
        isReceiveAddressClick: false,
        selsctedAddress: "男生宿舍17B",
        takeAddress: "北区食堂",
        takeAddressOptions: ['北区食堂', '北区西餐厅', '竹韵食堂', '石井食堂'],
        receiveAddress: "男生宿舍17B",
        receiveAddressOptions: ['北区男生宿舍17B', '北区男生宿舍17A', '北区女生宿舍17B'],
        //"我要吃"变量
        isAddressExist: false,
        orderDetail: [],
        orderList: [],
        totalNum: 0,
        totalPrice: 0,
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
        const { index } = e.detail;
        let { tabs } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        this.setData({ tabs })
        if (this.data.tabs[1].isActive) {
            const db = wx.cloud.database();
            db.collection('sztu_order')
                .where({ isReceive: false })
                .get().then(res => { this.setData({ orderList: res.data }) })
        }
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

    //点击选择地址按钮事件
    handTakeAddressClick() {
        this.addressClick('210rpx', '54rpx')
        this.setData({ isTakeAddressClick: !this.data.isTakeAddressClick })
    },
    handReceiveAddressClick() {
        this.addressClick('200rpx', '54rpx')
        this.setData({ isReceiveAddressClick: !this.data.isReceiveAddressClick })
    },

    //选择地址事件
    handleTakeAddressSelect(e) {
        const takeAddress = e.currentTarget.dataset.address
        this.setData({ takeAddress })
    },
    handleReceiveAddressSelect(e) {
        const receiveAddress = e.currentTarget.dataset.address
        this.setData({ receiveAddress })
    },
    addressClick(addHeight, reduceHeight) {
        let aniHeightAdd = wx.createAnimation({
            duration: 150,
            timingFunction: 'linear',
            delay: 0,
            transformOrigin: '50% 50% 0'
        })
        aniHeightAdd.height(addHeight).step()
        let aniHeightReduce = wx.createAnimation({
            duration: 150,
            timingFunction: 'linear',
            delay: 0,
            transformOrigin: '50% 50% 0'
        });
        aniHeightReduce.height(reduceHeight).step()
        let { isAddressClick } = this.data
        this.setData({
            isAddressClick: !isAddressClick,
            aniHeightAdd: aniHeightAdd.export(),
            aniHeightReduce: aniHeightReduce.export()
        })
    },
    handleReduceNum(e) {
        let { index, price } = e.currentTarget.dataset
        let { orderDetail } = this.data
            //判断是否移除商品操作
        if (orderDetail[index].num === 1) {
            wx.showModal({
                title: '提示',
                content: '是否移除该菜品',
                cancelText: '取消',
                cancelColor: '#3CC51F',
                confirmText: '移除',
                confirmColor: '#dbdbdb',
                success: (result) => {
                    if (result.confirm) {
                        orderDetail.splice(index, 1)
                        this.setData({
                            orderDetail,
                            totalNum: --this.data.totalNum,
                            totalPrice: this.data.totalPrice - e.currentTarget.dataset.price
                        })
                        wx.setStorageSync('canteenOrder', orderDetail)
                    }
                }
            });
        } else {
            orderDetail[index].num--;
            orderDetail[index].totalPrice -= Number(price)
            this.setData({
                orderDetail,
                totalNum: --this.data.totalNum,
                totalPrice: this.data.totalPrice - e.currentTarget.dataset.price
            })
            wx.setStorageSync('canteenOrder', orderDetail)
        }
    },
    handleAddNum(e) {
        let { index, price } = e.currentTarget.dataset
        let { orderDetail } = this.data
        orderDetail[index].num++;
        orderDetail[index].totalPrice += Number(price)
        this.setData({
            orderDetail,
            totalNum: ++this.data.totalNum,
            totalPrice: this.data.totalPrice + Number(price)
        })
        wx.setStorageSync('canteenOrder', orderDetail)
    },
    handAddFood() {
        wx.switchTab({
            url: '/pages/index/index'
        });
    },
    handlePay() {
        const app = getApp()
        if (app.globalData.isLogin) {
            if (this.data.totalNum) {
                if (this.data.defaultAddress === false)
                    wx.showToast({
                        title: '很没有添加地址噢~',
                        icon: 'none',
                        duration: 1000
                    });
                let url = "/pages/pay/index?totalPrice=" + this.data.totalPrice + "&totalNum=" + this.data.totalNum
                let pages = getCurrentPages();
                // 数组中索引最大的页面--当前页面
                let currentPage = pages[pages.length - 1];
                let index = currentPage.options.index
                if (index) url += "&index=" + index
                console.log(url)
                wx.navigateTo({ url: url });
            } else {
                wx.showToast({
                    title: '你还没有添加菜品噢~',
                    icon: 'none'
                });
            }
        } else {
            wx.showToast({
                title: '请登录',
                icon: 'none'
            })
        }
    }
})