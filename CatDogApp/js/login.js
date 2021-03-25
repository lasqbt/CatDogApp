// input 输入框 选中设置css效果
function changeBorder(id,flag){
	if(flag=='1'){
		$('#'+id).css("box-shadow","0px 0px 10px #B6B73F");
	}else{
		$('#'+id).css("box-shadow","none");
	}
	
}

// 验证码的生成和提交验证
var show_num = [];
draw(show_num);
$("#canvas").on('click',function(){
	draw(show_num);
});

//主js入口
(function (mui) {
	mui.init({
		swipeBack:false //启用右滑关闭功能
	});
	
	//IOS中 按钮 css的active不起作用  增加此方法即可，空方法体就行
	document.body.addEventListener('touchstart', function () {}); 
	
	mui.plusReady(function(){
		document.getElementById("loinBtn").addEventListener('tap',function() {
			/* $("#loinBtn").css("background-color","transparent"); */
		});
		
		document.getElementById("loginType").addEventListener("tap",function () {
			if (mui.os.plus) {
				var buttonTit = [{
					title: "账号登录"
				}, {
					title: "手势登录"
				}, {
					title: "指纹登录"
				}];
		
				plus.nativeUI.actionSheet({
					title: "选择登录方式", 
					cancel: "取消",
					buttons: buttonTit
				}, function(b) { /*actionSheet 按钮点击事件*/
					switch (b.index) {
						case 0:
							break;
						case 1:
							document.getElementById("accountLogin").style.display="block";
							document.getElementById("shouShiLogin").style.display="none";
							break;
						case 2:
							document.getElementById("accountLogin").style.display="none";
							document.getElementById("shouShiLogin").style.display="block";
							break;
						case 3:
							plusReady();
							break;
						default:
							break;
					}
				})
			}
		})
	});
})(mui);