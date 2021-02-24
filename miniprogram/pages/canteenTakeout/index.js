const { getAddressList, getOrder, getCanteenList, receiveOrder } = require('../../api/api.js');

var canteenList = [];
var focusAddressList = [];
var canteenIdx = 0;
var addressIdx = 0;

const PAGESIZE = 6;
var currentPage = 0;

Page({
    data: {
        //公共变量
        tabIndex: 0,

        //"我要带"变量
        startingOptions: [],
        focusOptions: [],
        orderList: [],
        showTriggered: true,
        isShowLoading: false,

        //"我要吃"变量
        orderDetail: [],
        getWayIndex: -1,
    },

    moveLeft(e) {
        const that = this;
        const { index } = e.currentTarget.dataset;

        let translateLeft = wx.createAnimation({
            duration: 100
        });
        translateLeft.translateX(0).step();
        that.setData({
            tabIndex: index,
            moveAnimation: translateLeft.export(),
        });
    },
    moveRight(e) {
        const that = this;
        const { index } = e.currentTarget.dataset;
        let translateRight = wx.createAnimation({
            duration: 100
        });
        translateRight.translateX(110).step();
        that.setData({
            tabIndex: index,
            moveAnimation: translateRight.export(),
        });
        that.tabItemChange();
    },


    //"我要吃"私有函数

    handleWaySelect(e) {
        const that = this;
        let { index } = e.currentTarget.dataset;

        if (that.data.getWayIndex === index) {
            index = -1;
        }

        that.setData({
            getWayIndex: index
        })
    },

    gotoSubmit() {
        const that = this;
        const userInfo = wx.getStorageSync('userInfo');
        const loginState = wx.getStorageSync('loginState');
        if (loginState && userInfo.wxid && userInfo.phone) {
            const { getWayIndex } = that.data;
            let canteenOrder = wx.getStorageSync('canteenOrder');
            if (canteenOrder) {
                if (getWayIndex !== 0 && getWayIndex !== 1) {
                    wx.showToast({
                        title: '您还未选择取餐方式',
                        icon: 'none'
                    });
                } else {
                    canteenOrder.getWay = getWayIndex;
                    wx.setStorageSync('canteenOrder', canteenOrder);
                    wx.navigateTo({ url: `/pages/pay/index?getWay=${getWayIndex}` });
                }
            } else {
                wx.showToast({
                    title: '您还未添加订单',
                    icon: 'none',
                    duration: 3000
                });
            }
        } else {
            if (!loginState) {
                wx.showModal({
                    title: '您还未登录',
                    content: '是否马上登录?',
                    confirmText: '去登录',
                    success: (result) => {
                        if (result.confirm) {
                            wx.navigateTo({ url: '/pages/login/index' });
                        }
                    }
                });
            } else if (!userInfo.wxid || !userInfo.phone) {
                wx.showModal({
                    title: '个人信息未完善',
                    content: '是否去完善个人信息?',
                    confirmText: '去完善',
                    success: (result) => {
                        if (result.confirm) {
                            wx.navigateTo({ url: '/pages/userInfo/index' });
                        }
                    }
                });
            }
        }
    },

    //"我要带"私有函数

    /*
     *  下拉刷新与上拉加载
     */
    //筛选按钮事件
    filter() {
        wx.showLoading({ title: 'Loading...' });
        this.getOrderList();
    },

    //加载下拉刷新动画
    refresherPulling() {
        //导航条加载动画
        wx.showNavigationBarLoading();
        //loading 提示框
        wx.showLoading({
            title: 'Loading...',
        });
    },

    //下拉刷新被触发
    refresherStart() {
        const that = this;
        that.setData({
            showTriggered: true
        });
        currentPage = 0;
        that.getOrderList('top');
    },

    //scroll-view滑动事件，若正在刷新，则停止
    // stopRefresh() {
    //     if (this.data.showTriggered) {
    //         wx.hideNavigationBarLoading();
    //         wx.hideLoading();
    //         this.setData({
    //             showTriggered: false,
    //             tips: false
    //         });
    //     }
    // },

    //scroll-view触底事件，上拉加载
    scrollToLower() {
        this.setData({
            isShowLoading: true
        });
        currentPage++;
        this.getOrderList();
    },

    //获取订单列表
    async getOrderList(type) {
        const that = this;
        let { orderList } = that.data;
        const params = {
            canteenId: canteenList[canteenIdx].canteenId,
            addressId: focusAddressList[addressIdx].addressId,
            status: 0,
            currentPage,
            pageSize: PAGESIZE
        }
        let res = await getOrder(params);
        orderList = type === 'top' ? res.data : orderList.concat(res.data);
        console.log(orderList)
        that.setData({
            orderList
        });

        wx.hideLoading();

        if (type === 'top') {
            that.stopRefresh();
        } else {
            let tips = false;
            if (res.data.length === 0) {
                tips = '已经到底了'
            }
            that.setData({
                isShowLoading: false,
                tips
            });
        }
    },

    //地点选择器选择事件触发
    selectorItemChange(e) {
        const { flag } = e.currentTarget.dataset;
        const { index } = e.detail;
        if (flag === 0) {
            canteenIdx = index;
        } else {
            addressIdx = index;
        }
    },

    //切换Tabs到“我要带”
    async tabItemChange() {
        const that = this;
        wx.showLoading({ title: 'Loading...' });

        //获取取餐地点
        const startingOptions = wx.getStorageSync('canteenList') || ['北区食堂', '北区西餐厅', '竹韵食堂', '石井食堂'];
        let res = await getCanteenList();
        canteenList = res.data;

        //获取收货地址列表
        res = await getAddressList();
        focusAddressList = res.data;
        let focusOptions = [];
        if (focusAddressList.length) {
            for (let v of focusAddressList) {
                focusOptions.push(v.addressName);
            }
        } else {
            focusOptions = ['男生宿舍17B', '男生宿舍17A', '女生宿舍17B'];
        }

        that.setData({
            focusOptions,
            startingOptions,
        });

        that.getOrderList();
    },

    //接受订单
    receiveOrder(e) {
        const that = this;
        const orderId = e.currentTarget.dataset.orderid;
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            if (userInfo.wxid && userInfo.phone) {
                wx.showModal({
                    title: '是否确定接单',
                    content: '接单后不可取消',
                    success: async(result) => {
                        if (result.confirm) {
                            const params = {
                                orderId,
                                receiveUserId: userInfo.no,
                            };
                            const res = await receiveOrder(params);
                            if (res.msg === 'success') {
                                wx.navigateTo({ url: `/pages/takeOrderDetail/index?orderId=${orderId}` });
                            } else {
                                wx.showModal({
                                    title: '接单失败',
                                    content: '订单被截胡啦！刷新页面试试',
                                    showCancel: false,
                                    confirmText: '刷新',
                                    success: (r) => {
                                        if (r.confirm) {
                                            that.refresherPulling();
                                            that.refresherStart();
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
            } else {
                wx.showModal({
                    title: '个人信息未完善',
                    content: '是否去完善个人信息?',
                    confirmText: '去完善',
                    success: (result) => {
                        if (result.confirm) {
                            wx.navigateTo({ url: '/pages/userInfo/index' });
                        }
                    }
                });
            }
        } else {
            wx.showModal({
                title: '您还未登录',
                content: '是否马上登录?',
                confirmText: '去登录',
                success: (result) => {
                    if (result.confirm) {
                        wx.navigateTo({ url: '/pages/login/index' });
                    }
                }
            });
        }
    }
})