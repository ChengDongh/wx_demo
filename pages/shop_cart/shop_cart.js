// pages/shop_cart/shop_cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    delBtnWidth: 120, //删除按钮宽度单位（rpx）
    allSelect: false, //是否全选
    hidden: true,
    allMoney: 0
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initEleWidth();
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
      var list = this.data.list;
      if (index !== "" && index != null) {
        list[index].left = left;
        this.setData({
          list: list
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
      var list = this.data.list;
      if (index !== "" && index != null) {
        list[index].left = left;
        this.setData({
          list: list
        });
        // this.setGoodsList(list)
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */

  //go首页
  goshopping: function() {
    wx.switchTab({
      url: '/pages/market/market',
    })
  },
  // 获取购物车缓存
  onShow: function() {
    var list = wx.getStorageSync('cartinfo');
    this.setData({
      list,
    })
    this.ifallselect()
    this.countMoney(list)
  },

  // 删除
  delItem: function(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    list.splice(index, 1);
    this.setGoodsList(list);
    this.countMoney(list);
  },
  // 减
  jianBtnTap: function(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    if (list[index].num > 1) {
      list[index].num--;
    }
    this.setGoodsList(list);
  },
  // 加
  jiaBtnTap: function(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    list[index].num++;
    list[index].active = true;
    this.ifallselect();
    this.setGoodsList(list);
  },

  // 商品的勾选
  selectTap: function(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    if (list[index].active) {
      list[index].active = false;
    } else {
      list[index].active = true;
    }
    this.ifallselect();
    this.countMoney(list);
    this.setGoodsList(list);
  },
  //判断是否全选
  ifallselect: function() {
    var list = this.data.list;
    var record = 1;
    for (let value of list) {
      if (value.active == false) {
        record = 0;
        this.setData({
          allSelect: false
        });
        break;
      }
    }
    if (record == 1) {
      this.setData({
        allSelect: true
      });
    }
  },
  //全选全不选(点击全选按钮时)
  bindAllSelect: function() {
    var list = this.data.list;
    var allSelect = this.data.allSelect;
    if (this.data.allSelect) {
      for (let value of list) {
        if (value.active == true) {
          value.active = false
        }
      }
      wx.setStorage({
        key: 'isAllSelect',
        data: false,
      })
    } else {
      for (let value of list) {
        if (value.active == false) {
          value.active = true
        }
      }
      wx.setStorage({
        key: 'isAllSelect',
        data: true,
      })
    }
    this.setData({
      allSelect: !allSelect
    })
    this.setGoodsList(list)
  },
  // 更新商品的数量 状态（缓存）
  setGoodsList: function(list) {
    this.setData({
      list: list
    })
    if (this.data.list == '') {
      wx.removeStorage({
        key: 'cartinfo',
      })
      this.setData({
        list: list
      })
    } else {
      wx.setStorage({
        key: 'cartinfo',
        data: list,
      })
    }
    this.countMoney(list)
  },
  // 总价格
  countMoney: function(list) {
    var allMoney = 0;
    for (let value of list) {
      if (value.active) {
        allMoney = allMoney + value.num * Number(value.sku.price)
      }
    }
    if (allMoney !== 0) {
      this.setData({
        hidden: false,
        allMoney: allMoney.toFixed(2)
      })
    } else {
      this.setData({
        hidden: true
      })
    }
  },
  //结算
  branch: function() {
    var hidden = this.data.hidden;
    if (!hidden) {
      var list = this.data.list;
      var order = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i].active) {
          order.push(list[i]);
          list.splice(i, 1);
          i--;
        }
      }
      this.setData({
        list
      });
      wx.setStorage({
        key: 'cartinfo',
        data: list,
      });
      wx.setStorage({
        key: 'orderInfo',
        data: order,
      });
      wx.navigateTo({
        url: '/pages/placeorder/palceorder',
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