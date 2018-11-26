$(function () {
	var mmb = new MMB();
	mmb.getIndexMenu();
	mmb.getDiscountProduct();
});

var MMB = function () {
	
}
MMB.prototype = {
	baseURL:'http://localhost:9090',
	//获取首页菜单的函数
	getIndexMenu:function () {
		$.ajax({
			url:this.baseURL+'/api/getindexmenu',
			success:function (data) {
				var html = template('indexMenuTpl',data);
				$('#nav .mui-row').html(html);
			}
		})
	},
	//获取首页折扣商品
	getDiscountProduct:function () {
		$.ajax({
			url:this.baseURL+'/api/getmoneyctrl',
			success:function (data) {
				console.log(data);
				var html = template('discountProductTpl',data);
				$('#productList .content ul').html(html);
			}
		})
	}
}

