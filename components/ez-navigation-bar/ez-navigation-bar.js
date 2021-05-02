// components/ez-navigation-bar/ez-navigation-bar.js
Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    extClass: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: '',
      observer: '_titleChange'
    },
    theme: {
      type: String,
      value: 'light' //取值为light或dark
    },
    background: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: ''
    },
    back: {
      type: String,
      value: "auto" //auto,show,hidden
    },
    home: {
      type: String,
      value: "auto"//auto,show,hidden
    },
    excludeAuto:{
      type: Array,
      value: []
    },
    searchText: {
      type: String,
      value: '点我搜索'
    },
    searchBar: {
      type: Boolean,
      value: false
    },
    // loading: {
    //     type: Boolean,
    //     value: false
    // },
    // animated: {
    //     // 显示隐藏的时候opacity动画效果
    //     type: Boolean,
    //     value: true
    // },
    // show: {
    //     // 显示隐藏导航，隐藏的时候navigation-bar的高度占位还在
    //     type: Boolean,
    //     value: true,
    //     observer: '_showChange'
    // },
    // back为true的时候，返回的页面深度
    delta: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },


  created: function () {
    this.commonInit();
  },

  attached() {
    this.updateStyle()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    commonInit: function () {
      this.defaultMenuButtonRect = {
        bottom: 80,
        height: 32,
        left: 281,
        right: 368,
        top: 48,
        width: 87
      } // 胶囊按钮的默认frame
    },
    updateStyle: function () {
      //主题check
      let theme = this.data.theme
      if (this._isEmptyStr(theme)) {
        theme = "light"
      }
      let colorTemp = this.data.color
      if (this._isEmptyStr(this.data.color)) {
        colorTemp = theme == "dark" ? "#fff" : "#000"
      }
      this.data.color = colorTemp //不需要渲染
      let backgroundTemp = this.data.background
      if (this._isEmptyStr(this.data.background)) {
        backgroundTemp = theme == "dark" ? "#000" : "#fff"
      }
      this.data.background = backgroundTemp //不需要渲染

      const isSupportMenuButton = !!wx.getMenuButtonBoundingClientRect //是否支持胶囊按钮
      const menuButtonRect = wx.getMenuButtonBoundingClientRect
        ? wx.getMenuButtonBoundingClientRect()
        : null //胶囊按钮 frame
      this.sideDistance = 8 //胶囊按钮左右边距
      if (isSupportMenuButton) {
        Object.assign(this.defaultMenuButtonRect, menuButtonRect)
      }
      // console.log(menuButtonRect)
      wx.getSystemInfo({
        success: (res) => {
          // const pages = getCurrentPages(); 
          // console.log(pages)
          // console.log(wx.getEnterOptionsSync().scene)
          // wx.showToast({
          //   // title: ''+pages[pages.length - 1].__displayReporter.pageType,
          //   title:""+wx.getEnterOptionsSync().scene
          // })
          // console.log(res)
          this.systemInfo = res
          if (isSupportMenuButton) {
            this.sideDistance = res.screenWidth - menuButtonRect.right
          }
          const { back, home, excludeAuto ,title, color, background, searchBar } = this.data;

          const ios = !!(res.system.toLowerCase().search('ios') + 1)
          const innerHeight = isSupportMenuButton ? ((menuButtonRect.top - res.statusBarHeight) * 2 + menuButtonRect.height) : 44 //导航条操作区高度
          // console.log(innerHeight + res.statusBarHeight)
          let navigationBarStyle = [`height: ${res.statusBarHeight + innerHeight}px`, `background: ${background}`]
          let statusBarStyle = []
          statusBarStyle = statusBarStyle.concat([`color: ${color}`, `background: ${background}`, `height: ${res.statusBarHeight}px`])

          //可操作区域
          let innerStyle = []
          innerStyle = innerStyle.concat([`color: ${color}`, `background: ${background}`, `height: ${innerHeight}px`, isSupportMenuButton ? `width:${menuButtonRect.left}px` : ''])

          //可操作左边区域，自定义整个navigation bar建议使用左边区域
          let showBackButton = false
          let showHomeButton = false
          if(back == "show"){
            showBackButton = true
          }else if(back == "auto"){
            const pages = getCurrentPages(); 
            if(pages.length > 1){
              showBackButton = true
            }

          }

          if(home == "show"){
            showHomeButton = true
          }else if(home == "auto"){
            const pages = getCurrentPages(); 
            console.log(excludeAuto)
            console.log(pages[0].route)

            if(pages.length == 1 && excludeAuto.indexOf(pages[0].route) == -1){
              showHomeButton = true
            }
          }

          let innerLeftStyle = []
          if ((showBackButton && !showHomeButton) || (!showBackButton && showHomeButton)) {
            innerLeftStyle = innerLeftStyle.concat([
              `width:${this.defaultMenuButtonRect.width}px`,
              `height:${this.defaultMenuButtonRect.height}px`
              // `margin-left:${this.sideDistance}px`
            ]);
          } else if ((showBackButton && showHomeButton)) {
            innerLeftStyle = innerLeftStyle.concat([
              `width:${this.defaultMenuButtonRect.width}px`,
              `height:${this.defaultMenuButtonRect.height}px`,
              `margin-left:${this.sideDistance}px`
            ])
          } else if(title){
            // innerLeftStyle = innerLeftStyle.concat([
            //   `width:${this.defaultMenuButtonRect.width}px`,
            //   `height:${this.defaultMenuButtonRect.height}px`,
            //   `margin-left:${this.sideDistance}px`
            // ])
          }else {
            innerLeftStyle = innerLeftStyle.concat([`width:auto`, `margin-left:0px`])
          }

          let leftIconColor = theme == "dark" ? "white" : "black"

          let innerCenterStyle = []
          // innerCenterStyle = [`height: ${res.statusBarHeight}px`]
          if (!this._isEmptyStr(title)) {
            innerCenterStyle = innerCenterStyle.concat([
              `width:${ res.screenWidth - 2 * (this.defaultMenuButtonRect.width + this.sideDistance)}px`,
              `left:${this.defaultMenuButtonRect.width + this.sideDistance}px`,
              `position:fixed`
            ])
          }

          let innerRightStyle = []
          innerRightStyle = innerRightStyle.concat([
            `right:${this.defaultMenuButtonRect.width + this.sideDistance}px`,
          ])
          let innerSearchBarStyle = []
          // innerCenterStyle = [`height: ${res.statusBarHeight}px`]
          if (searchBar) {
            innerSearchBarStyle = innerSearchBarStyle.concat([`height:${this.defaultMenuButtonRect.height}px`])
          }


          navigationBarStyle = navigationBarStyle.join(";")
          statusBarStyle = statusBarStyle.join(";")
          innerStyle = innerStyle.join(";")
          innerLeftStyle = innerLeftStyle.join(";")
          innerCenterStyle = innerCenterStyle.join(";")
          innerRightStyle = innerRightStyle.join(";")
          innerSearchBarStyle = innerSearchBarStyle.join(";")

          this.setData({
            showBackButton,
            showHomeButton,
            color,
            background,
            navigationBarStyle,
            statusBarStyle,
            innerStyle,
            innerLeftStyle,
            leftIconColor,
            innerCenterStyle,
            innerRightStyle,
            innerSearchBarStyle,
            ios
          })
        }
      })

    },

    // 返回事件
    backAction: function () {
      if(this.data.back == "auto"){
        const pages = getCurrentPages();
        if (pages.length >= 2) {
          wx.navigateBack({
            delta: 1
          });
        } else {
          // wx.reLaunch({
          //   url: '/pages/index/index'
          // });
          // wx.getUpdateManager().applyUpdate()
          wx.switchTab({
            url:'/pages/index/index'
          })
        }
      }
      this.triggerEvent('back', { delta: this.data.delta });
    },

    //home事件
    homeAction: function () {
      if(this.data.home == "auto"){
        // wx.reLaunch({
        //   url: '/pages/index/index'
        // });
        // wx.getUpdateManager().applyUpdate()
        wx.switchTab({
          url:'/pages/index/index'
        })
      }
      this.triggerEvent('home', {});
    },

    //搜索事件
    searchAction: function () {
      this.triggerEvent('search', {});
    },

    _titleChange: function (newVal, oldVal) {
      // 属性值变化时执行
      if(!this.systemInfo){//第一次还没走
        return
      }
      if(this._isEmptyStr(newVal) == this._isEmptyStr(oldVal)){
        return
      }
      let innerCenterStyle = []
      if (!this._isEmptyStr(newVal)) {
        innerCenterStyle = innerCenterStyle.concat([
          `width:${ this.systemInfo.screenWidth - 2 * (this.defaultMenuButtonRect.width + this.sideDistance)}px`,
          `left:${this.defaultMenuButtonRect.width + this.sideDistance}px`,
          `position:fixed`
        ])
      }
      innerCenterStyle = innerCenterStyle.join(";")
      this.setData({
        innerCenterStyle,
      })
    },
    //字符串空判断
    _isEmptyStr: function (obj) {
      if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
      } else {
        return false;
      }
    }
  }

})
