$(function () {
    var titleid = getQueryString('url');
    var sell = new Sell(titleid);
    sell.BaiCaiSlide();
    sell.BaiCaiMenu();
    sell.MenuHide();
    sell.getBaiCaiJiaTitle();
    sell.sellData();
    sell.getBaiCaiJiaProduct();
    sell.BaiCaiScroll();
    sell.sellStop();
})

var Sell = function (titleid) {
    this.titleid = titleid;
}

Sell.prototype = {
    num: 1,

    /* 请求标题 */
    getBaiCaiJiaTitle: function () {
        var that = this;
        $.ajax({
            url: "http://localhost:9090/api/getbaicaijiatitle",
            success: function (data) {
                var html = template('sellTitleTpl', {
                    result: data.result,
                    red: that.titleid || 0
                });
                $('#sell-ul').html(html);
            }
        });
    },
    /* 根据点击的标题加载不同的页面 */
    getBaiCaiJiaProduct: function () {
        var that = this;
        $('#sell-ul').on('tap', '.sell-li', function () {
            var ts = this;
            that.titleid = $(ts).data('titleid');
            that.refreshSell(function(data){
                var html = template('sellCommodityTpl', {
                    result: data.result,
                })
                $('.baicai-ul').html(html);
            });
            $(ts).addClass('active').siblings().removeClass('active');
        });
    },

    /* ajax请求加载的数据 */
    refreshSell: function (callback) {
        var that = this;
        $.ajax({
            url: "http://localhost:9090/api/getbaicaijiaproduct",
            data: {
                titleid: that.titleid || 0
            },
            success: function(data) {
                callback(data);
            }
        });
    },

    /* 页面刷新加载的数据 */

    sellData: function(){
        var that = this;
        that.refreshSell(function(data){
            var html = template('sellCommodityTpl', {
                result: data.result,
            })
            $('.baicai-ul').html(html);
        })
    },

    /* 页面滚动加载数据 */
    BaiCaiScroll: function () {
        var that = this;
        $(window).on('scroll', function () {
            height = ($('.baicai-ul').height()) * .7;

            // console.log(window.pageYOffset);
            // console.log(height);
            /* 当页面滚动出去的距离大于ul的高度,就让titleid+1,再请求ajax加载数据 */
            if (window.pageYOffset > height) {
                that.titleid++;
                if (that.titleid < 13) {
                    that.refreshSell(function (data) {
                        var html = template('sellCommodityTpl', {
                            result: data.result,
                        })
                        $('.baicai-ul').append(html);
                    });
                }else{
                    that.titleid = 0
                }
            }
        });
    },


    /* 点击菜单按钮弹出菜单事件 */
    BaiCaiMenu: function () {
        var that = this;

        $('.btn-menu').on('tap', function () {
            // $('#classify').toggle();

            // if($('.btn-down').is('.fa-angle-up')){
            //     $('.btn-down').removeClass('fa-angle-up').addClass('fa-angle-down');
            //     $('#classify').hide();
            //     console.log(1);

            // }
            // if($('.btn-down').is('.fa-angle-down')){
            //     $('.btn-down').removeClass('fa-angle-down').addClass('fa-angle-up');
            //     $('#classify').show();
            //     console.log(2);

            // }
            if (that.num == 1) {
                $('.btn-down').removeClass('fa-angle-down').addClass('fa-angle-up');
                $('#classify').show();
                that.num = 2;
            } else {
                $('.btn-down').removeClass('fa-angle-up').addClass('fa-angle-down');
                $('#classify').hide();
                that.num = 1;
            }

        })
    },

    MenuHide: function () {
        var that = this;
        $('.up-menu').on('tap', function () {
            $('#classify').hide();
            $('.btn-down').removeClass('fa-angle-up').addClass('fa-angle-down');
            that.num = 1;

        })
    },

    /* 初始化横屏的滑动 */
    BaiCaiSlide: function () {
        mui('.mui-scroll-wrapper').scroll({
            scrollY: false, //是否竖向滚动
            scrollX: true, //是否横向滚动
            startX: 0, //初始化时滚动至x
            startY: 0, //初始化时滚动至y
            indicators: false, //是否显示滚动条
            deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹
        });
    },
    /* a点击a链接阻止跳转 */
    sellStop: function(){
        $('.baicai-ul').on('tap', '.div4 a', function(e){
            console.log(1);
            document.querySelectorAll('a').forEach(a => {a.onclick=(e) => {e.preventDefault()}})
            return false;
        })
    }
}

//别人使用正则写的获取url地址栏参数的方法
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        // 用了另一种转码方式 我们是默认转码方式 使用decodeURI
        // return unescape(r[2]);
        return decodeURI(r[2]);
    }
    return null;
}