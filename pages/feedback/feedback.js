// pages/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:[],
    num:0,
  },
  upload:function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths
        // console.log(tempFilePaths)
        wx.uploadFile({
          url: 'https://yiapi.qiqiangkeji.com/upload',
          filePath: tempFilePaths[0],
          name: 'img',
          success: function (res) {
            var data = JSON.parse(res.data);
            if (data.code == 0) {
              var src = that.data.src
              src.push(data.data.url)
              that.setData({
                src: src,
                num: src.length
              })
            }
          },
          fail: function () {

          }
        })
      }
    })
  },
  //点击叉号删除图片
  cancelimg:function(e){
    var src = this.data.src;
    var index = e.currentTarget.dataset.index;
    src.splice(index,1);
    this.setData({
      src,
      num:src.length
    })
  },
  //图片浏览
  previewImage:function(e){
    wx.previewImage({
      current:e.currentTarget.dataset.src,
      urls: this.data.src,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})