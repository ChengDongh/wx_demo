// pages/product/product.js
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    productId: 0,
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
      param1s: [{
        image: '../resource/image/img1.png',
        title: '黑色',
        disabled: 1
      }, {
        image: '../resource/image/img2.png',
        title: '蓝色',
        disabled: 1
      }, {
        image: '../resource/image/img1.png',
        title: '红色',
        disabled: 1
      }],
      param2s: [{
        image: '../resource/image/img1.png',
        title: 'M',
        disabled: 1
      }, {
        image: '../resource/image/img2.png',
        title: 'L',
        disabled: 1
      }],
      param1: '颜色',
      param2: '尺码'
    },
    showcover: false,
    show: 1,
    pagesshow: 0,
    images: ['../resource/image/img1.png', '../resource/image/img2.png', '../resource/image/img1.png', '../resource/image/img2.png', '../resource/image/img1.png'],
    productAppraise: [{
        user: {
          nackname: 'goodLuck',
          headimgurl: '../resource/image/img2.png'
        },
        create_time: 1540275832000,
        appraise_desc: '高清音质体验',
        appraise_images: ['../resource/image/img1.png', '../resource/image/img2.png', '../resource/image/img1.png']
      }, {
        user: {
          nackname: '好运',
          headimgurl: '../resource/image/img2.png'
        },
        create_time: 1540275712000,
        appraise_desc: '侧耳聆听，世界都变得安静',
        appraise_images: ['../resource/image/img1.png', '../resource/image/img2.png', '../resource/image/img1.png']
      },
      {
        user: {
          nackname: '好运',
          headimgurl: '../resource/image/img2.png'
        },
        create_time: 1540275112000,
        appraise_desc: '侧耳聆听，世界都变得安静，高清音质体验',
        appraise_images: ['../resource/image/img1.png', '../resource/image/img2.png', '../resource/image/img1.png']
      }
    ],
    skuindex1: 0,
    skuindex2: 0,
    skuindex: 0,
    sku: [{
      id: 0,
      price: '398.00',
      param1: '黑色',
      param2: 'M',
      inventory: 1
    }, {
      id: 1,
      price: '398.00',
      param1: '黑色',
      param2: 'L',
      inventory: 2
    }, {
      id: 2,
      price: '398.00',
      param1: '蓝色',
      param2: 'M',
      inventory: 3
    }, {
      id: 3,
      price: '398.00',
      param1: '蓝色',
      param2: 'L',
      inventory: 0
    }, {
      id: 4,
      price: '398.00',
      param1: '红色',
      param2: 'M',
      inventory: 5
    }, {
      id: 5,
      price: '398.00',
      param1: '红色',
      param2: 'L',
      inventory: 6
    }],
    inventory: 0,
    quantity: 1,
    cartbtn: ''
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
    this.setData({
      show: e.currentTarget.dataset.index,
      cartbtn: e.currentTarget.dataset.btn
    })
  },
  closecart: function(e) {
    this.setData({
      show: e.currentTarget.dataset.index
    })
  },
  minus: function() {
    let num = this.data.quantity;
    num--;
    this.setData({
      quantity: num
    })
  },
  plus: function() {
    let num = this.data.quantity;
    num++;
    this.setData({
      quantity: num
    })
  },
  placeorder: function(e) {
    var that = this;
    if (that.data.cartbtn == '加入购物车') {
      let carStorage = wx.getStorageSync('cartinfo');
      let cartinfo = {};
      cartinfo.image = that.data.product.param1s[that.data.skuindex1].image;
      cartinfo.sku = that.data.sku[that.data.skuindex];
      cartinfo.num = that.data.quantity;
      cartinfo.title = that.data.product.title;
      cartinfo.productId = that.data.productId;
      cartinfo.active = true;
      if (carStorage) {
        let a = 1;
        for (let i of carStorage) {
          if (i.sku.id == cartinfo.sku.id){
            a = 2;
            i.num = i.num + cartinfo.num;
            break;
          } 
        }
        if(a == 1){
          carStorage.push(cartinfo)
        }
        wx.setStorage({
          key: 'cartinfo',
          data: carStorage,
          success:function(){
            wx.showToast({
              title: '加入购物车',
              duration:1000
            })
          }
        })
        that.setData({
          show: 1
        })
      } else {
        wx.setStorage({
          key: 'cartinfo',
          data: [cartinfo],
          success: function () {
            wx.showToast({
              title: '加入购物车',
              duration: 1000
            })
          }
        })
        that.setData({
          show: 1
        })
      }
    }else{
      let cartinfo = {};
      cartinfo.image = that.data.product.param1s[that.data.skuindex1].image;
      cartinfo.sku = that.data.sku[that.data.skuindex];
      cartinfo.num = that.data.quantity;
      cartinfo.title = that.data.product.title;
      cartinfo.productId = that.data.productId;
      wx.setStorage({
        key: 'orderInfo',
        data: [cartinfo],
        success:function(){
          wx.navigateTo({
            url: '/pages/placeorder/palceorder',
          })
          that.setData({
            show: 1
          })
        }
      });
    }
  },

  collection: function() {
    var that = this;
    var collectStorage = wx.getStorageSync('collectInfo');
    var productId = that.data.productId;
    var collectInfo = {};
    collectInfo.productId = that.data.productId;
    collectInfo.title = that.data.product.title;
    collectInfo.price = that.data.product.price;
    collectInfo.image = that.data.product.param1s[0].image;
    if (collectStorage){
      var collect_num = 0;
      for (let list of collectStorage){
        if(list.productId == productId){
          collect_num = 1;
          wx.showToast({
            title: '已收藏过了',
            icon:'none'
          })
        }
      }
      if (collect_num == 0){
        collectStorage.push(collectInfo);
        wx.setStorage({
          key: 'collectInfo',
          data: collectStorage,
          success:function(){
            wx.showToast({
              title: '收藏成功',
            })
          }
        })
      }
    }else{
      wx.setStorage({
        key: 'collectInfo',
        data: [collectInfo],
        success:function(){
          wx.showToast({
            title: '收藏成功',
          })
        }
      })  
    }
  },

  gomarket: function() {
    wx.switchTab({
      url: '/pages/market/market',
    })
  },

  changeparam1: function(e) {
    this.setData({
      skuindex1: e.currentTarget.dataset.index,
      quantity: 1
    });
    this.changesku();
    this.inventoryunm();
  },

  changeparam2: function(e) {
    this.setData({
      skuindex2: e.currentTarget.dataset.index,
      quantity: 1
    });
    this.changesku();
    this.inventoryunm();
  },
  changesku: function() {
    let length = this.data.sku.length;
    for (let i = 0; i < length; i++) {
      if (this.data.sku[i].param1 == this.data.product.param1s[this.data.skuindex1].title) {
        if (this.data.skuindex2 != -1) {
          if (this.data.sku[i].param2 == this.data.product.param2s[this.data.skuindex2].title) {
            this.setData({
              skuindex: i,
              inventory: this.data.sku[i].inventory
            })
            break
          }
        } else {
          this.setData({
            skuindex: i,
            inventory: this.data.sku[i].inventory
          })
        }
      }
    }
  },

  inventoryunm: function() {
    var that = this;
    if (that.data.skuindex2 != -1) {
      for (let j = 0; j < that.data.product.param2s.length; j++) {
        let tip = 0;
        for (let i = 0; i < that.data.sku.length; i++) {
          if (that.data.sku[i].param1 == that.data.product.param1s[that.data.skuindex1].title && that.data.sku[i].param2 == that.data.product.param2s[j].title) {
            tip = 1;
            if (that.data.sku[i].inventory <= 0) {
              that.data.product.param2s[j].disabled = 0;
            } else {
              that.data.product.param2s[j].disabled = 1;
            }
            break;
          }
        }
        if (tip == 0) {
          that.data.product.param2s[j].disabled = 0;
        }
      }
      for (let j = 0; j < that.data.product.param1s.length; j++) {
        let tip = 0;
        for (let i = 0; i < that.data.sku.length; i++) {
          if (that.data.sku[i].param2 == that.data.product.param2s[that.data.skuindex2].title && that.data.sku[i].param1 == that.data.product.param1s[j].title) {
            tip = 1;
            if (that.data.sku[i].inventory <= 0) {
              that.data.product.param1s[j].disabled = 0; //没有库存了

            } else {
              that.data.product.param1s[j].disabled = 1;
            }
            break;
          }
        }
        if (tip == 0) {
          that.data.product.param1s[j].disabled = 0;
        }
      }
    } else {
      for (let i = 0; i < that.data.sku.length; i++) {
        if (that.data.sku[i].inventory <= 0) {
          that.data.product.param1s[j].disabled = 0;
        } else {
          that.data.product.param1s[j].disabled = 1;
        }
      }
    }
    that.setData({
      product: that.data.product
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    for (let i of this.data.productAppraise) {
      i.create_time = utils.formatTime(i.create_time)
    }
    this.setData({
      productId: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.changesku();
    this.inventoryunm();
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