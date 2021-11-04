let global = require('../../js/global.js');
let imageUtil = require('../../js/util.js');
const config = require('../../modules/config')
//index.js
//获取应用实例
const app = getApp()
var mtabW;
let touchDotX = 0; //X按下时坐标
let touchDotY = 0; //y按下时坐标
let interval; //计时器
let time = 0; //从按下到松开共多少时间*100
let current = 0;
let canOnePointMove = false;
var onePoint = {
    x: 0,
    y: 0
}
var twoPoint = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
}
Page({
    path: 'pages/index/index',
    data: {
        isrefresh: false,
        groupBanner: "../../img/userBanner.jpg",
        listId: '',
        isShowPhoto: true,
        show: false,
        actions: [{
            name: '上传图片',
        },
            {
                name: '文章',
            },
            {
                name: '上传视频',
            }
        ],
        videoindex: null,
        tvphide: false,
        vid: 'e0354z3cqjp',
        changingvid: '',
        controls: !!config.get('controls'),
        autoplay: !!config.get('autoplay'),
        playState: '',
        showProgress1: true,
        width: "100%",
        height: "auto",
        thisWidth: 0,
        images: {},
        imagewidth: 0, //缩放后的宽
        imageheight: 0, //缩放后的高
        animation: '',
        thisCurrent: 0,
        classify1: [],
        search: {
            searchValue: '',
            showClearBtn: false
        },
        searchResult: [],
        scrollHeight: '',
        scrollLeft: '',
        pageNum: 0,
        pageNum1: 0,
        pageSize: 10,
        hasMoreData: true,
        focus: false,
        followThis: true,
        windowH: '',
        status: 0,
        currentTab: 0,
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        activeIndex: 0,
        slideOffset: 0,
        tabW: 0,
        current1: 0,
        currentLeft: true,
        current2: 0,
        current: 0,
        width1: 88,
        height1: 88,
        left: 375,
        top: 600,
        scale: 1,
        rotate: 0,
        scrollTop: 0,
        isLoading: false,
        isLoading1: false,
        isNoMore: false,
        isNoMore2: false,
        isNoMore1: false,
        swiperError: 0,
        _index: null,
        activeIndex1: '',
        isNewContent: '',
    },
    onPreload(option) {
        this.onReady();
    },

    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    //判断是否在全屏状态
    videoFull: function(e) {
        if (e.detail.fullScreen) {
            this.setData({
                isFull: true
            })
        } else {
            this.setData({
                isFull: false
            })
        }
    },
    //视频播放完毕
    videoEnd: function() {
        var video = wx.createVideoContext('myVideo' + this.data.videoindex);
        if (this.data.isFull) { //处于全屏则退出
            video.exitFullScreen()
        }
        this.setData({
            videoindex: ''
        })
    },

    videoPlay: function(e) {
        let that = this;
        let item = e.currentTarget.dataset.item;
        let index1 = that.data._index;
        let activeIndex = that.data.activeIndex;
        let activeIndex1 = activeIndex
        console.log(index1)
        if (index1 != null) {
            console.log("1")
            let list1 = that.data.classify1[activeIndex].hotList;
            var isPlaying2 = "classify1[" + activeIndex + "].hotList[" + index1 + "].isPlaying";
            list1[index1].isPlaying = false;
            that.setData({
                [isPlaying2]: list1[index1].isPlaying,
                activeIndex1: activeIndex1
            });
        }
        let index = e.currentTarget.dataset.id;
        let list = that.data.classify1[activeIndex].hotList;
        var isPlaying1 = "classify1[" + activeIndex + "].hotList[" + index + "].isPlaying";
        var isPlaying = list[index].isPlaying;
        setTimeout(function() {
            if (isPlaying) {
                list[index].isPlaying = false;
                console.log(index)
                that.setData({
                    [isPlaying1]: list[index].isPlaying,
                    _index: index,
                    activeIndex1: activeIndex1
                });
            } else {
                list[index].isPlaying = true;
                that.setData({
                    [isPlaying1]: list[index].isPlaying,
                    _index: index,
                    activeIndex1: activeIndex1
                });
            }

        }, 500)
    },
    onShareAppMessage: function(ops) {
        let page = this;
        console.log(ops)
        if (ops.from === 'button') {
            // 来自页面内转发按钮
            console.log(ops.target)
        }
        return {
            path: 'pages/index/index',
            success: function(res) {
                // 转发成功
                console.log("转发成功:" + JSON.stringify(res));
            },
            fail: function(res) {
                // 转发失败
                console.log("转发失败:" + JSON.stringify(res));
            }
        }
    },
    mytouchstart: function(e) {
        touchDotX = e.touches[0].pageX; // 获取触摸时的原点
        touchDotY = e.touches[0].pageY;
        let interval; //计时器
        var time = 0
        // 使用js计时器记录时间
        interval = setInterval(function() {
            time++;
        }, 100);
    },
    mytouchmove: function(e) {
        let that = this;
        let touchMoveX = e.changedTouches[0].pageX;
        let touchMoveY = e.changedTouches[0].pageY;
        let tmX = touchMoveX - touchDotX;
        let tmY = touchMoveY - touchDotY;
        let tmy1 = touchDotY - touchMoveY
        let scrollTop = that.data.scrollTop;
        if (time < 20 && scrollTop == 0) {
            let absX = Math.abs(tmX);
            let absY = Math.abs(tmY);
            if (absY > absX * 2 && tmY > 0) {
                that.setData({
                    isShowPhoto: true,
                })
                var activeIndex = that.data.activeIndex;
                var loadingType = 1;
                // if (activeIndex == 0) {
                //   that.getAllFeeds(loadingType);
                // } else if (activeIndex == that.data.classify1.length - 1) {
                //   if (isSearchResult){
                //     that.findGroup()
                //   }else{
                //     that.recommendGroup()
                //   }
                // } else {
                //   that.getGroupFeeds(loadingType);
                // }
            }
        }
    },
    touchEnd: function(e) {
        let that = this;
        let touchMoveX = e.changedTouches[0].pageX;
        let touchMoveY = e.changedTouches[0].pageY;
        let tmX = touchMoveX - touchDotX;
        let tmY = touchMoveY - touchDotY;
        let tmy1 = touchDotY - touchMoveY
        if (time < 20) {
            let absX = Math.abs(tmX);
            let absY = Math.abs(tmY);
            if (absY > absX * 2 && tmY < 0) {
                that.setData({
                    isShowPhoto: false,
                })
            } else if (absY > absX * 2 && tmY > 0) {
                that.setData({
                    isShowPhoto: true,
                })
            }
        }
        clearInterval(interval); // 清除setInterval
        time = 0;
    },

    rotate: function() {
        this.animation.rotate(Math.random() * 720 - 360).step()
        this.setData({
            animation: this.animation.export()
        })
    },
    go2createGroup: function() {
        app.nav2({
            url: '../createGroupList/createGroupList'
        });
    },
    go2myDynamic: function(e) {
        let that = this;
        let userid = e.currentTarget.dataset.id
        app.nav2({
            url: '../myDynamic/myDynamic?userid=' + userid
        });
    },
    ellipsis: function(e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let hotList = that.data.classify[0].hotList;
        let data = hotList[index];
        data.ellipsis = !data.ellipsis;
        that.setData({
            hotList: hotList
        })
    },
    praiseThis: function(e) {
        let that = this;
        let activeIndex = that.data.activeIndex
        let feedId = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.curindex;
        console.log(e)
        let list = that.data.classify1[activeIndex].hotList
        console.log(list)
        let zanNum1 = "classify1[" + activeIndex + "].hotList[" + index + "].zanNum";
        let isZan1 = "classify1[" + activeIndex + "].hotList[" + index + "].isZan";
        if (list[index]) {
            let isZan = list[index].isZan;
            console.log(isZan)
            if (isZan !== undefined) {
                let onum = list[index].zanNum;
                if (isZan) {
                    list[index].zanNum = (onum - 1);
                    list[index].isZan = false;
                    console.log(list[index].zanNum)
                    that.setData({
                        [zanNum1]: list[index].zanNum,
                        [isZan1]: list[index].isZan,
                    });
                    app.post({
                        url: global.api.deleteZan,
                        data: {
                            feedId: feedId
                        },
                        method: "POST",
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function(res) {
                            let res1 = res.data;
                            let user = res1.data;
                            if (res1.code == 200) {

                                wx.showToast({
                                    title: '取消点赞',
                                    icon: 'succes',
                                    duration: 1000,
                                    mask: true
                                })
                            }
                        }
                    })

                } else {
                    list[index].zanNum = (onum + 1);
                    list[index].isZan = true;
                    that.setData({
                        [zanNum1]: list[index].zanNum,
                        [isZan1]: list[index].isZan,
                    });
                    app.post({
                        url: global.api.zanFeed,
                        data: {
                            feedId: feedId
                        },
                        method: "POST",
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function(res) {
                            let res1 = res.data;
                            let user = res1.data;
                            if (res1.code == 200) {

                                wx.showToast({
                                    title: '点赞+1',
                                    icon: 'succes',
                                    duration: 1000,
                                    mask: true
                                })
                            }
                        }
                    })
                }
                console.log(that.data.classify1[0].hotList[index])
            }
        }
    },
    checkType: function() {
        this.setData({
            show: true
        })
    },
    focusClose: function() {
        var that = this;
        var focus = that.data.focus;
        if (focus == true) {
            this.setData({
                focus: false
            })
        }
    },
    comment: function() {
        this.setData({
            focus: true,
        })
    },
    go2userHome: function(e) {
        console.log(e)
        let type = e.currentTarget.dataset.type;
        let feedId = e.currentTarget.dataset.feedid;
        let comment = e.currentTarget.dataset.comment
        console.log(feedId)
        if (type == 2) {
            app.nav2({
                url: '../imageTextPage/imageTextPage?feedId=' + feedId + "&comment=" + comment
            });
        } else if (type == 3) {
            app.nav2({
                url: '../videoInnerPage/videoInnerPage?feedId=' + feedId + "&comment=" + comment
            });
        } else if (type == 1) {
            app.nav2({
                url: '../nineContentPage/nineContentPage?feedId=' + feedId + "&comment=" + comment
            });
        } else {
            app.nav2({
                url: '../nineContentPage/nineContentPage?feedId=' + feedId + "&comment=" + comment
            });
        }
    },

    go2editGroupList: function(e) {
        console.log(e)
        let groupid = e.currentTarget.dataset.id;
        let groupName = e.currentTarget.dataset.groupname;
        let title = e.currentTarget.dataset.title;
        console.log(groupName, title)
        app.nav2({
            url: '../editGroupInfo/editGroupInfo?groupid=' + groupid + "&groupName=" + groupName + "&title=" + title,
        });
    },
    go2main: function() {
        app.nav2({
            url: '../index/my/my'
            // url: '../main/main'
        });
    },
    go2groupHome: function(e) {
        var groupid = e.currentTarget.dataset.id
        app.nav2({
            url: '../groupHome/groupHome?groupid=' + groupid
        });
    },
    go2groupManagement: function(e) {
        var groupid = e.currentTarget.dataset.groupid
        var groupUserType = e.currentTarget.dataset.groupusertype;
        app.nav2({
            url: '../groupManagement/groupManagement?groupid=' + groupid + "&groupUserType=" + groupUserType
        });
    },

    getquweyWith: function() {
        var that = this;
        var query = wx.createSelectorQuery();
        //选择id
        query.select('.item_on').boundingClientRect()
        query.exec(function(res) {
            //res就是 所有标签为mjltest的元素的信息 的数组
            var thisWidth = res[0].width;
            console.log(thisWidth)
            that.setData({
                thisWidth: thisWidth
            });
            console.log(thisWidth)
        });
    },
    onReady: function() {
        const vm = this;
        vm.animation = wx.createAnimation();
        vm.setData({
            statusBarHeight: getApp().globalData.statusBarHeight,
            titleBarHeight: getApp().globalData.titleBarHeight
        })
    },
    imgYu: function(event) {
        let that = this;
        let gettype = Object.prototype.toString
        let src = event.currentTarget.dataset.src; //获取data-src
        let imgList = event.currentTarget.dataset.list; //获取data-list
        let imgList1 = [];
        for (let i = 0; i < imgList.length; i++) {
            let url = imgList[i].url;
            imgList1.push(url);
        }
        //图片预览

        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: imgList1 // 需要预览的图片http链接列表
        })
    },
    getStatus: function(e) {
        console.log(e)
        this.setData({
            status: e.currentTarget.dataset.index
        })
    },
    onLoad: function() {
        var page = this;
        var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOlsiMTUiLCJvS2RjUTVXUlZBU0ZjRi1GajhlaGRNVU1rSHhJIl0sImF2YXRhclVybCI6Imh0dHBzOi8vd3gucWxvZ28uY24vbW1vcGVuL3ZpXzMyL1EwajRUd0dUZlRKUWZCUmxyRG1hajFVYlE0WTVGbGJNMWljQTdoQ2ljajJZYlhEQnZiY3BrUVJvdGw2U0JRS0IwbEpEVFE2SnYwZE5PcHhmT1JrWkU2NFEvMTMyIiwibmlja05hbWUiOiJEdW1ibmVzcyIsIm9JZCI6Im9LZGNRNVdSVkFTRmNGLUZqOGVoZE1VTWtIeEkiLCJleHAiOjE1NTUwNTE4ODZ9.k0_KnP7tdLEkI7ZjIe7vsRzitJuGgkZYYbVcUrxliZk';
        var openId = 'oKdcQ5WRVASFcF-Fj8ehdMUMkHxI';
        wx.setStorageSync('token', token);
        wx.setStorageSync('openId', openId);
        wx.setStorageSync('loggedIn', true);

        wx.getSystemInfo({
            success: function(res) {
                var windowHeight = res.windowHeight;
                var statusBarHeight = getApp().globalData.statusBarHeight;
                var titleBarHeight = getApp().globalData.titleBarHeight;
                var s = statusBarHeight + titleBarHeight + 50;
                var scrollHeight = windowHeight - statusBarHeight - titleBarHeight;
                mtabW = (res.windowWidth) / 4;
                page.setData({
                    windowH: res.windowHeight,
                    scrollHeight: scrollHeight,
                    tabW: mtabW,
                })
            }
        })
        page.getMyInfo()
        app.post({
            url: global.api.getMyJoinGroups,
            data: {

            },
            success: function(res) {
                var res1 = res.data;
                var user = res1.data;
                if (res1.code == 200) {
                    console.log(user)
                    if (user.length>1){
                        page.setData({
                            classify1: user[0]
                        })
                    }
                    console.log("classify1:"+page.data.classify1)
                } else {

                }
            }
        })
        app.post({
            url: global.api.getAllFeeds,
            data: {},
            success: function(res) {
                var res1 = res.data;
                var user = res1.data;
                var items = "classify1[0].hotList";
                if (res1.code == 200) {
                    console.log(user)
                    page.setData({
                        ['classify1[0].hotList']: user,
                    })
                    for (let i = 0; i < user.length; i++) {
                        var sections1 = "classify1[0].hotList[" + i + "].sections"
                        var sections = user[i].sections;
                        if (sections) {
                            var sections = JSON.parse(sections);
                            page.setData({
                                [sections1]: sections,
                            })
                        }
                    }
                    var query = wx.createSelectorQuery();
                    //选择id
                    query.select('.item-name-border').boundingClientRect(function(rect) {
                        page.setData({
                            height: rect.width + 'px'
                        })
                    }).exec();
                } else {

                }
            }
        });
    },
    imageLoad: function(e) {
        var $width = e.detail.width, //获取图片真实宽度
            $height = e.detail.height,
            ratio = $width / $height; //图片的真实宽高比例
        var viewWidth = 718 * 0.8, //设置图片显示宽度，左右留有16rpx边距
            viewHeight = 718 * 0.8 / ratio; //计算的高度值
        var image = this.data.images;
        //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
        image[e.target.dataset.index] = {
            width: viewWidth,
            height: viewHeight
        }
        this.setData({
            images: image
        })
        // var imageSize = imageUtil.imageUtil(e)
        // this.setData({
        //   imagewidth: imageSize.imageWidth,
        //   imageheight: imageSize.imageHeight
        // })
    },
    getMyInfo: function() {
        let page = this;
        app.post({
            url: global.api.getMyInfo,
            data: {},
            success: function(res) {
                var res1 = res.data;
                var videoInnerList = res1.data;
                console.log(res1)
                if (res1.code == 200) {
                    page.setData({
                        userInfo: videoInnerList,

                    })
                } else {

                }
            }
        });
    },
    deletFeed: function(e) {
        let that = this;
        let feedId = e.currentTarget.dataset.feedid;
        let activeIndex = that.data.activeIndex;
        wx.showModal({
            title: '尚群',
            content: '您确定要删除吗？',
            success: function(res) {
                if (res.confirm) {
                    app.post({
                        url: global.api.deleteFeed,
                        data: {
                            feedId: feedId,
                        },
                        success: function(res) {
                            var res1 = res.data;
                            var user = res1;
                            if (res1.code === 200) {
                                wx.showToast({
                                    title: '删除成功'
                                });
                                if (activeIndex == 0) {
                                    that.getAllFeeds()
                                } else {
                                    that.getGroupFeeds()
                                }
                            } else {}
                        },
                        fail: app.err
                    })
                } else if (res.cancel) {}
            }
        })
    },
    tabClick: function(e) {
        console.log(e)
        var that = this;
        let index1 = that.data._index;
        var activeIndex = that.data.activeIndex1;
        console.log(activeIndex)
        if (index1 != null) {
            if (index1 == that.data.classify1.length - 1) {
                that.setData({
                    index1: null
                });
            } else {
                console.log("1")
                let list1 = that.data.classify1[activeIndex].hotList;
                var isPlaying2 = "classify1[" + activeIndex + "].hotList[" + index1 + "].isPlaying";
                list1[index1].isPlaying = false;
                that.setData({
                    [isPlaying2]: list1[index1].isPlaying,
                    index1: null
                });
            }

        }

        var idIndex = e.currentTarget.id;
        var id = e.currentTarget.dataset.listid;
        if (id !== undefined) {
            this.setData({
                listId: id
            });
        }
        var offsetW = e.currentTarget.offsetLeft; //2种方法获取距离文档左边有多少距离
        this.animation.translateX(offsetW).step()
        this.setData({
            activeIndex: idIndex,
            slideOffset: offsetW,
            currentTab: e.target.dataset.current,
            animation: this.animation.export(),
            thisCurrent: e.target.dataset.current
        });
        var query = wx.createSelectorQuery();
        //选择id
        query.select('.item_on').boundingClientRect(function(rect) {
            console.log(rect.width)
            that.setData({
                height: rect.width + 'px'
            })
        }).exec();

    },
    swiperTab: function(e) {
        var that = this;
        that.setData({
            isLoading: false,
            isLoading1: false
        })
        let index1 = that.data._index;
        var activeIndex = that.data.activeIndex1;
        console.log(activeIndex)
        if (index1 != null) {
            if (index1 == that.data.classify1.length - 1) {
                that.setData({
                    index1: null
                });
            } else {
                console.log(that.data.classify1[activeIndex].hotList)
                let list1 = that.data.classify1[activeIndex].hotList;
                var isPlaying2 = "classify1[" + activeIndex + "].hotList[" + index1 + "].isPlaying";
                list1[index1].isPlaying = false;
                that.setData({
                    [isPlaying2]: list1[index1].isPlaying,
                    index1: null
                });
            }
        }
        var current = e.detail.current;
        console.log(that.data.classify1)
        var length = that.data.classify1.length;
        var current = e.detail.current;
        var current1 = that.data.current1;
        var currentLeft;
        var current2 = current1;
        if (current > current1) {
            currentLeft = true
            that.setData({
                currentLeft: currentLeft,
                current1: current,
                current2: current2,
            });

        }
        if (current <= current1) {
            currentLeft = true
            that.setData({
                currentLeft: currentLeft,
                current1: current,
                current2: current2,
            });

        }
        var offsetW = current * mtabW;
        var left = offsetW - mtabW;
        let currentTab1 = e.detail.current;
        if (that.data.currentTab > 2 || currentTab1 > 2) {
            that.setData({
                activeIndex: current,
                slideOffset: offsetW,
                thisCurrent: current,
                scrollLeft: left,
            });
        } else {
            that.setData({
                activeIndex: current,
                slideOffset: offsetW,
                scrollLeft: 0,
                thisCurrent: current,
                scrollLeft: 0,
            });
        }
        let ishostList = that.data.classify1[current].hotList;
        console.log(ishostList)
        setTimeout(() => {
            if (current !== 0 && current < length - 1) {
                var id = that.data.classify1[current].id;
                console.log(current)
                that.setData({
                    listId: id,
                });
                var loadingType = 1;
                that.getGroupInfo(current)
                that.getGroupFeeds(loadingType)
            }
            if (current == 0) {
                var loadingType = 1;
                that.getAllFeeds(loadingType)
            } else if (current == length - 1) {
                that.recommendGroup()
            } else {

            }
        }, 400);
    },
    searchSubmit: function() {
        var that = this;
        that.setData({
            searchResult: [],
            hasMoreData: true,
        })
        that.doSearch();
    },
    //搜索提交
    doSearch: function() {
        let that = this;
        let val = that.data.search.searchValue;
        if (val) {
            that.setData({
                isSearchResult: true,
                pageNum1: 0
            })
            wx.showToast({
                title: '搜索中',
                icon: 'loading'
            });
            that.findGroup(val);
        } else {
            that.setData({
                isSearchResult: false
            })
            that.recommendGroup();
        }
    },
    findGroup: function(val) {
        let that = this;
        let pageNum = this.data.pageNum1;
        let everySize = 20;
        app.post({
            url: global.api.findGroup,
            data: {
                groupName: val,
                page: pageNum,
                everySize: everySize
            },
            success: function(res) {
                let contentlistTem = that.data.searchResult;
                let res1 = res.data;
                let user = res1.data
                if (res1.code == 200) {
                    that.setData({
                        searchResult: contentlistTem.concat(user),
                    })
                    console.log(that.data.searchResult)
                } else {}
            },
            fail: function() {
                // fail
                wx.showToast({
                    title: '加载数据失败',
                    icon: none
                })
            },
            complete: function() {
                // complete
                wx.hideToast();
            }
        })
    },
    searchActiveChangeinput: function(e) {
        const val = e.detail.value;
        console.log(val);
        this.setData({
            'search.showClearBtn': val != '' ? true : false,
            'search.searchValue': val
        })
    },
    //点击清除搜索内容
    searchActiveChangeclear: function(e) {
        this.setData({
            'search.showClearBtn': false,
            'search.searchValue': ''
        })
    },
    //点击聚集时
    focusSearch: function() {
        console.log("--------------" + this.data.search.searchValue);
        if (this.data.search.searchValue != '') {
            this.setData({
                'search.showClearBtn': true
            })
        }
        console.log("--------------" + this.data.search.showClearBtn);
    },
    bindDownLoad: function() {
        var that = this;
    },


    onPullDownRefresh: function() {
        console.log("下拉")
    },
    onReachBottom: function() {
        console.log("上拉");
    },
    onClose() {
        this.setData({
            show: false,
            isShowPhoto: true
        });
    },

    onSelect(event) {
        let page = this;
        let listId = page.data.listId;
        console.log(listId)
        if (event.detail.name == "文章") {
            app.nav2({
                url: '../uploadingPicturesAndTexts/uploadingPicturesAndTexts?listId=' + listId
            });
            page.setData({
                show: false,
                isShowPhoto: true,
            });
        } else if (event.detail.name == "上传图片") {
            app.nav2({
                url: '../dynamicUpload/dynamicUpload?listId=' + listId
            });
            page.setData({
                show: false,
                isShowPhoto: true,
            });
        } else if (event.detail.name == "上传视频") {
            app.nav2({
                url: '../videoUploading/videoUploading?listId=' + listId
            });
            page.setData({
                show: false,
                isShowPhoto: true,
            });
        }
    },
    vanActionSheet: function() {
        this.setData({
            show: true,
            isShowPhoto: false,
        });
    },
    vanActionSheet1: function() {
        wx.showModal({
            title: '尚群',
            content: '您还没有发布权限，向群主申请吧',
            showCancel: false,
            confirmText: '确定',
            success: function(res) {
                // 用户没有授权成功，不需要改变 isHide 的值
                if (res.confirm) {}
            }
        });
    },

    onStateChange: function(e) {
        this.setData({
            playState: e.detail.newstate
        })
    },
    onTimeUpdate: function(e) {},
    changeVertVid: function() {
        this.setData({
            vid: 'h0026v0vvl6'
        })
    },
    changeVid: function(e) {
        this.setData({
            vid: e.detail.value
        });
    },
    showProgress() {
        this.setData({
            showProgress1: true
        })
    },
    hideProgress() {
        this.setData({
            showProgress1: false
        })
    },
    onFullScreenChange: function() {
        console.log('onFullScreenChange!!!')
    },

    _randomColor: function() {
        return `rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${(Math.random() * 0.3 + 0.2).toFixed(1)})`;
    },

    _generateColors: function(length) {
        return new Array(length).fill(null).map(() => this._randomColor());
    },

    //下拉刷新监听函数
    _onPullDownRefresh: function() {
        setTimeout(() => {
            const colors = this._generateColors(20);
            this.setData({
                colors,
                refreshing: false,
            });
        }, 2000);
    },

    //加载更多监听函数
    onLoadmore: function() {
        var that = this;
        var activeIndex = that.data.activeIndex
        that.setData({
            isrefresh: true
        })
        if (activeIndex == 0) {
            var loadingType = 2;
            that.getAllFeeds(loadingType);
        } else if (activeIndex == that.data.classify1.length - 1) {
            var isSearchResult = that.data.isSearchResult;
            if (isSearchResult) {
                console.log("1111")
                let pageNum1 = this.data.pageNum1;
                let val = that.data.search.searchValue;
                that.setData({
                    pageNum1: pageNum1 + 1
                })
                that.findGroup(val);
            } else {
                console.log("1111")
                let pageNum = this.data.pageNum;
                that.setData({
                    pageNum: pageNum + 1
                })
                that.recommendGroup()
            }
        } else {
            var loadingType = 2;
            that.getGroupFeeds(loadingType);
        }
    },

    _onScroll: function(e) {
        var that = this;
        if (e.detail.scrollTop <= 0) {
            // 滚动到最顶部
            e.detail.scrollTop = 0;
            that.setData({
                isShowPhoto: true,
                scrollTop: e.detail.scrollTop
            })
            return;
        }
    },
    _onScroll1: function(e) {
        var that = this;
        if (e.detail.scrollTop <= 0) {
            // 滚动到最顶部
            e.detail.scrollTop = 0;
            that.setData({
                isShowPhoto: true,
                scrollTop: e.detail.scrollTop
            })
            return;
        }
    },
    showThisList: function(e) {
        console.log(index)
        if (this.data.flag !== index) {
            var flag = index
            this.setData({
                list: list,
                flag: flag,
                flag1: 'none'
            })
        } else if (this.data.flag == index) {
            let flag = index
            this.setData({
                list: list,
                flag: 'none'
            })
        }
    },
    onShow: function() {
        let that = this;
        let index = that.data.activeIndex;
        console.log(that.data.classify1)
        if (index == 0 && that.data.classify1.length != 0) {
            let loadingType = 1;
            that.getAllFeeds(loadingType)
        } else if (index == that.data.classify1.length - 1) {
            that.getAllFeeds();
            that.recommendGroup()
        } else if (index > 0 && index < that.data.classify1.length - 1) {
            that.getMyJoinGroups();
            that.getGroupInfo();
            that.getGroupFeeds();
            that.getAllFeeds();
            that.recommendGroup()
        }
    },
    getMyJoinGroups: function() {
        let page = this;
        app.post({
            url: global.api.getMyJoinGroups,
            data: {},
            success: function(res) {
                var res1 = res.data;
                var user = res1.data;
                console.log(res1)
                if (res1.code == 200) {
                    page.setData({
                        classify1: user
                    })
                } else {

                }
            }
        });
    },
    getGroupInfo: function(current) {
        let page = this;
        let groupId = page.data.listId;
        let index = page.data.activeIndex;
        console.log(index)
        app.post({
            url: global.api.getGroupInfo,
            data: {
                groupId: groupId
            },
            success: function(res) {
                var res1 = res.data;
                var user = res1.data;
                console.log(res1)
                if (res1.code == 200) {
                    var groupList = "classify1[" + index + "].groupList"
                    page.setData({
                        [groupList]: user,
                        groupListInfo: user
                    })
                } else {

                }
            }
        });
    },

    getAllFeeds: function(loadingType) {
        let page = this;
        var hotListLength = page.data.classify1[0].hotList;
        if (hotListLength) {
            var length = page.data.classify1[0].hotList.length;
            if (page.data.classify1[0].hotList.length !== 0) {
                var length = page.data.classify1[0].hotList.length;
                var startFeedId = page.data.classify1[0].hotList[length - 1].feedId;
                var endFeedId = page.data.classify1[0].hotList[0].feedId;
                if (loadingType == 1) {
                    app.post({
                        url: global.api.getAllFeeds,
                        data: {
                            endFeedId: endFeedId,
                        },
                        success: function(res) {
                            var res1 = res.data;
                            var user = res1.data;
                            var items = "classify1[0].hotList";
                            if (res1.code == 200) {
                                console.log(user)
                                page.setData({
                                    ['classify1[0].hotList']: user.concat(page.data.classify1[0].hotList),
                                })
                                for (let i = 0; i < user.length; i++) {
                                    var sections1 = "classify1[0].hotList[" + i + "].sections"
                                    var sections = user[i].sections;
                                    if (sections) {
                                        var sections = JSON.parse(sections);
                                        page.setData({
                                            [sections1]: sections,
                                        })
                                    }
                                }
                                if (user.length != 0) {
                                    page.setData({
                                        isNewContent: user.length,
                                        isLoading1: true
                                    })
                                    setTimeout(() => {
                                        page.setData({
                                            isLoading1: false
                                        })
                                    }, 2000);
                                }
                                var query = wx.createSelectorQuery();
                                //选择id
                                query.select('.item-name-border').boundingClientRect(function(rect) {
                                    page.setData({
                                        height: rect.width + 'px'
                                    })
                                }).exec();
                            } else {

                            }
                        }
                    });
                } else if (loadingType == 2) {
                    console.log("1111")
                    app.post({
                        url: global.api.getAllFeeds,
                        data: {
                            startFeedId: startFeedId,
                        },
                        success: function(res) {
                            var res1 = res.data;
                            var user = res1.data;
                            var items = "classify1[0].hotList";
                            if (res1.code == 200) {
                                console.log(user)
                                page.setData({
                                    ['classify1[0].hotList']: page.data.classify1[0].hotList.concat(user),
                                })
                                if (user == []) {
                                    page.setData({
                                        isNoMore1: true,
                                    })
                                }
                                for (let i = 0; i < user.length; i++) {
                                    var sections1 = "classify1[0].hotList[" + i + "].sections"
                                    var sections = user[i].sections;
                                    if (sections) {
                                        var sections = JSON.parse(sections);
                                        page.setData({
                                            [sections1]: sections,
                                        })
                                    }
                                }
                                setTimeout(() => {
                                    page.setData({
                                        scrollTop: 0,
                                        isLoading: false
                                    })
                                }, 2000);
                                var query = wx.createSelectorQuery();
                                //选择id
                                query.select('.item-name-border').boundingClientRect(function(rect) {
                                    page.setData({
                                        height: rect.width + 'px'
                                    })
                                }).exec();
                            } else {

                            }
                        }
                    });
                }

            } else {
                setTimeout(() => {
                    page.setData({
                        scrollTop: 0,
                        isLoading: false
                    })
                }, 2000);
            }
        } else {
            app.post({
                url: global.api.getAllFeeds,
                data: {},
                success: function(res) {
                    var res1 = res.data;
                    var user = res1.data;
                    var items = "classify1[0].hotList";
                    if (res1.code == 200) {
                        console.log(user)
                        page.setData({
                            ['classify1[0].hotList']: user,
                        })
                        for (let i = 0; i < user.length; i++) {
                            var sections1 = "classify1[0].hotList[" + i + "].sections"
                            var sections = user[i].sections;
                            if (sections) {
                                var sections = JSON.parse(sections);
                                page.setData({
                                    [sections1]: sections,
                                })
                            }
                        }
                        page.setData({
                            isNewContent: user.length,
                            isLoading: true
                        })
                        setTimeout(() => {
                            page.setData({
                                isLoading: false
                            })
                        }, 2000);
                        var query = wx.createSelectorQuery();
                        //选择id
                        query.select('.item-name-border').boundingClientRect(function(rect) {
                            page.setData({
                                height: rect.width + 'px'
                            })
                        }).exec();
                    } else {

                    }
                }
            });
        }

    },
    recommendGroup: function(e) {
        let page = this;
        let everySize = 20;
        let pageNum = page.data.pageNum
        app.post({
            url: global.api.recommendGroup,
            data: {
                page: pageNum,
                everySize: everySize
            },
            success: function(res) {
                let res1 = res.data;
                let user = res1.data;
                let length = page.data.classify1.length - 1;
                let items = "classify1[" + length + "].hotList"
                let hotList = page.data.classify1[length].hotList
                if (hotList && res1.code == 200) {

                    page.setData({
                        [items]: hotList.concat(user),
                    })
                    if (user == []) {
                        page.setData({
                            isNoMore: true,
                        })
                    }
                } else if (res1.code == 200 && !hotList) {
                    page.setData({
                        [items]: user,
                    })
                }
            }
        });
    },
    getGroupFeeds: function(loadingType) {
        let page = this;
        let groupId = page.data.listId;
        let index = page.data.activeIndex;
        if (loadingType == 1 && page.data.classify1[index].hotList) {
            let endDeedId = -1;
            try {
                endDeedId = page.data.classify1[index].hotList[0].feedId
            } catch (e) {

            }
            app.post({
                url: global.api.getGroupFeeds,
                data: {
                    groupId: groupId,
                    endFeedId: endDeedId
                },
                success: function(res) {
                    var res1 = res.data;
                    var user = res1.data;
                    console.log(res1)
                    if (res1.code == 200) {
                        var length = page.data.classify1.length;
                        if (index !== 0 && index < length - 1) {
                            var hotList = "classify1[" + index + "].hotList"
                            page.setData({
                                [hotList]: user.concat(page.data.classify1[index].hotList)
                            })

                            for (let i = 0; i < user.length; i++) {
                                var sections1 = "classify1[" + index + "].hotList[" + i + "].sections"
                                var sections = user[i].sections;
                                if (sections) {
                                    var sections = JSON.parse(sections);
                                    page.setData({
                                        [sections1]: sections,
                                    })
                                }
                            }
                            if (user.length != 0) {
                                page.setData({
                                    isNewContent: user.length,
                                    isLoading1: true
                                })
                                setTimeout(() => {
                                    page.setData({
                                        isLoading1: false
                                    })
                                }, 2000);
                            }

                        } else {
                            setTimeout(() => {
                                page.setData({
                                    scrollTop: 0,
                                    isLoading: false
                                })
                            }, 3000);
                        }
                    } else {}
                }
            });
        } else if (loadingType == 2) {
            var length = page.data.classify1[index].hotList.length;
            var startFeedId = page.data.classify1[index].hotList[length - 1].feedId;
            app.post({
                url: global.api.getGroupFeeds,
                data: {
                    groupId: groupId,
                    startFeedId: startFeedId
                },
                success: function(res) {
                    var res1 = res.data;
                    var user = res1.data;
                    console.log(res1)
                    if (res1.code == 200) {
                        var length = page.data.classify1.length;
                        if (index !== 0 && index < length - 1) {
                            var hotList = "classify1[" + index + "].hotList"
                            page.setData({
                                [hotList]: page.data.classify1[index].hotList.concat(user)
                            })
                            if (user == []) {
                                page.setData({
                                    isNoMore2: true,
                                })
                            }
                            for (let i = 0; i < user.length; i++) {
                                var sections1 = "classify1[" + index + "].hotList[" + i + "].sections"
                                var sections = user[i].sections;
                                if (sections) {
                                    var sections = JSON.parse(sections);
                                    page.setData({
                                        [sections1]: sections,
                                    })
                                }

                            }
                            setTimeout(() => {
                                page.setData({
                                    scrollTop: 0,
                                    isLoading: false
                                })
                            }, 3000);
                        } else {
                            setTimeout(() => {
                                page.setData({
                                    scrollTop: 0,
                                    isLoading: false
                                })
                            }, 3000);
                        }
                    } else {}
                }
            });
        } else {
            app.post({
                url: global.api.getGroupFeeds,
                data: {
                    groupId: groupId,
                },
                success: function(res) {
                    var res1 = res.data;
                    var user = res1.data;
                    console.log(res1)
                    if (res1.code == 200) {
                        var length = page.data.classify1.length;
                        if (index !== 0 && index < length - 1) {
                            var hotList = "classify1[" + index + "].hotList"
                            page.setData({
                                [hotList]: user,
                            })
                            for (let i = 0; i < user.length; i++) {
                                var sections1 = "classify1[" + index + "].hotList[" + i + "].sections"
                                var sections = user[i].sections;
                                if (sections) {
                                    var sections = JSON.parse(sections);
                                    page.setData({
                                        [sections1]: sections,
                                    })
                                }

                            }
                            page.setData({
                                isNewContent: user.length,
                                isLoading1: true
                            })
                            setTimeout(() => {
                                page.setData({
                                    isLoading1: false
                                })
                            }, 2000);
                        }
                    } else {}
                }
            });
        }

    },

})