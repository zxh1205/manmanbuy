$(function () {
    var baicai = new BaiCai();
    baicai.BaiCaiSlide();
    baicai.BaiCaiMenu();
    baicai.BaiCaiDate();
    baicai.BaiCaiScroll();
    baicai.MenuHide();
    baicai.sellMask();
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
            beforeSend: function() {
                // 请求之前show显示加载中效果 
                $('#keep').show();
            },
            // ajax请求完成后的回调函数
            complete: function() {
                // 请求完成后hide隐藏加载中效果
                $('#keep').hide();
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
            height= ($('.baicai-ul').height()) * .6;
            // console.log(window.pageYOffset);
            // console.log(height);
        /* 当页面滚动出去的距离大于ul的高度,就让titleid+1,再请求ajax加载数据 */ 
            if (window.pageYOffset > height) {
                // function resizehandler(){
                    that.titleid++;
                // }
                // window.onresize=throttle(resizehandler,100,200);
                // throttle(resizehandler,100,200);
                // console.log(that.titleid);
                
                
                if(that.titleid < 13){
                    that.BaiCaiDate();
                }else{
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
    sellMask: function(){
        var that = this;
        $('.mask').on('click',function(){
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
    }
}


/* 函数的节流 */
function throttle(method,delay,duration){
    var timer=null, begin=new Date();
    return function(){
        var context=this, args=arguments, current=new Date();;
        clearTimeout(timer);
        if(current-begin>=duration){
             method.apply(context,args);
             begin=current;
        }else{
            timer=setTimeout(function(){
                method.apply(context,args);
            },delay);
        }
    }
};