// pages/employeeEndDetail/employeeEndDetail.js
const { getOrderDetail,changeOrderStatus } = require('../../api/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    orderDetail: {},
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    //console.log(options)
    this.setData({
      orderId : options.orderId
    })
    const { orderId } = options;
    wx.showLoading();
    this.getOrderDetailData();
    wx.hideLoading();
  
  },
  getOrderDetailData: async function (){
    const res = await getOrderDetail({ id: this.data.orderId });
    let orderDetail = res.data[0];
    console.log(res)
    this.setData({
        orderDetail,
        loading: false
    });
    console.log(this.data.orderDetail)
  },
  receiveOrderHandle(e){
    const that = this;
    const orderId = e.currentTarget.dataset.orderid;
            wx.showModal({
                title: '是否确定接单',
                content: '接单后不可取消',
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
                      console.log("修改状态成功")
                    }
                  })
      },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOrderDetailData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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