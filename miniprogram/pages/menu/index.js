import api from '../../api/api.js';

const app = getApp();
var { userInfo, isLogin } = app.globalData;

var menuData = []; //存放当前食堂的所有菜单数据

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
            "canteenId": "ff808081775730a001775732ab050001",
            "canteenName": "北区食堂",
        }], //所有的食堂对象列表
        canteenOptions: ["北区食堂"],
        curCanteen: {
            "canteenId": "ff808081775730a001775732ab050001",
            "canteenName": "北区食堂",
        }, //当前选中的食堂
        typeList: [], //菜类型对象列表
        curType: '', //当前类型
        typeIdx: 0, //当前类型的index，用于选择选中样式的展示
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
        that.handleCanteenSelect();

        //获取食堂列表
        const canteenList = await api.getCanteenList();
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

        //获取展示的菜单数据并通过当前选择类型进行筛选
        const url = `/getMenuList?canteenId=${that.data.curCanteen.canteenId}&eatTime=${curEatTime}&time=Monday`;
        menuData = await api.getMenuList(url);
        const curMenuList = menuData.filter((v) => {
            return v.typeName === that.data.curType;
        });

        that.setData({
            curEatTime,
            curMenuList,
        });
    },
    //点击选择饭堂按钮事件，创建动画函数
    createAnimation() {
        //展开列表框
        let aniHeightAdd = wx.createAnimation({
                duration: 150,
                timingFunction: 'linear',
                delay: 0,
                transformOrigin: '50% 50% 0'
            })
            //收回列表框
        aniHeightAdd.height(this.data.canteenList.length * 38).step()
        let aniHeightReduce = wx.createAnimation({
            duration: 200,
            timingFunction: 'linear',
            delay: 0,
            transformOrigin: '50% 50% 0'
        });
        aniHeightReduce.height(19).step();

        let { isCanteenClick } = this.data; //获取列表框状态
        this.setData({
            isCanteenClick: !isCanteenClick,
            aniHeightAdd: aniHeightAdd.export(),
            aniHeightReduce: aniHeightReduce.export()
        })
    },
    //选择饭堂响应事件
    async handleCanteenSelect(e) {
        const that = this;
        if (e) { //判断是否从onload函数调用
            const curCanteen = e.currentTarget.dataset.canteen;
            if (curCanteen === that.data.currentCanteen) {
                return;
            }

            that.setData({
                curCanteen,
            });
        }

        wx.showLoading({
            title: '正在加载数据',
            mask: false,
        });

        //获取当前食堂菜单的相关数据
        const typeList = await api.getTypeList('/getTypeList');

        const url = `/getMenuList?canteenId=${that.data.curCanteen.canteenId}&eatTime=${that.data.curEatTime}&time=Monday`;
        menuData = await api.getMenuList(url);
        const curMenuList = menuData.filter((v) => {
            return v.typeName === typeList[0].typeName;
        });

        that.setData({
            typeList,
            curType: typeList[0].typeName,
            curMenuList,
        });

        wx.hideLoading();
    },
    //切换菜单类名事件
    handleTypeChange(e) {
        const that = this;
        const typeIdx = e.currentTarget.dataset.index; //获取点击的类名索引
        const curType = that.data.typeList[typeIdx].typeName; //将当前类名改为目标点击的类名

        //根据类名筛选数据
        const curMenuList = menuData.filter((v) => {
            return v.typeName === curType;
        });

        that.setData({
            typeIdx,
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
        let canteenOrder = wx.getStorageSync("canteenOrder") || [];
        let { totalPrice } = this.data;
        let { food_id } = e.curTarget.dataset.food.menuId;
        //查询是否已存在该food
        const index = canteenOrder.findIndex(v => {
            return v.food_id === food_id
        })
        if (index !== -1) {
            //food存在，数量+1,价格相应增加
            canteenOrder[index].num += 1
            canteenOrder[index].totalPrice = Number(canteenOrder[index].price * canteenOrder[index].num)
            totalPrice = (Number(totalPrice) + Number(canteenOrder[index].price)).toFixed(2)
            this.setData({ totalPrice })
            wx.setStorageSync("canteenOrder", canteenOrder)
            return
        }
        //新添加food
        let order = e.currentTarget.dataset.food_detail
        order.totalPrice = Number(order.price)
        order.num = 1
        totalPrice = (Number(totalPrice) + Number(order.price)).toFixed(2)
        if (canteenOrder.length) {
            if (food_id.slice(0, 2) !== canteenOrder[0].food_id.slice(0, 2)) {
                wx.showToast({
                    title: '只能选同一食堂的菜噢~',
                    icon: 'none',
                    duration: 2000
                });
                return
            } else {
                canteenOrder.push(order)
            }
        } else {
            canteenOrder.push(order)
        }
        wx.setStorageSync("canteenOrder", canteenOrder); //将订单数据存储到内存中
        this.setData({
            totalPrice,
            isAdd: true
        })
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