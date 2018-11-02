// pages/coupon/coupon.js
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //模拟所有的兑换券
    couponList: [{
      couponId: 123456780,
      satisfy_pic: 100,
      coupon_pic: 20,
      finish_time: '永久',
      create_time: ''
    }, {
      couponId: 123456781,
      satisfy_pic: 200,
      coupon_pic: 30,
      finish_time: '永久',
      create_time: ''
    }, {
      couponId: 123456782,
      satisfy_pic: 50,
      coupon_pic: 10,
      finish_time: '永久',
      create_time: ''
    }, {
      couponId: 123456783,
      satisfy_pic: 500,
      coupon_pic: 50,
      finish_time: '永久',
      create_time: ''
    }, {
      couponId: 123456784,
      satisfy_pic: 1000,
      coupon_pic: 100,
      finish_time: '永久',
      create_time: ''
    }, {
      couponId: 123456785,
      satisfy_pic: 200,
      coupon_pic: 99,
      finish_time: '永久',
      create_time: ''
    }, {
      couponId: 123456786,
      satisfy_pic: 300,
      coupon_pic: 20,
      finish_time: '永久',
      create_time: ''
    }, {
      couponId: 123456787,
      satisfy_pic: 500,
      coupon_pic: 120,
      finish_time: '永久',
      create_time: ''
    }, {
      couponId: 123456788,
      satisfy_pic: 100,
      coupon_pic: 59,
      finish_time: '永久',
      create_time: ''
    }, {
      couponId: 123456789,
      satisfy_pic: 1000,
      coupon_pic: 99,
      finish_time: '永久',
      create_time: ''
    }],
    //显示剩余的兑换券
    coupon_m: [],
    // 输入的兑换码
    couponVal: '',
    // 是否返回上一页
    isBack: 'true'
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
    this.setData({
      coupon_m: wx.getStorageSync('couponList') //还有多少优惠券
    })
  },
  // 点击优惠券
  choose_coupon: function(e) {
    console.log(e.currentTarget.dataset.index);
    var chooseCoupon = e.currentTarget.dataset.index;
    var chooselist = wx.getStorageSync('couponList'); //记录点击的优惠券 以用来结算页面选择优惠券
    var couponInfo = {};
    for (let list of chooselist) {
      if (list.couponId == chooseCoupon) {
        couponInfo.couponId = list.couponId;
        couponInfo.pic = list.coupon_pic;
      }
    }
    if (this.data.isBack == 'true') {
      wx.setStorage({
        key: 'choose_coupon',
        data: couponInfo,
        success: function() {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },
  // 点击不使用优惠券按钮
  no_coupon: function(e) {
    var couponInfo = {};
    couponInfo.couponId = 0;
    couponInfo.pic = 0;
    if (this.data.isBack == 'true') {
      wx.setStorage({
        key: 'choose_coupon',
        data: couponInfo,
        success: function() {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },
  // 获取input输入值
  couponVal: function(e) {
    // this.data.couponVal = e.detail.value;
    this.setData({
      couponVal: e.detail.value
    })
  },
  //点击兑换按钮 进行兑换码的验证 以及是否兑换过优惠券
  exchange_btn: function() {
    console.log(wx.getStorageSync('couponLists'))
    console.log(wx.getStorageSync('couponList'))
    var that = this;
    var create_time = Math.round(new Date());
    create_time = utils.formatTime_one(create_time)
    var couponVal = that.data.couponVal.trim();
    var couponList = that.data.couponList;
    var couponStorage = wx.getStorageSync('couponList'); //优惠券库存
    var couponStorages = wx.getStorageSync('couponLists'); //兑换过的所以优惠券记录
    var couponInfo = {};
    var yx = 0;
    for (let val of couponList) {
      if (val.couponId == couponVal) {
        yx = 1;
        break;
      }
    }
    if (couponVal == '') {
      wx.showModal({
        title: '提示',
        content: '请输入兑换码',
      })
    } else if (yx != 1) {
      wx.showToast({
        title: '无效的兑换码',
        icon: 'none'
      })
    } else {
      for (let val of couponList) {
        if (val.couponId == couponVal) {
          // console.log(val.couponId)
          couponInfo.create_time = create_time;
          couponInfo.satisfy_pic = val.satisfy_pic;
          couponInfo.coupon_pic = val.coupon_pic;
          couponInfo.finish_time = '永久';
          couponInfo.state = 0;
          couponInfo.couponId = val.couponId;
          if (couponStorages) { //不是第一次兑换 有兑换记录
            var coupon_y = 0;
            for (let list of couponStorages) {
              console.log(list)
              if (list.couponId == couponVal) {
                console.log(1111)
                coupon_y = 1;
                break;
              }
            }
            if (coupon_y == 1) {
              that.setData({
                couponVal: ''
              })
              wx.showToast({
                title: '您已兑换过了~~',
                icon: 'none'
              })
            } else if (couponStorage){ //判断有优惠券库存缓存没？有push进去
              couponStorage.push(couponInfo);
              couponStorages.push(couponInfo);
              wx.setStorage({
                key: 'couponList',
                data: couponStorage,
                success: function() {
                  that.data.coupon_m = [];
                  wx.showLoading({
                    title: '加载中...',
                  })
                  wx.setStorage({
                    key: 'couponLists',
                    data: couponStorages,
                    success: function() {
                      setTimeout(() => {
                        that.setData({
                          coupon_m: wx.getStorageSync('couponList'),
                          couponVal: ''
                        });
                        wx.hideLoading();
                      }, 1000)
                    }
                  })
                }
              })
            }else{
              couponStorages.push(couponInfo);
              wx.setStorage({
                key: 'couponList',
                data: [couponInfo],
                success: function () {
                  that.data.coupon_m = [];
                  wx.showLoading({
                    title: '加载中...',
                  })
                  wx.setStorage({
                    key: 'couponLists',
                    data: couponStorages,
                    success: function () {
                      setTimeout(() => {
                        that.setData({
                          coupon_m: wx.getStorageSync('couponList'),
                          couponVal: ''
                        });
                        wx.hideLoading();
                      }, 1000)
                    }
                  })
                }
              })
            }
          } else { //是第一次兑换 无兑换记录
            wx.setStorage({ //无优惠券库存 创建优惠券缓存 并添加进去
              key: 'couponList',
              data: [couponInfo],
              success: function() {
                that.data.coupon_m = [];
                wx.showLoading({
                  title: '加载中...',
                })
                wx.setStorage({
                  key: 'couponLists',
                  data: [couponInfo],
                  success: function() {
                    setTimeout(() => {
                      that.setData({
                        coupon_m: wx.getStorageSync('couponList'),
                        couponVal: ''
                      });
                      wx.hideLoading();
                    }, 1000)
                  }
                })
              }
            })
          }
        }
      }
    }
    // console.log(this.data.coupon_m)
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