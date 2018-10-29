// pages/orderList/orderList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [{
        id: 0,
        orderState: 0,
        title: "全部",
        bar_color: "bar_color",
        orders: []
      },
      {
        id: 1,
        orderState: 1,
        title: "待付款",
        bar_color: "unbar_color",
        orders: []
      },
      {
        id: 2,
        orderState: 4,
        bar_color: "unbar_color",
        title: "待发货",
        orders: []
      },
      {
        id: 3,
        orderState: 5,
        bar_color: "unbar_color",
        title: "已发货",
        orders: []
      },
      {
        id: 4,
        orderState: 10,
        bar_color: "unbar_color",
        title: "已完成",
        orders: []
      }
    ],
    currentOrder: null,
    id: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: 0
    })
  },

  selectBar: function(e) {
    var orders = this.data.orders;
    for (let value of orders) {
      if (value.id != e.currentTarget.dataset.id) {
        value.bar_color = 'unbar_color';
      } else {
        value.bar_color = 'bar_color';
      }
    }
    this.setData({
      orders
    })
    this.updateCurrentOrder(e.currentTarget.dataset.id);
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
    this.updateCurrentOrder(this.data.id);
  },
  updateCurrentOrder:function(id){
    var currentOrder = this.data.currentOrder;
    currentOrder = this.data.orders[id];
    this.setData({
      currentOrder,
      id
    })
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