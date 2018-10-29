// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectList: [],
    delBtnWidth: 120
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initEleWidth();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var collectList = wx.getStorageSync('collectInfo');
    this.setData({
      collectList
    })
  },

  //获取元素自适应后的实际宽度
  getEleWidth: function(w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
    }
  },
  initEleWidth: function() {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  // 左滑功能(getEleWidth() initEleWidth() touchS() touchM() touchE())
  touchS: function(e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function(e) {
    var index = e.currentTarget.dataset.index;
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，container位置不变
        left = "margin-left:0px";
      } else if (disX > 0) { //移动距离大于0，container left值等于手指移动距离
        if (disX >= delBtnWidth) {
          left = "left:-" + delBtnWidth + "px";
        } else {
          left = "margin-left:-" + disX + "px";
        }
      }
      var collectList = this.data.collectList;
      if (index !== "" && index != null) {
        collectList[index].left = left;
        this.setData({
          collectList: collectList
        });
        // this.setGoodsList(list)
      }
    }
  },

  touchE: function(e) {
    var index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "px" : "margin-left:0px";
      var collectList = this.data.collectList;
      if (index !== "" && index != null) {
        collectList[index].left = left;
        this.setData({
          collectList: collectList
        });
        // this.setGoodsList(list)
      }
    }
  },

  delItem:function(e){
    var collectList = this.data.collectList;
    var index = e.currentTarget.dataset.index
    collectList.splice(index,1)
    this.setData({
      collectList
    })
    if (collectList==''){
      wx.removeStorage({
        key: 'collectInfo',
        success:function(){
          wx.showToast({
            title: '删除成功',
          })
        }
      })
    }else{
      wx.setStorage({
        key: 'collectInfo',
        data: collectList,
        success: function () {
          wx.showToast({
            title: '删除成功',
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})