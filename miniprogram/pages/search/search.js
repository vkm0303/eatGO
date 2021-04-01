const {
  changeOrderStatus
} = require('../../api/api.js')
Page({
  data: {
    shoopingtext: "", //搜索框的值
    history: true, //显示历史记录
    noneview: false, //显示未找到提示
    shoppinglist: false, //显示商品列表
    historyArray: [], //历史记录数组,
    newArray: [], //添加历史记录数组
    shoopingarray: [],
    orderItem: {}
  },
  onShow: function () {
    this.getAllOrderData();
  },
  onLoad: function (options) {
    this.getAllOrderData();
    this.getHistorySearch();
  },
  //清除历史记录
  cleanhistory: function (e) {
    wx.clearStorageSync('newArray')
    this.setData({
      history: false, //隐藏历史记录
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
      this.setData({
        newArray: this.data.historyArray //给新历史记录数组赋值
      })
      var count = 0
      for (var i = 0; i < this.data.shoopingarray.length; i++) {
        if (that.data.shoopingarray[i].code == searchtext) //如果找到结果
        {
          that.setData({
            orderItem: that.data.shoopingarray[i],
            shoppinglist: true, //显示找到的结果
            history: false, //关闭历史记录
          })
          sss = false //隐藏未找到提示
        } else {
          count++
        }
      }
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

  getAllOrderData() {
    var that = this
    const params = {
      canteenId: 5,
      currentPage: 0,
      pageSize: 10000
    }
    const res = require('../../api/api.js').getOrder(params);
    res.then(res => {
      that.setData({
        shoopingarray: res.data
      })
      console.log(this.data.shoopingarray)
    })
  },
 
  //搜索框的值
  shoppinginput: function (e) {
    //当删除input的值为空时
    if (e.detail.value == "") {
      this.setData({
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
      shoopingtext: '',
      history: true,
      shoppinglist: false, //隐藏商品列表
      noneview: false
    })
  }
})