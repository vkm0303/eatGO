const DB = wx.cloud.database();
const { getAddressList, getOrder, getCanteenList } = require('../../api/api.js');

var canteenList = [];
var focusAddressList = [];

Page({
    data: {
        //"我要带"变量
        curStartingIdx: 0,
        startingOptions: [],
        curFocusIdx: 0,
        focusOptions: [],
        orderList: [],
        //"我要吃"变量
        orderDetail: [],
        tabIndex: 0,
        getWayIndex: -1,
    },
    onLoad: async function(options) {
        const that = this;

        wx.showLoading({ mask: false })

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

        res = await getOrder(canteenList[0].canteenId, focusAddressList[0].addressId);
        const orderList = res.data;

        this.setData({
            focusOptions,
            orderList,
            startingOptions,
            loginState: true
        })

        wx.hideLoading()
    },
    onShow: function() {},
    //切换Tabs
    // handleItemChange(e) {

    //     const db = wx.cloud.database();
    //     db.collection('sztu_order')
    //         .where({ isReceive: false })
    //         .get().then(res => { this.setData({ orderList: res.data }) })

    // },
    moveLeft(e) {
        const that = this;
        const { index } = e.currentTarget.dataset;

        if (that.data.tabIndex === 1) {
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
        if (that.data.tabIndex === 0) {
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
        if (flag === 0) {
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
                wx.showToast({
                    title: '请登录',
                    icon: 'none'
                });
            } else if (!userInfo.wxid || !userInfo.phone) {
                wx.showToast({
                    title: '请先完善个人信息',
                    icon: 'none',
                    duration: 3000
                });
            }
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
                if (result.confirm) {
                    wx.navigateTo({ url: '/pages/takeOrderDetail/index' });
                }
            }
        });
    }
})