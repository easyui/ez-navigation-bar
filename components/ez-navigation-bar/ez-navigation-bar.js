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
      value: ''
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
      type: Boolean,
      value: false
    },
    home: {
      type: Boolean,
      value: false
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
      let sideDistance = 8 //胶囊按钮左右边距
      if (isSupportMenuButton) {
        Object.assign(this.defaultMenuButtonRect, menuButtonRect)
      }
      // console.log(menuButtonRect)
      wx.getSystemInfo({
        success: (res) => {
          // console.log(res)
          if (isSupportMenuButton) {
            sideDistance = res.screenWidth - menuButtonRect.right
          }
          const { back, home, title, color, background, searchBar } = this.data;

          const ios = !!(res.system.toLowerCase().search('ios') + 1)
          const innerHeight = isSupportMenuButton ? ((menuButtonRect.top - res.statusBarHeight) * 2 + menuButtonRect.height) : 44 //导航条操作区高度

          let navigationBarStyle = [`height: ${res.statusBarHeight + innerHeight}px`, `background: ${background}`]
          let statusBarStyle = []
          statusBarStyle = statusBarStyle.concat([`color: ${color}`, `background: ${background}`, `height: ${res.statusBarHeight}px`])

          //可操作区域
          let innerStyle = []
          innerStyle = innerStyle.concat([`color: ${color}`, `background: ${background}`, `height: ${innerHeight}px`, isSupportMenuButton ? `width:${menuButtonRect.left}px` : ''])

          //可操作左边区域，自定义整个navigation bar建议使用左边区域
          let innerLeftStyle = []
          if ((back && !home) || (!back && home)) {
            innerLeftStyle = innerLeftStyle.concat([
              `width:${this.defaultMenuButtonRect.width}px`,
              `height:${this.defaultMenuButtonRect.height}px`
              // `margin-left:${sideDistance}px`
            ]);
          } else if ((back && home)) {
            innerLeftStyle = innerLeftStyle.concat([
              `width:${this.defaultMenuButtonRect.width}px`,
              `height:${this.defaultMenuButtonRect.height}px`,
              `margin-left:${sideDistance}px`
            ])
          } else {
            innerLeftStyle = innerLeftStyle.concat([`width:auto`, `margin-left:0px`])
          }

          let leftIconColor = theme == "dark" ? "white" : "black"

          let innerCenterStyle = []
          // innerCenterStyle = [`height: ${res.statusBarHeight}px`]
          if (title) {

          }

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
          innerSearchBarStyle = innerSearchBarStyle.join(";")

          this.setData({
            color,
            background,
            navigationBarStyle,
            statusBarStyle,
            innerStyle,
            innerLeftStyle,
            leftIconColor,
            innerCenterStyle,
            innerSearchBarStyle,
            ios
          })
        }
      })

    },

    // 返回事件
    backAction: function () {
      this.triggerEvent('back', { delta: this.data.delta });
    },

    //home事件
    homeAction: function () {
      this.triggerEvent('home', {});
    },

    //搜索事件
    searchAction: function () {
      this.triggerEvent('search', {});
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
