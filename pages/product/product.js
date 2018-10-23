// pages/product/product.js
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    images_0: [{
      image: '../resource/image/img1.png'
    }, {
      image: '../resource/image/img2.png'
    }, {
      image: '../resource/image/img1.png'
    }, {
      image: '../resource/image/img2.png'
    }],
    product: {
      title: '侧耳聆听，世界都变得安静，高清音质体验',
      price: '398.00',
      pre_price: '456.00',
      num: 20,
      nownumber: 0,
      param1s: [{ image:'../resource/image/img1.png'}],
      param1:'颜色',
      param2:'尺码'
    },
    showcover: false,
    show: 1,
    pagesshow: 0,
    sku: [{ price:'398.00'}],
    images: ['../resource/image/img1.png', '../resource/image/img2.png', '../resource/image/img1.png', '../resource/image/img2.png', '../resource/image/img1.png'],
    productAppraise: [{
        user: {
          nackname: 'goodLuck',
          headimgurl: '../resource/image/img2.png'
        },
        create_time: 1540275832000,
        param1: '黑色',
        param2: 'M',
        appraise_desc: '高清音质体验',
        appraise_images: ['../resource/image/img1.png', '../resource/image/img2.png', '../resource/image/img1.png']
      }, {
        user: {
          nackname: '好运',
          headimgurl: '../resource/image/img2.png'
        },
        create_time: 1540275712000,
        param1: '黑色',
        param2: 'M',
        appraise_desc: '侧耳聆听，世界都变得安静',
        appraise_images: ['../resource/image/img1.png', '../resource/image/img2.png', '../resource/image/img1.png']
      },
      {
        user: {
          nackname: '好运',
          headimgurl: '../resource/image/img2.png'
        },
        create_time: 1540275112000,
        param1: '黑色',
        param2: 'M',
        appraise_desc: '侧耳聆听，世界都变得安静，高清音质体验',
        appraise_images: ['../resource/image/img1.png', '../resource/image/img2.png', '../resource/image/img1.png']
      }
    ]
  },

  onShareAppMessage: function(res) {
    return {
      title: this.data.product.title,
      desc: this.data.product.summary,
      path: '/pages/product/product?id=' + this.data.productId
    }
  },

  shopcover: function() {
    var showcover = this.data.showcover;
    this.setData({
      showcover: !showcover
    })

  },

  pagechange: function(e) {
    var pagesshow = e.currentTarget.dataset.index;
    this.setData({
      pagesshow
    });
  },

  buyProduct: function(e) {
    console.log(e);
  },

  collection: function(e) {
    wx.showToast({
      title: '等待功能完善',
      icon:'none'
    })
  },

  gomarket: function() {
    wx.switchTab({
      url: '/pages/market/market',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    for (let i of this.data.productAppraise) {
      i.create_time = utils.formatTime(i.create_time)
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