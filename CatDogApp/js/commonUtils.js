
/**
 * @Description: 部分通用js工具
 * @author liu ai shen
 * @date 2018年12月26日
 */

// 在js中使用endwith
String.prototype.endWith=function(s){
	  if(s==null||s==""||this.length==0||s.length>this.length)
	     return false;
	  if(this.substring(this.length-s.length)==s)
	     return true;
	  else
	     return false;
	  return true;
}
// 在js中使用startwith
String.prototype.startWith=function(s){
  if(s==null||s==""||this.length==0||s.length>this.length)
   return false;
  if(this.substr(0,s.length)==s)
     return true;
  else
     return false;
  return true;
}

//序列化form表单
$.fn.serializeJson = function () {
	var serializeObj = {};
	var array = this.serializeArray();
	$.each(array, function () {
		if (serializeObj[this.name] !== undefined) {
			if (!serializeObj[this.name].push) {
				serializeObj[this.name] = [serializeObj[this.name]];
			}
			serializeObj[this.name].push(this.value || '');
		} else {// 转折点
			// 通用设置 勿要擅自修改
			// 判断Arr是因为在页面上的所有checkbox的name都是以Arr结尾的
			// 之所以加上这个判断是为了防止当某个字段(比如7种故障等级)的checkbox只选择一种
			// 的时候序列化出来的是xxx:"1"，而不是xxx:["1"],后台是用数组接收的
			// 加上这个判断后，数组的第一位是空要过滤掉。如：["","1"]
			if(this.name.endWith("Arr")){
				serializeObj[this.name] = '';
				if (!serializeObj[this.name].push) {
					serializeObj[this.name] = [serializeObj[this.name]];
				}
				serializeObj[this.name].push(this.value || '');
			}else{
				// 在转折点的else中原始只有这一行代码  
				serializeObj[this.name] = this.value || '';
			}
		}
	});
	return serializeObj;
};


// 在js中使用replaceAll
String.prototype.replaceAll = function(s1,s2){
	　　return this.replace(new RegExp(s1,"gm"),s2);
}

//在js中使用equals方法
String.prototype.equals = function(str){
	　　return this == str.replace(/(^\s*)|(\s*$)/g,"");
}

//在js中使用equals方法
String.prototype.equalsStr = function(str1,str2){
	　　return str1.replace(/(^\s*)|(\s*$)/g,"") == str2.replace(/(^\s*)|(\s*$)/g,"");
}

// 勿要做出修改
function checkStr(str){
	if(str.trim().length==0 || str== null || str==undefined){
		return true;
	}else{
		return false;
	}
}

//邮箱验证
function checkEmail(str){ 
	var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/; 
	return reg.test(str); 
} 

// 手机验证
function checkPhone(str){
	var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
	return reg.test(str); 
}

// 将时间戳转换成日期格式
// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
function timestampToTime(timestamp) {
	if(null==timestamp || timestamp=='null'){
		return "";
	}
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
}

// 将日期格式字符串转换成时间戳
function dateTotimestamp(dateStr){
	var date = new Date(dateStr);
    var time1 = date.getTime();
	return time1;
}

// null变成空白字符串
function nullToBlank(obj){
	if(null == obj || obj=='null' || obj==''){
		return "";
	}else{
		return obj;
	}
}

//正整数验证 7位
function checkNumber(str){
	var reg = /^\d{1,7}$/;
	if(reg.test(str)){
	    return true;
	}else{
		return false;
	}
}

//正整数验证 5位
function checkNumber5(str){
	var reg = /^\d{1,5}$/;
	return reg.test(str);
}

//正数验证(正整数 正小数)
function checkNumberNotZero(str){
	// 正浮点数
	var reg1 =/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
	// 正整数
	var reg2=/^\d{1,7}$/;
	if(reg1.test(str)||reg2.test(str)){
		if(str==0){
			 return false;
		}else{
			 return true;
		}
	}else{
		return false;
	}
}

function checkNum(obj) {
    //如果用户第一位输入的是小数点，则重置输入框内容
    if (obj.value != '' && obj.value.substr(0, 1) == '.') {
      obj.value = "";
    }
    obj.value = obj.value.replace(/^0*(0\.|[1-9])/, '$1');//粘贴不生效
    obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
    if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      if (obj.value.substr(0, 1) == '0' && obj.value.length == 2) {
        obj.value = obj.value.substr(1, obj.value.length);
      }
    }
  }

//是否包含特殊字符
function checkSpecialStr(str){
	if ((/[\!\|\#\%\^\&\￥\*\_\-\+\=\（\）\{\}\\\/\【\】\、\<\>\、\《\》\:\;\：\；\"\“\'\‘\,\，\.\。\)<>?]/gi).test(str)) {
    	return true;
    }else{
		return false;
	}
}

// 日期格式化
function Format(datetime,fmt) {
	if(datetime == null || datetime == 'null'){
		return "";
	}
	  if (parseInt(datetime)==datetime) {
	    if (datetime.length==10) {
	      datetime=parseInt(datetime)*1000;
	    } else if(datetime.length==13) {
	      datetime=parseInt(datetime);
	    }
	  }
	  datetime=new Date(datetime);
	  var o = {
	  "M+" : datetime.getMonth()+1,                 //月份   
	  "d+" : datetime.getDate(),                    //日   
	  "h+" : datetime.getHours(),                   //小时   
	  "m+" : datetime.getMinutes(),                 //分   
	  "s+" : datetime.getSeconds(),                 //秒   
	  "q+" : Math.floor((datetime.getMonth()+3)/3), //季度   
	  "S"  : datetime.getMilliseconds()             //毫秒   
	  };   
	  if(/(y+)/.test(fmt))   
	  fmt=fmt.replace(RegExp.$1, (datetime.getFullYear()+"").substr(4 - RegExp.$1.length));   
	  for(var k in o)   
	  if(new RegExp("("+ k +")").test(fmt))   
	  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
	  return fmt;
	}

function fomartNumToStr(status){
	if(status==='1'){
		return "入库";
	}else if(status==='2'){
		return "准备推送";
	}else if(status==='3'){
		return "推送中";
	}else if(status==='4'){
		return "推送成功";
	}else if(status==='5'){
		return "推送失败";
	}else{
		return "未知";
	}
}

// 全屏展示
function requestFullScreen() {
	var docElm = document.documentElement; 
    if (docElm.requestFullscreen) { 
      docElm.requestFullscreen(); 
    } 
    else if (docElm.msRequestFullscreen) { 
      docElm.msRequestFullscreen(); 
    } 
    else if (docElm.mozRequestFullScreen) { 
      docElm.mozRequestFullScreen(); 
    } 
    else if (docElm.webkitRequestFullScreen) { 
      docElm.webkitRequestFullScreen(); 
    } 
}
//退出全屏
function exitFullscreen() {
	if (document.exitFullscreen) { 
      document.exitFullscreen(); 
    } 
    else if (document.msExitFullscreen) { 
      document.msExitFullscreen(); 
    } 
    else if (document.mozCancelFullScreen) { 
      document.mozCancelFullScreen(); 
    } 
    else if (document.webkitCancelFullScreen) { 
      document.webkitCancelFullScreen(); 
    }
}
var isFullScreenFlag = 1;
function isFullScreen(){
	isFullScreenFlag += 1;
	console.log(isFullScreenFlag);
	if(isFullScreenFlag%2===0){
		requestFullScreen();
	}else{
		exitFullscreen();
	}
}

// ip正则验证
function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
} 


function draw(show_num) {
	var canvas_width=$('#canvas').width();
	var canvas_height=$('#canvas').height();
	var canvas = document.getElementById("canvas");//获取到canvas的对象，演员
	var context = canvas.getContext("2d");//获取到canvas画图的环境，演员表演的舞台
	canvas.width = canvas_width;
	canvas.height = canvas_height;
	//var sCode = "A,B,C,E,F,G,H,K,L,M,N,P,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9";
	var sCode = "1,2,3,4,5,6,7,8,9,0";
	var aCode = sCode.split(",");
	var aLength = aCode.length;//获取到数组的长度
	
	for (var i = 0; i <= 5; i++) {
		var j = Math.floor(Math.random() * aLength);//获取到随机的索引值
		var deg = Math.random() * 30 * Math.PI / 180;//0-30
		var txt = aCode[j];//得到随机的一个内容
		show_num[i] = txt.toLowerCase();
		var x = 10 + i * 20;//文字在canvas上的x坐标
		var y = 20 + Math.random() * 8;//文字在canvas上的y坐标
		context.font = "bold 23px 微软雅黑";
	 
		context.translate(x, y);
		context.rotate(deg);
	 
		context.fillStyle = randomColor();
		context.fillText(txt, 0, 0);
	 
		context.rotate(-deg);
		context.translate(-x, -y);
	}
	for (var i = 0; i <= 5; i++) { //验证码上显示线条
		context.strokeStyle = randomColor();
		context.beginPath();
		context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
		context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
		context.stroke();
	}
	for (var i = 0; i <= 30; i++) { //验证码上显示小点
		context.strokeStyle = randomColor();
		context.beginPath();
		var x = Math.random() * canvas_width;
		var y = Math.random() * canvas_height;
		context.moveTo(x, y);
		context.lineTo(x + 1, y + 1);
		context.stroke();
	}
}
	 
function randomColor() {//得到随机的颜色值
	var r = Math.floor(Math.random() * 256);
	var g = Math.floor(Math.random() * 256);
	var b = Math.floor(Math.random() * 256);
	return "rgb(" + r + "," + g + "," + b + ")";
}
