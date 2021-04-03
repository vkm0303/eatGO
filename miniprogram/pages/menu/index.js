const api = require('../../api/api.js');

var menuData = []; //存放当前食堂的所有菜单数据
var canteenList = [];
var canteenIdx = 0;

var eatTime;

const date = new Date();
var preIdx = 0;
var dayIdx = date.getDay();
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

var currentPage = 0;
const PAGESIZE = 10;

Page({
    data: {
        swiperImagesList: [
            'cloud://tastygo-4giu9tldc5678879.7461-tastygo-4giu9tldc5678879-1305481748/swiper_images/1.jpg',
            'cloud://tastygo-4giu9tldc5678879.7461-tastygo-4giu9tldc5678879-1305481748/swiper_images/2.jpg'
        ], //轮播图链接
        curEatTime: '', //当前选中的餐点

        curMenuList: [], //当前展示的菜单列表

        canteenOptions: ["北区食堂"],

        curTypeList: [], //菜类型对象列表
        curType: '', //当前类型
        curTypeIdx: 0,

        totalPrice: 0,
        totalNum: 0,
        StartScroll: false,

        timeOptions: ['今天', '明天', '后天'],

        orderDetail: [],

        linePos: null,
        hh: '',
        animation: null,
        busPos: {},
        bus_x: '',
        bus_y: '',
        finger: {},
    },

    onLoad: async function(options) {
        const that = this;
        // wx.showLoading({
        //     title: '正在加载',
        //     mask: true
        // });

        //根据当前时间设置默认选中餐点
        const curTime = date.getHours() + 1;
        let curEatTime = '';
        if (curTime < 9 || curTime >= 19) {
            curEatTime = 'Breakfast';
        } else if (curTime > 9 && curTime < 13) {
            curEatTime = 'Lunch';
        } else {
            curEatTime = 'Dinner';
        }

        that.getEatTime();

        //获取食堂列表
        let res = await api.getCanteenList();
        canteenList = res.data;
        let canteenOptions = [];
        for (let v of canteenList) {
            canteenOptions.push(v.canteenName);
        }

        const orderDetail = wx.getStorageSync('orderDetail');
        const totalPrice = wx.getStorageSync('canteenOrder').price || 0;
        const totalNum = that.computeTotalNum();

        that.setData({
            orderDetail,
            totalPrice,
            totalNum,
            canteenOptions,
            curEatTime,
        });

        that.loadMenuData();

        let userInfo = wx.getStorageSync('userInfo');
        res = await api.getUserInfo({ id: userInfo.campusId });
        userInfo = res.data;
        wx.setStorageSync('userInfo', userInfo);

        wx.setStorageSync("canteenList", canteenOptions);
    },

    onShow: function() {

        const canteenOrder = wx.getStorageSync('canteenOrder');
        if (!canteenOrder) {
            this.setData({
                totalNum: 0,
                totalPrice: 0
            });
        }
    },

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
            for (let el of v.menus) {
                if (el.eatTime === curEatTime) {
                    curTypeList.push({ typeId: v.typeId, typeName: v.typeName });
                    break;
                }
            }
        }

        //通过当前选择类型及餐点进行筛选
        let curMenuList = [];
        if (curTypeList.length) {
            menuData.filter(v => {
                if (v.typeName === curTypeList[0].typeName) {
                    curMenuList = v.menus.filter(el => {
                        return el.eatTime === curEatTime;
                    });
                }
            });
        }
        console.log(curMenuList)
        that.tagsToArray(curMenuList);

        that.setData({
            curTypeIdx: 0,
            curTypeList,
            curEatTime,
            curMenuList,
        });
    },

    //切换菜单类名事件
    handleTypeChange(e) {
        const that = this;
        const curTypeIdx = e.currentTarget.dataset.index; //获取点击的类名索引
        const curType = that.data.curTypeList[curTypeIdx]; //将当前类名改为目标点击的类名

        //根据类名筛选数据
        let curMenuList = [];

        menuData.filter((v) => {
            if (v.typeName === curType.typeName) {
                curMenuList = v.menus.filter(el => {
                    return el.eatTime === that.data.curEatTime;
                });
            }
        });

        that.tagsToArray(curMenuList);

        that.setData({
            curTypeIdx,
            curMenuList,
            curType,
        });
    },

    //加载菜单数据
    async loadMenuData(e, isClearData = false) {
        const that = this;
        let { curTypeIdx, curEatTime } = that.data;
        if (e) { //判断是否从点击事件调用
            if (canteenIdx === e.detail.index) {
                return;
            } else {
                canteenIdx = e.detail.index;
                wx.showLoading({
                    title: '正在加载',
                    mask: false
                });
            }
        }
        const params = {
            canteenId: canteenList[canteenIdx].canteenId,
            day: days[dayIdx]
        };

        const res = await api.getMenuByCanteen(params);
        console.log(res)

        if (isClearData) {
            menuData = [];
        }

        menuData = res.data;

        let curTypeList = [];
        for (let v of menuData) {
            for (let el of v.menus) {
                if (el.eatTime === curEatTime) {
                    curTypeList.push({ typeId: v.typeId, typeName: v.typeName });
                    break;
                }
            }
        }

        let curMenuList = [];
        if (curTypeList.length) {
            curTypeIdx = 0;
            menuData.filter(v => {
                if (v.typeName === curTypeList[0].typeName) {
                    curMenuList = v.menus.filter(el => {
                        return el.eatTime === that.data.curEatTime;
                    });
                }
            });
        } else {
            curTypeList[0] = '';
            curTypeIdx = -1;
        }

        that.tagsToArray(curMenuList);

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
        if (preIdx < index) { //判断向前选择还是向后选择
            dayIdx += (index - preIdx);
            if (dayIdx > 6) {
                dayIdx = 7 - dayIdx;
            }
        } else {
            dayIdx -= (preIdx - index);
            if (dayIdx < 0) {
                dayIdx = 7 + dayIdx;
            }
        }
        preIdx = index;
        that.loadMenuData();
    },

    //点击收藏事件
    handleFoodCollect(e) {

        wx.showToast({
            title: '功能暂未开放',
            icon: 'none'
        });
        // if (isLogin) {
        //     const { account } = userInfo;
        //     const food_index = e.currentTarget.dataset.index
        //     const type_index = this.data.type_idx
        //     const { state } = e.curTarget.dataset
        //     menuData[type_index].list[food_index].isCollected = !state
        //     this.setData({ curMenuList: menuData[type_index].list })

        //     if (!state) {
        //         // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        //         db.collection('user_collection').add({
        //             // data 字段表示需新增的 JSON 数据
        //             data: {
        //                 account,
        //                 canteen: this.data.curCanteen,
        //                 type_index: typeIdx,
        //                 food_index: food_index
        //             }
        //         })
        //     } else {
        //         db.collection('user_collection').where({
        //             account,
        //             type_index,
        //             food_index,
        //             canteen: this.data.curCanteen
        //         }).get().then(res => {
        //             db.collection('user_collection').doc(res.data[0]._id).remove()
        //         })
        //     }
        // } else {
        //     wx.showToast({
        //         title: '请先登录',
        //         icon: 'none'
        //     })
        // }
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

        const hours = date.getHours();
        if (food.eatTime !== eatTime || (eatTime !== 'Breakfast' && food.time !== days[dayIdx]) || (eatTime === 'Breakfast' && days[dayIdx] !== days[date.getDay()] && hours < 7) || (eatTime === 'Breakfast' && dayIdx === date.getDay() && hours >= 21)) {
            wx.showToast({
                title: '不在当前点餐时间范围内',
                icon: 'none',
                duration: 2000,
            });
            return;
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
            } else if (orderDetail.length && food.time !== orderDetail[0].time) {
                wx.showToast({
                    title: '仅可选择同一天的菜品',
                    icon: 'none'
                });
                return;
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

        that.touchOnGoods(e);

        that.setData({
            totalNum,
            totalPrice,
            orderDetail,
        })
        wx.setStorageSync('canteenOrder', canteenOrder);
        wx.setStorageSync('orderDetail', orderDetail);
    },

    //加载收藏列表
    loadCollectionList(canteen, data) {
        const that = this;
    },

    //订单单个商品数量发生变化
    bindItemNumChange(e) {
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

        totalNum += num;

        that.setData({
            orderDetail,
            totalNum,
            totalPrice,
        })
    },

    bindClearCart() {
        wx.removeStorageSync('canteenOrder');
        wx.removeStorageSync('orderDetail');
        this.setData({
            totalNum: 0,
            totalPrice: 0,
            orderDetail: []
        });
    },

    //将菜品标签数据转换为数组
    tagsToArray(menuList) {
        let ingredient = [];
        for (let el of menuList) {
            if (typeof el.ingredient !== 'object') {
                ingredient = (el.ingredient.split('、'));
                el.ingredient = ingredient;
            }
        }
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

    getEatTime() {
        const hours = date.getHours();
        if (hours < 7 || hours >= 18) {
            eatTime = 'Breakfast';
        } else if (hours >= 9 && hours < 13) {
            eatTime = 'Lunch';
        } else if (hours >= 13 && hours < 17) {
            eatTime = 'Dinner';
        }
    },


    /*加入购物车动效*/
    touchOnGoods(e) {
        const that = this;

        var topPoint = {};
        var { busPos, finger } = that.data;;

        let query = that.createSelectorQuery();

        query.select('#cart').boundingClientRect().selectViewport().scrollOffset().exec(res => {
            res[0].top // #the-id节点的上边界坐标
            res[1].scrollTop // 显示区域的竖直滚动位置

            busPos['x'] = res[0].left;
            busPos['y'] = res[0].top + res[1].scrollTop;

            finger['x'] = e.detail.x;
            finger['y'] = e.detail.y;

            let distance = 200;
            if (res[1].scrollTop < 20) {
                distance = 420;
            }

            if (finger['y'] < busPos['y']) {
                topPoint['y'] = finger['y'] - distance;
            } else {
                topPoint['y'] = busPos['y'] - distance;
            }
            topPoint['x'] = Math.abs(finger['x'] - busPos['x']) / 2;

            if (finger['x'] > busPos['x']) {
                topPoint['x'] = (finger['x'] - busPos['x']) / 2 + busPos['x'];
            } else {
                topPoint['x'] = (busPos['x'] - finger['x']) / 2 + finger['x'];
            }
            let linePos = that.bezier([busPos, topPoint, finger], 30);
            that.setData({
                topPoint,
                finger,
                linePos,
                bus_x: finger['x'],
                bus_y: finger['y']
            })
            that.startAnimation(e);
        });
    },
    startAnimation() {
        var index = 0,
            that = this,
            bezier_points = that.data.linePos['bezier_points'],
            hide_good_box = false;
        var len = bezier_points.length;
        index = len;
        let animation = wx.createAnimation({
            duration: 20,
            timingFunction: 'ease-out'
        });
        animation.opacity(1).step();
        for (let i = index - 1; i > -1; i--) {
            let deltX = bezier_points[i]['x'] - that.data.finger['x'];
            let deltY = bezier_points[i]['y'] - that.data.finger['y'];
            if (i < 6) {
                deltX = -290;
            }
            animation.translate(deltX, deltY).step();
        }
        animation.opacity(0).step();
        animation.translate(0, 0).step;
        that.setData({
            animation: animation.export(),
            hide_good_box
        })
    },
    //获得了从点击到购物车之间轨迹的点的位置
    bezier(pots, amount) {
        var pot;
        var lines;
        var ret = [];
        var points;
        for (var i = 0; i <= amount; i++) {
            points = pots.slice(0);
            lines = [];
            while ((pot = points.shift())) {
                if (points.length) {
                    lines.push(pointLine([pot, points[0]], i / amount));
                } else if (lines.length > 1) {
                    points = lines;
                    lines = [];
                } else {
                    break;
                }
            }
            ret.push(lines[0]);
        }

        function pointLine(points, rate) {
            var pointA,
                pointB,
                pointDistance,
                xDistance,
                yDistance,
                tan,
                radian,
                tmpPointDistance;
            var ret = [];
            pointA = points[0]; //点击
            pointB = points[1]; //中间
            xDistance = pointB.x - pointA.x;
            yDistance = pointB.y - pointA.y;
            pointDistance = Math.pow(
                Math.pow(xDistance, 2) + Math.pow(yDistance, 2),
                1 / 2
            );
            tan = yDistance / xDistance;
            radian = Math.atan(tan);
            tmpPointDistance = pointDistance * rate;
            ret = {
                x: pointA.x + tmpPointDistance * Math.cos(radian),
                y: pointA.y + tmpPointDistance * Math.sin(radian)
            };
            return ret;
        }
        return {
            bezier_points: ret
        };
    },
})