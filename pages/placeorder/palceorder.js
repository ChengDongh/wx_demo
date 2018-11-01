var utils = require("../../utils/util.js");
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentExpress: {},
    addressInfo:false,
    total:0,
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
    product:[],
    id:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

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
  selectCity: function() {
    var show = this.data.show;
    this.setData({
      show: !show
    })
  },
  saveCity: function() {
    var index = this.data.index;
    var show = this.data.show;
    var currentExpress = this.data.currentExpress;
    if(index.length>0){
      currentExpress.province = this.data.provinces[index[0]].provinces;
      currentExpress.city = this.data.citys[index[1]].citys;
      currentExpress.area = this.data.districts[index[2]].districts;
    }else{
      currentExpress.province = this.data.provinces[0].provinces;
      currentExpress.city = this.data.citys[0].citys;
      currentExpress.area = this.data.districts[0].districts;
    }
    this.setData({
      currentExpress,
      show: !show
    })
  },
  saveAddress:function(){
    var message = '';
    var that = this;
    if (that.data.currentExpress.name == undefined){
      message = '请填写收货人姓名'
    } else if ((!utils.isphone(that.data.currentExpress.mobile) && that.data.currentExpress.mobile == undefined) || (!utils.isphone(that.data.currentExpress.mobile) && that.data.currentExpress.mobile != undefined)){
      message = '请输入正确的手机号'
    } else if (that.data.currentExpress.province == undefined){
      message = '请选择地区'
    } else if (that.data.currentExpress.location == undefined){
      message = '请填写详细地址'
    }
    if(message !==''){
      wx.showModal({
        title: '提示',
        content: message,
      })
    }else{
      var currentExpress = this.data.currentExpress;
      wx.setStorage({
        key: 'addresssInfoALL',
        data: [currentExpress]
      })
      this.setData({
        addressInfo:true
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  
  onShow: function() {
    var that = this;
    var addresssStorage = wx.getStorageSync('addresssInfo');
    var addresssStorageALL = wx.getStorageSync('addresssInfoALL');
    if (addresssStorage && addresssStorageALL){
      that.setData({
        currentExpress: addresssStorage,
        addressInfo: true
      })
    }else{
      if (addresssStorageALL){
        wx.getStorage({
          key: 'addresssInfoALL',
          success: function (res) {
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
      }else{
        that.setData({
          addressInfo: false,
          currentExpress:{}
        })
      } 
    }
    wx.getStorage({
      key: 'orderInfo',
      success: function(res) {
        var total = 0;
        for(let i of res.data){
          total = total + Number(i.sku.price)*i.num
        }
        that.setData({
          product:res.data,
          total: total.toFixed(2)
        })
      },
    })
    
  },
  payment_btn:function(){
    
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
          var total = that.data.total;
          var state = 0;
          var orderID = Math.round(new Date());
          var obligationStorage = wx.getStorageSync('orderInfo');
          var allOrderStorage = wx.getStorageSync('allOrder');
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
              success: function () {
                wx.showToast({
                  title: '支付成功',
                })
                setTimeout(() => {
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
              success: function () {
                wx.showToast({
                  title: '支付成功',
                })
                setTimeout(()=>{
                  wx.navigateTo({
                    url: '/pages/orderList/orderList',
                  })
                },1000)
              }
            })
          }
        } else if (res.cancel) {
          var state = 1;
          var total = that.data.total;
          var orderID = Math.round(new Date());
          var obligationStorage = wx.getStorageSync('orderInfo');
          var allOrderStorage = wx.getStorageSync('allOrder');
          var obligation = {};
          obligation.content = obligationStorage;
          obligation.orderID = orderID;
          obligation.state = state;
          obligation.total = total;
          if (allOrderStorage){
            allOrderStorage.push(obligation)
            wx.setStorage({
              key: 'allOrder',
              data: allOrderStorage,
              success:function(){
                wx.showToast({
                  title: '支付失败',
                })
                setTimeout(() => {
                  wx.navigateTo({
                    url: '/pages/orderList/orderList',
                  })
                }, 1000)
              }
            })
          }else{
            wx.setStorage({
              key: 'allOrder',
              data: [obligation],
              success: function () {
                wx.showToast({
                  title: '支付失败',
                })
                setTimeout(() => {
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
  go_delivery:function(){
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