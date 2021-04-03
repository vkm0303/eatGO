// pages/employeeEnd/employeeEnd.js


const {getOrder, receiveOrder, changeOrderStatus} = require('../../api/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
        orderList: [],
        tabIdx: 0,
        realTime: null,//实时数据对象(用于关闭实时刷新方法)
  },
  toOrderDetail(e){
    const orderId = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: `../employeeEndDetail/employeeEndDetail?orderId=${orderId}`,
    })
  },

  getAllOrderData(){
    var that = this
    var date = new Date();
    var year = date.getFullYear();
    var month = (date.getMonth()+1)<10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1)
    var day = date.getDate()<10 ? "0"+date.getDate() : date.getDate()
    var now = year+"-"+month+"-"+day
    var todayOrderList
    console.log(now)
    const params = {
      canteenId : 5,
      // status: 1, 
      currentPage : 0,
      pageSize : 10000
    }
    const res =  require('../../api/api.js').getOrder(params);
    res.then(res => {
      todayOrderList = res.data.filter(function (item){
      return item.createTime.slice(0,10)==now
    })
    that.setData({
      orderList : todayOrderList
    })
    console.log(this.data.orderList)
  })
  },

  receiveOrderHandle(e){
    const that = this;
    const orderId = e.currentTarget.dataset.orderid;
            wx.showModal({
                title: '是否确定打包',
                content: '确定后不可取消',
                success: async(result) => {
                    if (result.confirm) {
                        const params = {
                            orderId,
                            orderType : "receive",
                            action : 1 //修改状态为员工已接单，未配送
                        };
                        const res = await changeOrderStatus(params);
                        that.onShow();
                      }
                    }
                  })
      },
      tabsItemChange(e) {
        const { index } = e.currentTarget.dataset;
        this.setData({
            tabIdx: index
        });
    },
    changeBgcColor() {
      let activeAni = wx.createAnimation({
          duration: 300
      });
      activeAni.backgroundColor('#55bec6').step();

      let disactiveAni = wx.createAnimation({
          duration: 300
      });
      disactiveAni.backgroundColor('#a5dde1').step();

      this.setData({
          activeAni: activeAni.export(),
          disactiveAni: disactiveAni.export()
      });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllOrderData();
    this.changeBgcColor();
    // var n = "2018-12-26 12:00:23"
    //     console.log(n.slice(0,10))
    //     console.log(n)
    //var date = new Date();
    //console.log(date .getFullYear()+"-"+(date .getMonth()+1)+"-"+date .getDate())
    // var nowTime = now.toLocaleString();
    // var data = nowTime.substring(0,10);
    // console.log(data)
  },
  getNewOederData(){
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function()
  {
    var that = this
    /**
     * 防止用户拿不到最新数据(因为页面切换会重新计时)
     * 无条件请求一次最新数据
     */
    that.getAllOrderData();
    console.log('请求接口：刷新数据(无条件执行)')
    

    /**
     * 每隔一段时间请求服务器刷新数据(客户状态)
     * 当页面显示时开启定时器(开启实时刷新)
     * 每隔1分钟请求刷新一次
     * @注意：用户切换后页面会重新计时
     */
    this.data.realTime = setInterval(function()
    {
      // 请求服务器数据
      that.getAllOrderData();
      console.log('请求接口：刷新数据')
    }, 20000)//间隔时间

    // 更新数据
    this.setData({
      realTime:this.data.realTime,//实时数据对象(用于关闭实时刷新方法)
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
 
    /**
     * 当页面隐藏时关闭定时器(关闭实时刷新)
     * 切换到其他页面了
     */
    clearInterval(this.data.realTime)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})