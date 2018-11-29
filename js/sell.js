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
    // sell.sellStop();
    sell.sellMask();
    sell.answerTop();
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
            // ajax发送请求之前的回调函数
            beforeSend: function () {
                // 请求之前show显示加载中效果 
                $('#keep').show();

            },
            // ajax请求完成后的回调函数
            complete: function () {
                // 请求完成后hide隐藏加载中效果
                $('#keep').hide();

            },
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
            that.refreshSell(function (data) {
                var html = template('sellCommodityTpl', {
                    result: data.result,
                })
                $('.baicai-ul').html(html);
            });
            $(ts).addClass('active').siblings().removeClass('active');
            $('.btn-menu').html($(ts).children().html());
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
            beforeSend: function () {
                // 请求之前show显示加载中效果 
                $('#keep').show();

                that.stop();
            },
            // ajax请求完成后的回调函数
            complete: function () {
                // 请求完成后hide隐藏加载中效果
                $('#keep').hide();
                that.move();
            },
            success: function (data) {
                callback(data);
            }
        });
    },

    /* 页面刷新加载的数据 */

    sellData: function () {
        var that = this;
        var title = getQueryString('title') || '全部';
        that.refreshSell(function (data) {
            var html = template('sellCommodityTpl', {
                result: data.result,
            })
            $('.baicai-ul').html(html);
            $('.btn-menu').html(title);
        })
    },

    /* 页面滚动加载数据 */
    BaiCaiScroll: function () {
        var that = this;
        $(window).on('scroll', function () {
            height = ($('.baicai-ul').height()) * .6;

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
                } else {
                    that.titleid = 1
                }
            }
        });
    },


    /* 点击菜单按钮弹出菜单事件 */
    BaiCaiMenu: function () {
        var that = this;

        $('#title').on('tap', function () {
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
                that.num = 2;
                $('#classify').show();
                $('.mask').show();
            } else {
                $('.btn-down').removeClass('fa-angle-up').addClass('fa-angle-down');
                $('#classify').hide();
                that.num = 1;
                $('.mask').hide();
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
    sellMask: function () {
        var that = this;
        $('.mask').on('click', function () {
            $(this).hide();
            $('#classify').hide();
            $('.btn-down').removeClass('fa-angle-up').addClass('fa-angle-down');
            that.num = 1;
        });
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
    // sellStop: function(){
    //     $('.baicai-ul').on('tap', '.div4 a', function(e){
    //         console.log(1);
    //         document.querySelectorAll('a').forEach(a => {a.onclick=(e) => {e.preventDefault()}})
    //         return false;
    //     })
    // }
    /* 返回顶部的函数 */
    answerTop: function(){
        $(window).on('scroll', function(){
            if(window.pageYOffset > 2500){
                $('.answer-top').show();
            }else {
                $('.answer-top').hide();
            }
        })
        $('.click-up').on('tap',function(){
            scrollTo(0,0,900);//100毫秒滚动到顶
        })
    },
    stop: function () {
        document.body.style.overflow = 'hidden';
        document.addEventListener("touchmove", mo, false); //禁止页面滑动
    },
    move: function() {
        document.body.style.overflow = ''; //出现滚动条
        document.removeEventListener("touchmove", mo, false);
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
};

/* 函数的节流 */
// function throttle(method, delay, duration) {
//     var timer = null,
//         begin = new Date();
//     return function () {
//         var context = this,
//             args = arguments,
//             current = new Date();;
//         clearTimeout(timer);
//         if (current - begin >= duration) {
//             method.apply(context, args);
//             begin = current;
//         } else {
//             timer = setTimeout(function () {
//                 method.apply(context, args);
//             }, delay);
//         }
//     }
// };
var mo = function (e) {
    e.preventDefault();
};