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

  onShareAppMessage: function(res) {//分享
    return {
      title: this.data.product.title,
      desc: this.data.product.summary,
      path: '/pages/product/product?id=' + this.data.productId
    }
  },
  //打开企业认证、店铺认证的滑块
  shopcover: function() {
    var showcover = this.data.showcover;
    this.setData({
      showcover: !showcover
    })

  },
  //商品详情和商品评价的切换
  pagechange: function(e) {
    var pagesshow = e.currentTarget.dataset.index;
    this.setData({
      pagesshow
    });
  },
  //点击记录点击的是加入购物车 还是立即购买
  buyProduct: function(e) {
    this.setData({
      show: e.currentTarget.dataset.index,
      cartbtn: e.currentTarget.dataset.btn
    })
  },
  //关闭点击购物车或者立即购买弹出的滑块
  closecart: function(e) {
    this.setData({
      show: e.currentTarget.dataset.index
    })
  },
  //商品数量的减
  minus: function() {
    let num = this.data.quantity;
    num--;
    this.setData({
      quantity: num
    })
  },
  //商品数量的加
  plus: function() {
    let num = this.data.quantity;
    num++;
    this.setData({
      quantity: num
    })
  },
  //点击（购物车或者立即购买之后出现的滑块)中的按钮
  placeorder: function(e) {
    var that = this;
    if (that.data.cartbtn == '加入购物车') {//点击加入购物车的按钮
      let carStorage = wx.getStorageSync('cartinfo');
      let cartinfo = {};
      cartinfo.image = that.data.product.param1s[that.data.skuindex1].image;
      cartinfo.sku = that.data.sku[that.data.skuindex];
      cartinfo.num = that.data.quantity;
      cartinfo.title = that.data.product.title;
      cartinfo.productId = that.data.productId;
      cartinfo.active = true;
      if (carStorage) {//存在购物车的缓存
        let a = 1;
        for (let i of carStorage) {
          if (i.sku.id == cartinfo.sku.id){//判断是否有这个商品
            a = 2;
            i.num = i.num + cartinfo.num;//有这个商品 就数量加一
            break;
          } 
        }
        if (a == 1) {//没有这个商品 就添加进去
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
      } else {//如果不存在购物车的缓存 就新建购物车缓存 并将商品添加进去
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
    }else{//点击下一步按钮
      let cartinfo = {};
      cartinfo.image = that.data.product.param1s[that.data.skuindex1].image;
      cartinfo.sku = that.data.sku[that.data.skuindex];
      cartinfo.num = that.data.quantity;
      cartinfo.title = that.data.product.title;
      cartinfo.productId = that.data.productId;
      wx.setStorage({//记录购买商品的信息 存入缓存中 供结算页面使用
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

  collection: function() {//收藏
    var that = this;
    var collectStorage = wx.getStorageSync('collectInfo');//获取收藏的缓存
    var productId = that.data.productId;
    var collectInfo = {};
    collectInfo.productId = that.data.productId;
    collectInfo.title = that.data.product.title;
    collectInfo.price = that.data.product.price;
    collectInfo.image = that.data.product.param1s[0].image;
    if (collectStorage){//如果有收藏的缓存 
      var collect_num = 0;
      for (let list of collectStorage){
        if(list.productId == productId){//判断该商品时候收藏过 收藏过就提示收藏
          collect_num = 1;
          wx.showToast({
            title: '已收藏过了',
            icon:'none'
          })
        }
      }
      if (collect_num == 0){//没有收藏的话 将其添加到收藏的缓存中去
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
    }else{//如果没有收藏缓存 创建收藏缓存 将其存入缓存中
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
  //点击主页按钮 返回主页
  gomarket: function() {
    wx.switchTab({
      url: '/pages/market/market',
    })
  },

  changeparam1: function(e) {//点击商品颜色来选择尺码
    this.setData({
      skuindex1: e.currentTarget.dataset.index,
      quantity: 1
    });
    this.changesku();//获取库存
    this.inventoryunm();//点击商品颜色来选择尺码的方法
  },

  changeparam2: function(e) {//点击商品尺码来选择颜色
    this.setData({
      skuindex2: e.currentTarget.dataset.index,
      quantity: 1
    });
    this.changesku();//获取库存
    this.inventoryunm();//点击商品颜色来选择尺码的方法
  },
  changesku: function () {//获取库存
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
    if (that.data.skuindex2 != -1) {//首次判断是否有尺码  （有尺码）
      for (let j = 0; j < that.data.product.param2s.length; j++) {
        let tip = 0;
        for (let i = 0; i < that.data.sku.length; i++) {
          if (that.data.sku[i].param1 == that.data.product.param1s[that.data.skuindex1].title && that.data.sku[i].param2 == that.data.product.param2s[j].title) {//通过颜色判断是否有尺码 有tip = 1
            tip = 1;
            if (that.data.sku[i].inventory <= 0) {//判断有尺码之后 判断尺码的库存还有没有
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
          if (that.data.sku[i].param2 == that.data.product.param2s[that.data.skuindex2].title && that.data.sku[i].param1 == that.data.product.param1s[j].title) {//通过尺码判断是否有颜色 有tip = 1
            tip = 1;
            if (that.data.sku[i].inventory <= 0) {//判断有颜色之后 判断颜色的库存还有没有
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
    } else {//没有尺码
      for (let i = 0; i < that.data.sku.length; i++) {
        if (that.data.sku[i].inventory <= 0) {//没有尺码的时候 判断颜色是否有库存
          that.data.product.param1s[i].disabled = 0;
        } else {
          that.data.product.param1s[i].disabled = 1;
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
    for (let i of this.data.productAppraise) {//转换商品评价中的时间戳
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