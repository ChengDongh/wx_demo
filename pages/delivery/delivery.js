// pages/delivery/delivery.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    delBtnWidth: 120,
    id: null,
    isBack: 'true'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (JSON.stringify(options) != "{}") {
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
    var addressList = wx.getStorageSync('addresssInfoALL');
    this.setData({
      addressList
    });
    this.initEleWidth();
    if (this.data.id != null) {//记录所修改地址的id，如果是结算页面的id 那就更改结算页面的地址信息
      wx.setStorage({
        key: 'addresssInfo',
        data: addressList[this.data.id],
      })
    }
  },
  //修改地址
  edit: function(e) {
    var id = e.currentTarget.dataset.index;
    var address_one = wx.getStorageSync('addresssInfoALL')[id];
    var address_two = wx.getStorageSync('addresssInfo');
    if (address_one.name == address_two.name && address_one.mobile == address_two.mobile && address_one.province == address_two.province && address_one.area == address_two.area && address_one.city == address_two.city && address_one.location == address_two.location) {//记录所修改地址的id 用来判断是否是结算页面的地址
      this.setData({
        id: id
      })
    }
    wx.navigateTo({
      url: '/pages/address/address?id=' + id + '',
    })
  },
  //选择结算页面的地址
  selectTap: function(e) {
    console.log(this.data.isBack)
    var that = this;
    var index = e.currentTarget.dataset.index;
    var address_choose = wx.getStorageSync('addresssInfoALL')[index];
    if (that.data.isBack == 'true') {
      console.log(11111)
      wx.setStorage({
        key: 'addresssInfo',
        data: address_choose,
        success: function(res) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },
  //删除地址
  delItem: function(e) {
    var addressList = this.data.addressList;
    var index = e.currentTarget.dataset.index;
    var address_two = wx.getStorageSync('addresssInfo');//获取结算页面的地址信息（无法通过后台设置id 就获取地址信息 从而进行进一步的对比 判断）
    var address_one = wx.getStorageSync('addresssInfoALL')[index];
    addressList.splice(index, 1);
    this.setData({
      addressList
    });
    if (address_one.name == address_two.name && address_one.mobile == address_two.mobile && address_one.province == address_two.province && address_one.area == address_two.area && address_one.city == address_two.city && address_one.location == address_two.location) {//判断是否删除的是结算页面的地址
      wx.removeStorage({
        key: 'addresssInfo',
        success: function(res) {
          wx.showToast({
            title: '删除成功',
          })
        },
      })
      wx.setStorage({
        key: 'addresssInfoALL',
        data: addressList,
      })
    } else {
      if (addressList.length <= 0) {
        wx.removeStorage({
          key: 'addresssInfoALL',
          success: function(res) {
            wx.showToast({
              title: '删除成功',
            })
          },
        })
      } else {
        wx.setStorage({
          key: 'addresssInfoALL',
          data: addressList,
          success: function() {
            wx.showToast({
              title: '删除成功',
            })
          }
        })
      }
    }
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
      var addressList = this.data.addressList;
      if (index !== "" && index != null) {
        addressList[index].left = left;
        this.setData({
          addressList: addressList
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
      var addressList = this.data.addressList;
      if (index !== "" && index != null) {
        addressList[index].left = left;
        this.setData({
          addressList: addressList
        });
        // this.setGoodsList(list)
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