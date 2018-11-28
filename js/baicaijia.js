$(function () {
    var baicai = new BaiCai();
    baicai.BaiCaiSlide();
    baicai.BaiCaiMenu();
    baicai.BaiCaiDate();
    baicai.BaiCaiScroll();
    baicai.MenuHide();
})

var BaiCai = function () {

}
BaiCai.prototype = {
    titleid: 0,


    /* 页面刷新的时候请求ajax数据 */
    BaiCaiDate: function () {
        var that = this;
        $.ajax({
            url: "http://localhost:9090/api/getbaicaijiaproduct",
            data: {
                titleid: that.titleid
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
            height= ($('.baicai-ul').height()) * .8;
            // console.log(window.pageYOffset);
            // console.log(height);
        /* 当页面滚动出去的距离大于ul的高度,就让titleid+1,再请求ajax加载数据 */ 
            if (window.pageYOffset > height) {
                that.titleid++;
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
        $('.btn-menu').on('tap', function () {
            $('#classify').toggle();
        })
    },
    MenuHide: function () {
        $('.up-menu').on('tap', function () {
            $('#classify').hide();
        })
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