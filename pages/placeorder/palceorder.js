var utils = require("../../utils/util.js");
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentExpress: {},//地址信息
    addressInfo: false,
    total: 0,
    total_a: 0,
    provinces: [{
      id: 0,
      provinces: '河南省'
    }, {
      id: 1,
      provinces: '四川省'
    }],
    citys: [{
      id: 0,
      citys: '信阳'
    }, {
      id: 1,
      citys: '驻马店'
    }],
    districts: [{
      id: 0,
      districts: '潢川'
    }, {
      id: 1,
      districts: '光山'
    }],
    index: [],
    show: false,
    product: [],
    id: null,
    coupon: 0,
    couponId: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var couponInfo = {};
    couponInfo.couponId = 0;
    couponInfo.pic = 0;
    wx.setStorage({
      key: 'choose_coupon',
      data: couponInfo,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  //获取input输入值
  addinfor: function(e) {
    var currentExpress = this.data.currentExpress;
    switch (e.currentTarget.dataset.index) {
      case 'name':
        currentExpress.name = e.detail.value
        break;
      case 'mobile':
        currentExpress.mobile = e.detail.value
        break;
      case 'location':
        currentExpress.location = e.detail.value
        break;
    }
    this.setData({
      currentExpress
    })
  },
  //selet选择器改变时触发
  bindChange: function(e) {
    var value = e.detail.value
    var idx = this.data.index
    if (value[0] != idx[0]) {
      this.setData({
        index: [value[0], 0, 0]
      })
    } else if (value[1] != idx[1]) {
      this.setData({
        index: [value[0], value[1], 0]
      })
    } else if (value[2] != idx[2]) {
      this.setData({
        index: [value[0], value[1], value[2]]
      })
    }
  },
  //关闭打开select
  selectCity: function() {
    var show = this.data.show;
    this.setData({
      show: !show
    })
  },
  //确定按钮 保存select的值
  saveCity: function() {
    var index = this.data.index;
    var show = this.data.show;
    var currentExpress = this.data.currentExpress;
    if (index.length > 0) {
      currentExpress.province = this.data.provinces[index[0]].provinces;
      currentExpress.city = this.data.citys[index[1]].citys;
      currentExpress.area = this.data.districts[index[2]].districts;
    } else {
      currentExpress.province = this.data.provinces[0].provinces;
      currentExpress.city = this.data.citys[0].citys;
      currentExpress.area = this.data.districts[0].districts;
    }
    this.setData({
      currentExpress,
      show: !show
    })
  },
  //保存收货人信息
  saveAddress: function() {
    var message = '';
    var that = this;
    if (that.data.currentExpress.name == undefined) {
      message = '请填写收货人姓名'
    } else if ((!utils.isphone(that.data.currentExpress.mobile) && that.data.currentExpress.mobile == undefined) || (!utils.isphone(that.data.currentExpress.mobile) && that.data.currentExpress.mobile != undefined)) {
      message = '请输入正确的手机号'
    } else if (that.data.currentExpress.province == undefined) {
      message = '请选择地区'
    } else if (that.data.currentExpress.location == undefined) {
      message = '请填写详细地址'
    }
    if (message !== '') {
      wx.showModal({
        title: '提示',
        content: message,
      })
    } else {
      var currentExpress = this.data.currentExpress;
      wx.setStorage({
        key: 'addresssInfoALL',
        data: [currentExpress]
      })
      this.setData({
        addressInfo: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  choose_coupon: function() {
    wx.navigateTo({
      url: '/pages/coupon/coupon',
    })
  },
  onShow: function() {
    console.log(1111)
    var that = this;
    that.setData({
      coupon: 0,
      couponId: 0
    })
    var addresssStorage = wx.getStorageSync('addresssInfo');//地址信息
    var addresssStorageALL = wx.getStorageSync('addresssInfoALL');//所以的地址信息
    var couponStorage = wx.getStorageSync('choose_coupon');//选择的优惠券
    console.log(couponStorage)
    if (couponStorage) {//（如果优惠券页面中点击了优惠券）是否存在优惠券
      that.setData({
        coupon: couponStorage.pic,
        couponId: couponStorage.couponId
      })
    }
    console.log(this.data.coupon)
    if (addresssStorage && addresssStorageALL) {//判断是否是已经选过地址了
      that.setData({
        currentExpress: addresssStorage,
        addressInfo: true
      })
    } else {
      if (addresssStorageALL) {//如果是没有选过地址 切设置过地址 默认选择第一个 
        wx.getStorage({
          key: 'addresssInfoALL',
          success: function(res) {
            if (res.data.length > 0) {
              that.setData({
                currentExpress: res.data[0],
                addressInfo: true
              })
            } else {
              that.setData({
                addressInfo: false,
                currentExpress: {}
              })
            }
          },
        })
      } else {//如果是没有选过地址 切没有设置过地址 开始设置地址
        that.setData({
          addressInfo: false,
          currentExpress: {}
        })
      }
    }
    wx.getStorage({//获取结算商品的信息
      key: 'orderInfo',
      success: function(res) {
        var total = 0;
        var total_a = that.data.total_a;
        for (let i of res.data) {
          total = total + Number(i.sku.price) * i.num
        }
        total_a = total - that.data.coupon
        that.setData({
          product: res.data,
          total: total.toFixed(2),
          total_a: total_a.toFixed(2),
        })
      },
    })

  },
  //支付
  payment_btn: function() {
    var that = this;
    if (that.data.addressInfo == false) {
      wx.showModal({
        title: '提示',
        content: '请输入地址信息！',
      })
      return false;
    }
    wx.showModal({
      title: '提示',
      content: '确认支付？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '',
      confirmText: '确定',
      confirmColor: '',
      success: function(res) {
        if (res.confirm) {
          var total = that.data.total_a;
          var state = 0;
          var orderID = Math.round(new Date());
          var obligationStorage = wx.getStorageSync('orderInfo');
          var allOrderStorage = wx.getStorageSync('allOrder');
          var chooselist = wx.getStorageSync('couponList');
          var obligation = {};
          obligation.content = obligationStorage;
          obligation.orderID = orderID;
          obligation.state = state;
          obligation.total = total;
          if (allOrderStorage) {
            allOrderStorage.push(obligation)
            wx.setStorage({
              key: 'allOrder',
              data: allOrderStorage,
              success: function() {
                wx.showToast({
                  title: '支付成功',
                })
                wx.removeStorage({//删除选中的优惠券
                  key: 'choose_coupon',
                  success: function(res) {},
                })
                for (let i in chooselist) {
                  if (chooselist[i].couponId == that.data.couponId) {
                    chooselist.splice(i, 1)
                  }
                }
                if (chooselist.length > 0) {//从优惠券库存中删除选择的优惠券
                  wx.setStorage({
                    key: 'couponList',
                    data: chooselist,
                  })
                } else {
                  wx.removeStorage({//优惠券库存只存在这一个优惠券 将优惠券库存缓存删除，（优惠券页面添加时重新设置库存缓存）
                    key: 'couponList',
                    success: function(res) {
                      console.log('成功')
                    },
                  })
                }
                setTimeout(() => {
                  that.setData({
                    coupon: 0
                  })
                  wx.navigateTo({
                    url: '/pages/orderList/orderList',
                  })
                }, 1000)
              }
            })
          } else {
            wx.setStorage({
              key: 'allOrder',
              data: [obligation],
              success: function() {
                wx.showToast({
                  title: '支付成功',
                })
                wx.removeStorage({
                  key: 'choose_coupon',
                  success: function(res) {},
                })
                for (let i in chooselist) {
                  if (chooselist[i].couponId == that.data.couponId) {
                    chooselist.splice(i, 1)
                  }
                }
                if (chooselist.length > 0) {
                  wx.setStorage({
                    key: 'couponList',
                    data: chooselist,
                  })
                } else {
                  wx.removeStorage({
                    key: 'couponList',
                    success: function(res) {
                      console.log('成功')
                    },
                  })
                }

                setTimeout(() => {
                  that.setData({
                    coupon: 0
                  })
                  wx.navigateTo({
                    url: '/pages/orderList/orderList',
                  })
                }, 1000)
              }
            })
          }
        } else if (res.cancel) {
          var state = 1;
          var total = that.data.total_a;
          var orderID = Math.round(new Date());
          var obligationStorage = wx.getStorageSync('orderInfo');
          var allOrderStorage = wx.getStorageSync('allOrder');
          var chooselist = wx.getStorageSync('couponList');
          var obligation = {};
          obligation.content = obligationStorage;
          obligation.orderID = orderID;
          obligation.state = state;
          obligation.total = total;
          if (allOrderStorage) {
            allOrderStorage.push(obligation)
            wx.setStorage({
              key: 'allOrder',
              data: allOrderStorage,
              success: function() {
                wx.showToast({
                  title: '支付失败',
                });
                wx.removeStorage({
                  key: 'choose_coupon',
                  success: function(res) {},
                })
                for (let i in chooselist) {
                  if (chooselist[i].couponId == that.data.couponId) {
                    chooselist.splice(i, 1)
                  }
                }
                if (chooselist.length > 0) {
                  wx.setStorage({
                    key: 'couponList',
                    data: chooselist,
                  })
                } else {
                  wx.removeStorage({
                    key: 'couponList',
                    success: function(res) {
                      console.log('成功')
                    },
                  })
                }

                setTimeout(() => {
                  that.setData({
                    coupon: 0
                  })
                  wx.navigateTo({
                    url: '/pages/orderList/orderList',
                  })
                }, 1000)
              }
            })
          } else {
            wx.setStorage({
              key: 'allOrder',
              data: [obligation],
              success: function() {
                wx.showToast({
                  title: '支付失败',
                })
                wx.removeStorage({
                  key: 'choose_coupon',
                  success: function(res) {},
                })
                for (let i in chooselist) {
                  if (chooselist[i].couponId == that.data.couponId) {
                    chooselist.splice(i, 1)
                  }
                }
                if (chooselist.length > 0) {
                  wx.setStorage({
                    key: 'couponList',
                    data: chooselist,
                  })
                } else {
                  wx.removeStorage({
                    key: 'couponList',
                    success: function(res) {
                      console.log('成功')
                    },
                  })
                }

                setTimeout(() => {
                  that.setData({
                    coupon: 0
                  })
                  wx.navigateTo({
                    url: '/pages/orderList/orderList',
                  })
                }, 1000)
              }
            })
          }
        }

      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  go_delivery: function() {
    wx.navigateTo({
      url: '/pages/delivery/delivery',
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