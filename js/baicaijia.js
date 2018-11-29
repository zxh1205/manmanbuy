$(function () {
    var baicai = new BaiCai();
    baicai.BaiCaiSlide();
    baicai.BaiCaiMenu();
    baicai.BaiCaiDate();
    baicai.BaiCaiScroll();
    baicai.MenuHide();
    baicai.sellMask();
    baicai.answerTop();
})

var BaiCai = function () {

}
BaiCai.prototype = {
    titleid: 0,
    num: 1,

    /* 页面刷新的时候请求ajax数据 */
    BaiCaiDate: function () {
        var that = this;
        $.ajax({
            url: "http://localhost:9090/api/getbaicaijiaproduct",
            data: {
                titleid: that.titleid
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
                var html = template('BaiCaiCommodityTpl', {
                    result: data.result
                })
                if (that.titleid != 0) {
                    $('.baicai-ul').append(html);
                } else {
                    $('.baicai-ul').html(html);
                }
            }
        });
    },

    /* 页面滚动加载数据 */
    BaiCaiScroll: function () {
        var that = this;
        $(window).on('scroll', function () {
            height = ($('.baicai-ul').height()) * .90;
            // console.log(window.pageYOffset);
            // console.log(height);
            /* 当页面滚动出去的距离大于ul的高度,就让titleid+1,再请求ajax加载数据 */

            if (window.pageYOffset > height) {
                that.titleid++;
                if (that.titleid < 13) {
                    that.BaiCaiDate();
                } else {
                    that.titleid = 1;
                }
            }
        });
    },

    /* 点击菜单按钮弹出菜单事件 */
    BaiCaiMenu: function () {
        var that = this;
        $('.btn-menu').on('tap', function () {
            if (that.num == 1) {
                that.num = 2;
                $('#classify').show();
                $('.mask').show();
            } else {
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
            $('.mask').hide();
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

    /* 热销区域的页面横屏滑动事件 */
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
    // /* 函数的节流 */
    // throttle: function(fn, delay, mustRunDelay){
    //     var timer = null;
    //     var t_start;
    //     return function(){
    //         var context = this, args = arguments, t_curr = +new Date();
    //         clearTimeout(timer);
    //         if(!t_start){
    //             t_start = t_curr;
    //         }
    //         if(t_curr - t_start >= mustRunDelay){
    //             fn.apply(context, args);
    //             t_start = t_curr;
    //         }
    //         else {
    //             timer = setTimeout(function(){
    //                 fn.apply(context, args);
    //             }, delay);
    //         }
    //     };
    // },
    // resizehandler: function () {
    //     var that = this;

    // }
    stop: function () {
        document.body.style.overflow = 'hidden';
        document.addEventListener("touchmove", mo, false); //禁止页面滑动
    },
    move: function () {
        document.body.style.overflow = ''; //出现滚动条
        document.removeEventListener("touchmove", mo, false);
    },
    
}
var mo = function (e) {
    e.preventDefault();
}