
Page({
  data: {
    shoopingtext: "", //搜索框的值
    history: true, //显示历史记录
    noneview: false, //显示未找到提示
    shoppinglist: false, //显示商品列表
    historyArray: [], //历史记录数组
    newArray: [], //添加历史记录数组
    shoopingarray: [],
    searchList: []
  },
  toGoods: function (e) {
    var userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showModal({
        title: '您还未登录',
        content: '是否马上登录?',
        confirmText: '去登录',
        success: (result) => {
          if (result.confirm) {
            wx.navigateTo({
              url: '/pages/login/index'
            });
          }
        }
      });
    } else {
      console.log(e.currentTarget.dataset.id)
      wx.navigateTo({
        url: '../goodsDetail/goodsDetail?id=' + e.currentTarget.dataset.id,
      })
    }
  },
  onShow: function () {
  },
  onLoad: function (options) {
    this.getAllData();
    this.getHistorySearch();
  },
  //清除历史记录
  cleanhistory: function (e) {
    wx.clearStorageSync('newArray')
    this.setData({
      searchList : [],
      historyArray: [], //清空历史记录数组
      newArray: [],
      shoopingtext: "" //清空搜索框
    })
  },
  //搜索
  search: function (e) {
    var that = this
    var searchtext = this.data.shoopingtext; //搜索框的值
    var newArray = this.data.newArray
    var sss = true;
    if (searchtext.length != 0) {
      //将搜索框的值赋给历史数组
      this.data.historyArray.push(searchtext);
      that.data.historyArray = that.data.historyArray.filter((x, index,self)=>self.indexOf(x)===index)
      this.setData({
        newArray: this.data.historyArray //给新历史记录数组赋值
      })
      console.log(that.data.newArray)
      //模糊查询 循环查询数组中的goodName字段
      var count = 0;
      for (var index in this.data.shoopingarray) {
        var num = this.data.shoopingarray[index].goodName.indexOf(searchtext);
        if (num != -1) { //找到了结果
          that.data.searchList.push(this.data.shoopingarray[index])
          that.setData({
                  searchList: that.data.searchList,
                  shoppinglist: true, //显示找到的结果
                  history: false, //关闭历史记录
              })
          sss = false //隐藏未找到提示
        }else{
          count++;
        }
      }
      that.data.searchList = that.data.searchList.filter((x, index,self)=>self.indexOf(x)===index)
      that.setData({
        searchList: that.data.searchList
      })
      console.log( that.data.searchList)
      if (count == this.data.shoopingarray.length) //如果未找到
      {
        that.setData({
          history: false, //隐藏历史记录
          noneview: sss, //显示未找到提示
          shoppinglist: false, //隐藏商品结果
        })
        console.log("新的历史记录", this.data.newArray)
      }
      //将输入值放入历史记录中，放前8条
      if (newArray.length > 8) {
        newArray.shift()
      }
      that.data.newArray = that.data.newArray.filter((x, index,self)=>self.indexOf(x)===index)
      wx.setStorageSync('newArray', newArray)
    } else { //输入为空
      wx.showToast({
        title: '输入不能为空',
        icon: 'none'
      })
      this.setData({
        noneview: false, //关闭未找到提示
        shoppinglist: false, //隐藏商品列表
        history: false, //隐藏历史记录
      })
    }
  },
  // 取得本地储存函数
  getHistorySearch: function () {
    this.setData({
      newArray: wx.getStorageSync('newArray') || []//若无存储则为空
    })
  },

  getAllData() {
    // let that = this;
    // wx.cloud.database().collection('second_hand')
    // .where({
    //   isDelete: false,
    //   isSold: false
    // })
    //   .orderBy('createTime', 'desc') //按发布动态排序
    //   .get({
    //     success(res) {
    //       console.log("请求成功", res)
    //       that.setData({
    //         shoopingarray: res.data
    //       })
    //     },
    //     fail(res) {
    //       console.log("请求失败", res)
    //     }
    //   })
      let that = this;
      wx.cloud.database().collection('second_hand').count().then(async res => {
      let total = res.total;
      // 计算需分几次取
      const batchTimes = Math.ceil(total / 20)
      // 承载所有读操作的 promise 的数组
      for (let i = 0; i < batchTimes; i++) {
        await  wx.cloud.database().collection('second_hand').skip(i * 20).limit(20)
        .where({
          isDelete: false,
          isSold: false
        }).get().then(async res => {
          let new_data = res.data
          let old_data = that.data.shoopingarray
          that.setData({
            shoopingarray: old_data.concat(new_data)
          })
        })
      }
      console.log(that.data.shoopingarray)
    })
    
     
  },
 
  //搜索框的值
  shoppinginput: function (e) {
    //当删除input的值为空时
    if (e.detail.value == "") {
      this.setData({
        searchList : [],
        history: true, //显示历史记录
        shoppinglist: false, //隐藏商品列表
        noneview: false
      });
    }
    this.setData({
      shoopingtext: e.detail.value
    })
  },
  //点击历史记录赋值给搜索框
  textfz: function (e) {
    this.setData({
      shoopingtext: e.target.dataset.text
    })
  },
  toOrderDetail(e) {
    const orderId = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: `../employeeEndDetail/employeeEndDetail?orderId=${orderId}`,
    })
  },
  receiveOrderHandle(e) {
    const that = this;
    const orderId = e.currentTarget.dataset.orderid;
    wx.showModal({
      title: '是否确定接单',
      content: '接单后不可取消',
      success: async (result) => {
        if (result.confirm) {
          const params = {
            orderId,
            orderType: "receive",
            action: 1 //修改状态为员工已接单，未配送
          };
          const res = await changeOrderStatus(params);
          //console.log(that.data.orderItem.status)
          that.setData({
            'orderItem.status': 2
          })
          console.log(that.data.orderItem.status)
          that.onShow();
        }
      }
    })
  },
  deleteText() {
    this.setData({
      searchList : [],
      shoopingtext: '',
      history: true,
      shoppinglist: false, //隐藏商品列表
      noneview: false
    })
  }
})