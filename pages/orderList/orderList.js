// pages/orderList/orderList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [{
        id: 0,
        orderState: 5,
        title: "全部",
        bar_color: "bar_color",
        orders: [],

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
        orderState: 0,
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
    isBack: 'true',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (JSON.stringify(options) != '{}') {
      this.setData({
        isBack: options.isBack
      })
    }
    this.setData({
      id: 0,
    })
  },
  //头部的tabbar
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
  //再来一单
  go_back: function(e) {
    var that = this;
    var orderID = e.currentTarget.dataset.index;
    var allOrder = wx.getStorageSync('allOrder');
    var orderInfo = wx.getStorageSync('orderInfo');
    for (let val of allOrder) {
      if (val.orderID == orderID) {
        orderInfo = val.content;
      }
    }
    wx.setStorage({
      key: 'orderInfo',
      data: orderInfo,
      success: function() {
        if (that.data.isBack == 'true') {
          that.setData({
            isBack:'false'
          })
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.redirectTo({
            url: '/pages/placeorder/palceorder',
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {//默认首次加载的是全部的订单

    var orders = this.data.orders;
    var ordersStorage = wx.getStorageSync('allOrder');//获取所以的订单
    console.log(ordersStorage)
    if (ordersStorage.length>0){
      function sortprice(a, b) {
        return b.orderID - a.orderID
      };
      ordersStorage.sort(sortprice);
    }
    for (let value of ordersStorage) {
      for (let val of orders) {
        if (val.orderState == value.state) {
          val.orders.push(value);
        }
      }
    }
    orders[this.data.id].orders = ordersStorage;
    this.setData({
      orders
    })
    this.updateCurrentOrder(this.data.id);
  },
  updateCurrentOrder: function(id) {//tabbar切换时加载的数据
    this.setData({
      currentOrder: null,
      id: null
    })
    wx.showLoading({
      title: '加载中...',
    })
    var currentOrder = this.data.currentOrder;
    currentOrder = this.data.orders[id].orders;
    setTimeout(() => {
      wx.hideLoading();
      this.setData({
        currentOrder,
        id
      })
    }, 1000)
  },
  //取消订单
  cancelBtn: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var currentOrder = that.data.currentOrder;
    var ordersStorage = wx.getStorageSync('allOrder');
    function sortprice(a, b) {
      return b.orderID - a.orderID
    };
    ordersStorage.sort(sortprice);
    var orders = that.data.orders
    wx.showModal({
      title: '提示',
      content: '取消订单？',
      success(res) {
        if (res.confirm) {
          that.setData({
            currentOrder: null
          })
          wx.showLoading({
            title: '加载中...',
          })
          if (that.data.id == 0) {//如果是在全部的tabbar界面 改变订单的状态
            for (let i in currentOrder) {
              if (currentOrder[i].orderID == index) {
                currentOrder[i].state = 2;
                for (let val of ordersStorage) {
                  if (val.orderID == index) {
                    val.state = 2;
                  }
                }
              }
            }
          } else {//如果是在待支付的tabbar界面 改变订单的状态并将其删除
            for (let i in currentOrder) {
              if (currentOrder[i].orderID == index) {
                currentOrder.splice(i, 1);
                for (let val of ordersStorage) {
                  if (val.orderID == index) {
                    val.state = 2;
                  }
                }
              }
            }
          }
          wx.setStorage({//操作之后 更新所以订单的状态值（缓存）
            key: 'allOrder',
            data: ordersStorage,
            success: function() {
              setTimeout(() => {
                that.cancel_bt();
                that.setData({
                  currentOrder
                })
                wx.hideLoading();
              }, 1000)
            }
          })
        }
      }
    })
  },
  cancel_bt: function () {//获取所以订单的最新缓存 改变数据
    var orders = this.data.orders;
    var ordersStorage = wx.getStorageSync('allOrder');

    function sortprice(a,b) {
      return b.orderID - a.orderID
    };
    ordersStorage.sort(sortprice);
    for (let val of orders) {
      val.orders = [];
    }
    for (let value of ordersStorage) {
      for (let val of orders) {
        if (val.orderState == value.state) {
          val.orders.push(value);
        }
      }
    }
    orders[0].orders = ordersStorage;
    this.setData({
      orders
    })
  },
  //确定支付
  confirmBtn: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var currentOrder = that.data.currentOrder;
    var ordersStorage = wx.getStorageSync('allOrder');
    
    function sortprice(a, b) {
      return b.orderID - a.orderID
    };
    ordersStorage.sort(sortprice);
    wx.showModal({
      title: '提示',
      content: '确定支付？',
      success(res) {
        if (res.confirm) {
          that.setData({
            currentOrder: null
          })
          wx.showLoading({
            title: '加载中...',
          })
          if (that.data.id == 0) {//如果是在全部的tabbar界面 改变订单的状态
            for (let i in currentOrder) {
              if (currentOrder[i].orderID == index) {
                currentOrder[i].state = 0;
                for (let val of ordersStorage) {
                  if (val.orderID == index) {
                    val.state = 0;
                  }
                }
              }
            }
          } else {
            for (let i in currentOrder) {//如果是在待支付的tabbar界面 改变订单的状态并将其删除
              if (currentOrder[i].orderID == index) {
                currentOrder.splice(i, 1)
                for (let val of ordersStorage) {
                  if (val.orderID == index) {
                    val.state = 0;
                  }
                }
              }
            }
          }

          wx.setStorage({
            key: 'allOrder',
            data: ordersStorage,
            success: function() {
              that.cancel_bt();
              setTimeout(() => {
                that.setData({
                  currentOrder
                })
                wx.hideLoading();
              }, 1000)
            }
          })
        }
      }
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