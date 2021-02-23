const api = require('../../api/api.js');
const app = getApp();
var { userInfo, isLogin } = app.globalData;

var menuData = []; //存放当前食堂的所有菜单数据
// const eatTime = ['Breakfast', 'Lunch', 'Dinner'];

const date = new Date();
let preIdx = 0;
let dayIdx = date.getDay();
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

Page({
    data: {
        swiperImagesList: [
            'cloud://test-v14h8.7465-test-v14h8-1303227913/swiper_images/pic1.png',
            'cloud://test-v14h8.7465-test-v14h8-1303227913/swiper_images/pic2.png',
            'cloud://test-v14h8.7465-test-v14h8-1303227913/swiper_images/pic3.png'
        ], //轮播图链接
        curEatTime: '', //当前选中的餐点

        curMenuList: [], //当前展示的菜单列表

        canteenList: [{
            "canteenId": "5",
            "canteenName": "北区食堂",
        }], //所有的食堂对象列表
        canteenOptions: ["北区食堂"],
        curCanteen: {
            "canteenId": "5",
            "canteenName": "北区食堂",
        }, //当前选中的食堂

        curTypeList: [], //菜类型对象列表
        curType: '', //当前类型
        curTypeIdx: 0,

        totalPrice: 0,
        totalNum: 0,
        isShowCart: false,
        StartScroll: false,

        timeOptions: ['今天', '明天', '后天'],

        orderDetail: []
    },

    onLoad: async function(options) {
        const that = this;
        wx.showLoading({ title: '正在加载' });

        //根据当前时间设置默认选中餐点
        const curDate = new Date();
        const curTime = curDate.getHours() + 1;
        let curEatTime = '';
        if (curTime < 9 || curTime >= 19) {
            curEatTime = 'Breakfast';
        } else if (curTime > 9 && curTime < 13) {
            curEatTime = 'Lunch';
        } else {
            curEatTime = 'Dinner';
        }

        //获取食堂列表
        const res = await api.getCanteenList();
        const canteenList = res.data;
        let canteenOptions = [];
        for (let v of canteenList) {
            canteenOptions.push(v.canteenName);
        }

        const orderDetail = wx.getStorageSync('orderDetail');
        const totalPrice = wx.getStorageSync('canteenOrder').price || 0;
        const totalNum = that.computeTotalNum();
        const isShowCart = !!orderDetail.length;

        that.setData({
            isShowCart,
            orderDetail,
            totalPrice,
            totalNum,
            canteenList,
            canteenOptions,
            curCanteen: canteenList[0],
            curEatTime,
        });

        that.loadMenuData();

        wx.setStorageSync("canteenList", canteenOptions);
    },

    onShow: function() {},

    onShareAppMessage: function(res) {
        var that = this;
        return {
            title: '好吃GO',
            path: '/pages/index/index?id=' + that.data.scratchId,
            success: function(res) {
                // 转发成功
                that.shareClick();
            }
        }
    },

    //选择餐点事件
    async handleIEatTimeClick(e) {
        const that = this;
        const curEatTime = e.currentTarget.dataset.time;

        let curTypeList = [];
        for (let v of menuData) {
            if (v.menus[0].eatTime === curEatTime && v.menus[0].time === days[dayIdx]) {
                curTypeList.push({ typeId: v.typeId, typeName: v.typeName });
            }
        }

        //通过当前选择类型及餐点进行筛选
        let curMenuList = [];
        if (curTypeList.length) {
            curMenuList = menuData.filter((v) => {
                return v.typeName === curTypeList[0].typeName && v.menus[0].eatTime === curEatTime && v.menus[0].time === days[dayIdx];
            });
        }

        that.setData({
            curTypeIdx: 0,
            curEatTime,
            curTypeList,
            curMenuList,
        });
    },
    //加载菜单数据
    async loadMenuData(e) {
        const that = this;
        let { curCanteen, canteenList } = that.data;
        if (e) { //判断是否从onload函数调用
            const { index } = e.detail;
            wx.showLoading({ title: '正在加载' });

            if (curCanteen.canteenId === canteenList[index].canteenId) {
                return;
            }

            that.setData({
                curCanteen: canteenList[index],
            });
        }

        const res = await api.getMenuByCanteen(that.data.curCanteen.canteenId, days[dayIdx]);
        menuData = res.data;

        let curTypeList = [];
        for (let v of menuData) {
            if (v.menus[0].eatTime === that.data.curEatTime && v.menus[0].time === days[dayIdx]) {
                curTypeList.push({ typeId: v.typeId, typeName: v.typeName });
            }
        }

        let curMenuList = [];
        let curTypeIdx = 0;
        if (curTypeList.length) {
            curMenuList = menuData.filter((v) => {
                return v.typeName === curTypeList[curTypeIdx].typeName && v.menus[0].eatTime === that.data.curEatTime && v.menus[0].time === days[dayIdx];
            });
        } else {
            curTypeList[0] = '';
            curTypeIdx = -1;
        }

        that.setData({
            curType: curTypeList[0],
            curTypeIdx,
            curTypeList,
            curMenuList,
        });

        wx.hideLoading();
    },

    //改变查询时间
    changeTime(e) {
        const that = this;
        const { index } = e.detail;
        wx.showLoading({ title: '正在加载' });
        if (preIdx < index) { //判断向前选择还是向后选择
            dayIdx += (index - preIdx);
        } else {
            dayIdx -= (preIdx - index);
        }
        preIdx = index;
        that.loadMenuData();
    },

    //选择日期事件
    async handleDateSelect(e) {

    },

    //切换菜单类名事件
    handleTypeChange(e) {
        const that = this;
        const curTypeIdx = e.currentTarget.dataset.index; //获取点击的类名索引
        const curType = that.data.curTypeList[curTypeIdx]; //将当前类名改为目标点击的类名

        //根据类名筛选数据
        let curMenuList = menuData.filter((v) => {
            return v.typeName === curType.typeName;
        });

        that.setData({
            curTypeIdx,
            curMenuList,
            curType,
        });
    },

    //点击收藏事件
    handleFoodCollect(e) {
        if (isLogin) {
            const { account } = userInfo;
            const food_index = e.currentTarget.dataset.index
            const type_index = this.data.type_idx
            const { state } = e.curTarget.dataset
            menuData[type_index].list[food_index].isCollected = !state
            this.setData({ curMenuList: menuData[type_index].list })

            if (!state) {
                // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                db.collection('user_collection').add({
                    // data 字段表示需新增的 JSON 数据
                    data: {
                        account,
                        canteen: this.data.curCanteen,
                        type_index: typeIdx,
                        food_index: food_index
                    }
                })
            } else {
                db.collection('user_collection').where({
                    account,
                    type_index,
                    food_index,
                    canteen: this.data.curCanteen
                }).get().then(res => {
                    db.collection('user_collection').doc(res.data[0]._id).remove()
                })
            }
        } else {
            wx.showToast({
                title: '请先登录',
                icon: 'none'
            })
        }
    },

    //添加food订单
    handleAddFood(e) {
        const that = this;
        let canteenOrder = wx.getStorageSync('canteenOrder') || { menusId: [] };
        let orderDetail = wx.getStorageSync('orderDetail') || [];
        let menusId = { menuId: '', num: 1 };
        let { totalPrice, totalNum } = that.data;
        let { food } = e.currentTarget.dataset;
        let isExist = false;

        menusId.menuId = food.menuId;
        food.num = 1;
        if (food.eatTime !== 'Breakfast' && food.time !== days[date.getDay()]) {
            wx.showToast({
                title: '除早餐外仅可以选择当天的菜品',
                icon: 'none',
                duration: 2000,
            });
        } else if (canteenOrder.canteenId) { //判断canteenOrder是否存在
            if (food.canteen !== canteenOrder.canteenId) { //判断添加商品是否为同一个食堂
                wx.showToast({
                    title: '仅可选择同一给食堂的菜单噢~',
                    icon: 'none',
                    duration: 3000,
                });
                return;
            } else if (orderDetail.length && food.eatTime !== orderDetail[0].eatTime) {
                wx.showToast({
                    title: '仅可选择同一餐点的菜品',
                    icon: 'none'
                });
                return;
            } else if (orderDetail.length && food.time !== days[date.getDay()]) {
                wx.showToast({
                    title: '仅可选择同一天的菜品',
                    icon: 'none'
                });
            } else {
                canteenOrder.menusId.forEach(el => {
                    if (el.menuId === menusId.menuId) { //判断订单中是否同样商品
                        el.num++;
                        for (let v of orderDetail) {
                            if (el.menuId === v.menuId) {
                                v.num = el.num;
                                break;
                            }
                        }
                        isExist = true;
                    }
                });
                if (!isExist) { //订单不存在相同商品
                    canteenOrder.menusId.push(menusId);
                    orderDetail.push(food);
                }
            }
        } else { //订单为空时
            canteenOrder.canteenId = food.canteen;
            canteenOrder.menusId[0] = menusId;
            orderDetail.push(food);
        }
        totalNum++;
        totalPrice += Number(food.price); //计算总价格
        food.price = food.price.toFixed(1); //保留一位小数
        canteenOrder.price = totalPrice;

        that.setData({
            totalNum,
            totalPrice,
            orderDetail,
        })
        wx.setStorageSync('canteenOrder', canteenOrder);
        wx.setStorageSync('orderDetail', orderDetail);
    },

    //点击pay
    handlePay() {
        wx.navigateTo({ url: '/pages/bangdai/index?totalPrice=' + this.data.totalPrice })
    },

    //加载收藏列表
    loadCollectionList(canteen, data) {
        const that = this
    },

    //订单单个商品数量发生变化
    itemNumChange(e) {
        const that = this;
        const { id, num } = e.detail;
        let canteenOrder = wx.getStorageSync('canteenOrder');
        let orderDetail = wx.getStorageSync('orderDetail');
        let { totalNum, totalPrice } = that.data;

        for (let i = 0; i < canteenOrder.menusId.length; i++) {
            if (canteenOrder.menusId[i].menuId === id) {
                canteenOrder.menusId[i].num += num;
                if (canteenOrder.menusId[i].num === 0) {
                    canteenOrder.menusId.splice(i, 1);
                }
                break;
            }
        }
        for (let i = 0; i < orderDetail.length; i++) {
            if (orderDetail[i].menuId === id) {
                orderDetail[i].num += num;
                canteenOrder.price += Number(orderDetail[i].price) * num;
                totalPrice = canteenOrder.price;
                if (orderDetail[i].num) {
                    wx.setStorageSync('orderDetail', orderDetail);
                    wx.setStorageSync('canteenOrder', canteenOrder);
                } else {
                    orderDetail.splice(i, 1);
                    wx.setStorageSync('orderDetail', orderDetail);
                    wx.setStorageSync('canteenOrder', canteenOrder);
                    if (orderDetail.length === 0) {
                        wx.removeStorageSync('orderDetail');
                        wx.removeStorageSync('canteenOrder');
                    }
                }
                break;
            }
        }

        // console.log(totalPrice)
        totalNum += num;

        that.setData({
            orderDetail,
            totalNum,
            totalPrice,
        })
    },

    computeTotalNum() {
        const that = this;
        const canteenOrder = wx.getStorageSync('canteenOrder');
        if (canteenOrder) {
            let totalNum = 0;
            canteenOrder.menusId.forEach((el) => {
                totalNum += el.num;
            });

            return totalNum;
        } else {
            return 0;
        }
    },

    openScroll() {
        this.setData({
            StartScroll: true
        })
        console.log(this.data.StartScroll)
    }
})