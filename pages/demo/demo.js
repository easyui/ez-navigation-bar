// pages/demo/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"我是title",
    color:"red",
    background:"yellow"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = options.type
    this.setData({type})

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

  },

  backTap() {
    const pages = getCurrentPages();
    // console.log(pages)
    if (pages.length >= 2) {
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.navigateTo({
        url: '/pages/index/index'
      });
    }
  },
  homeTap() {
    wx.navigateTo({
      url: '/pages/index/index'
    });
  },
  searchTap() {
    wx.showToast({
      title: 'search',
    })
  },
  updateNavBar (e) {
    const type = e.currentTarget.dataset.type 
    const color = ['red','yellow','green','blue']
    if (type == 'title') {
      const title = color[Math.floor(Math.random() * color.length)]
      this.setData({
        title
      })
      console.log(title)
    }else if (type == 'titleColor') {
      const temp = color[Math.floor(Math.random() * color.length)]
      this.setData({
        color:temp
      })
      console.log(temp)

    }else if (type == 'gbColor') {
      const temp = color[Math.floor(Math.random() * color.length)]
      this.setData({
        background:temp
      })
      console.log(temp)
    } 
  },

  onPullDownRefresh: function () {

  

    this.timer = setTimeout(() => {
      wx.stopPullDownRefresh() //停止下拉刷新
    },3000)
  },
})