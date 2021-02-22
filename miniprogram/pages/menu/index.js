const api = require('../../api/api.js');
const app = getApp();
var { userInfo, isLogin } = app.globalData;

var menuData = []; //存放当前食堂的所有菜单数据
// const eatTime = ['Breakfast', 'Lunch', 'Dinner'];

const date = new Date();
let preIdx = 0;
let dayIdx = date.getDay();
const days = ['Sunday', 'Monday', 'TuesDay', 'Wednesday', 'ThursDay', 'Friday', 'Saturday'];

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
        isAdd: false,
        StartScroll: false,
        timeOptions: ['今天', '明天', '后天'],
    },

    onLoad: async function(options) {
        const that = this;

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

        that.setData({
            canteenList,
            canteenOptions,
            curCanteen: canteenList[0],
            curEatTime,
        });
        that.loadMenuData();

        wx.setStorageSync("canteenList", canteenOptions);
    },
    onShow: function() {
        //判断是否有未处理订单
        const canteenOrder = wx.getStorageSync("canteenOrder");
        if (canteenOrder.length == 0)
            this.setData({ isAdd: false });
        if (isLogin, menuData) {
            let account = userInfo.no;
            this.loadCollectionList(this.data.curCanteen);
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
            if (v.menus[0].eatTime === curEatTime) {
                curTypeList.push({ typeId: v.typeId, typeName: v.typeName });
            }
        }

        //通过当前选择类型及餐点进行筛选
        let curMenuList = [];
        if (curTypeList.length) {
            curMenuList = menuData.filter((v) => {
                return v.typeName === curTypeList[0].typeName && v.menus[0].eatTime === curEatTime;
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
            if (curCanteen.canteenId === canteenList[index].canteenId) {
                return;
            }

            that.setData({
                curCanteen: canteenList[index],
            });
        }

        wx.showLoading({
            title: '正在加载数据',
            mask: false,
        });

        const res = await api.getMenuByCanteen(that.data.curCanteen.canteenId, days[dayIdx]);
        menuData = res.data;

        let curTypeList = [];
        for (let v of menuData) {
            if (v.menus[0].eatTime === that.data.curEatTime) {
                curTypeList.push({ typeId: v.typeId, typeName: v.typeName });
            }
        }

        let curMenuList = [];
        let curTypeIdx = 0;
        if (curTypeList.length) {
            curMenuList = menuData.filter((v) => {
                return v.typeName === curTypeList[curTypeIdx].typeName && v.menus[0].eatTime === that.data.curEatTime;
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
        let { totalPrice } = that.data;
        let { food } = e.currentTarget.dataset;
        let isExist = false;

        menusId.menuId = food.menuId;
        if (canteenOrder.canteenId) {
            if (food.canteen !== canteenOrder.canteenId) {
                wx.showToast({
                    title: '仅可选择同一给食堂的菜单噢~',
                    icon: 'none',
                    duration: 3000,
                });
                return;
            } else {
                canteenOrder.menusId.forEach(el => {
                    if (el.menuId === menusId.menuId) {
                        el.num++;
                        isExist = true;
                    }
                });
                if (!isExist) {
                    canteenOrder.menusId.push(menusId);
                    orderDetail.push(food);
                }
            }
        } else {
            canteenOrder.canteenId = food.canteen;
            canteenOrder.menusId[0] = menusId;
            orderDetail.push(food);
        }

        totalPrice += food.price;
        canteenOrder.price = totalPrice;

        that.setData({
            totalPrice,
        })
        wx.setStorageSync('canteenOrder', canteenOrder);
        wx.setStorageSync('orderDetail', orderDetail);

        // //查询是否已存在该food
        // const index = canteenOrder.findIndex(v => {
        //     return v.food_id === food_id
        // })
        // if (index !== -1) {
        //     //food存在，数量+1,价格相应增加
        //     canteenOrder[index].num += 1
        //     canteenOrder[index].totalPrice = Number(canteenOrder[index].price * canteenOrder[index].num)
        //     totalPrice = (Number(totalPrice) + Number(canteenOrder[index].price)).toFixed(2)
        //     that.setData({ totalPrice })
        //     wx.setStorageSync("canteenOrder", canteenOrder)
        //     return
        // }
        // //新添加food
        // let order = e.currentTarget.dataset.food_detail
        // order.totalPrice = Number(order.price)
        // order.num = 1
        // totalPrice = (Number(totalPrice) + Number(order.price)).toFixed(2)
        // if (canteenOrder.length) {
        //     if (food_id.slice(0, 2) !== canteenOrder[0].food_id.slice(0, 2)) {
        //         wx.showToast({
        //             title: '只能选同一食堂的菜噢~',
        //             icon: 'none',
        //             duration: 2000
        //         });
        //         return
        //     } else {
        //         canteenOrder.push(order)
        //     }
        // } else {
        //     canteenOrder.push(order)
        // }
        // wx.setStorageSync("canteenOrder", canteenOrder); //将订单数据存储到内存中
        // this.setData({
        //     totalPrice,
        //     isAdd: true
        // })
    },
    //点击pay
    handlePay() {
        wx.navigateTo({ url: '/pages/bangdai/index?totalPrice=' + this.data.totalPrice })
    },
    //加载收藏列表
    loadCollectionList(canteen, data) {
        const that = this
            //menuData = data || wx.getStorageSync(canteenName)
            // db.collection('user_collection').where({
            //     canteen,
            //     account
            // }).get().then(res => {
            //     //将menuData数据的收藏状态更新
            //     const collect_idxs = res.data
            //     for (var i = 0; i < collect_idxs.length; i++)
            //         menuData[collect_idxs[i].type_index].list[collect_idxs[i].food_index].isCollected = true
            //     that.setData({
            //         curMenuList: menuData[that.data.type_idx].list
            //     })
            // })
    },
    openScroll() {

        this.setData({
            StartScroll: true
        })
        console.log(this.data.StartScroll)
    }
})