/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-11 23:42:27
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-12 02:19:28
 * @FilePath: \tastygo\miniprogram\pages\remarks\index.js
 */
Page ({
  data: {
    remarks:''
  },
  onLoad: function() {
    const that = this;
    let pages = getCurrentPages();
    let prePage = pages[pages.length-2];
    that.setData({
      remarks: prePage.data.remarks
    })
  },
  handleInput(e) {
    const that = this;
    const remarks = e.detail.value || '';
    that.setData({
      remarks
    });
  },
  handleConfirm() {
    const that = this;
    let pages = getCurrentPages();
    let prePage = pages[pages.length-2];
    prePage.setData({
      remarks: that.data.remarks
    });

    wx.navigateBack({
      delta: 1
    });
  },
})
