// pages/address/address.js
var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    currentExpress: {},
    index: [],
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  addinfor: function(e) {
    var currentExpress = this.data.currentExpress;
    console.log(e)
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
  saveAddress: function() {
    var message = '';
    if (this.data.currentExpress.name == undefined) {
      message = '请输入姓名'
    } else if (!utils.isphone(this.data.currentExpress.mobile)) {
      message = '请输入正确的手机号'
    } else if (this.data.currentExpress.province == undefined) {
      message = '请选择地区'
    } else if (this.data.currentExpress.location == undefined) {
      message = '请填写详细地址'
    }
    if (message != '') {
      wx.showModal({
        title: '提示',
        content: message,
      })
    } else {
      var currentExpress = this.data.currentExpress;
      var addresssStorage = wx.getStorageSync('addresssInfoALL')
      if (addresssStorage) {
        addresssStorage.push(currentExpress)
        wx.setStorage({
          key: 'addresssInfoALL',
          data: addresssStorage,
          success: function() {
            wx.showToast({
              title: '添加成功',
            })
            wx.navigateBack({
              delta: 1
            })
          }
        })
      } else {
        wx.setStorage({
          key: 'addresssInfoALL',
          data: [currentExpress],
          success: function() {
            wx.showToast({
              title: '添加成功',
            })
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
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