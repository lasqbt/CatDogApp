//上传图片 批量上传 start
		
var newUrlAfterCompress;
// checkPicNum可上传照片张数，picType照片类型，appSessionIdInfo移动端的请求唯一标识
function choosePhoto(event,checkPicNum,picType,appSessionIdInfo,taskId,menuId){
	if (mui.os.plus) {
		var buttonTit = [{
			title: "我要拍照美美哒"
		}, {
			title: "从手机相册选择"
		}];

		plus.nativeUI.actionSheet({
			/* title: "上传图片", */
			cancel: "取消",
			buttons: buttonTit
		}, function(b) { /*actionSheet 按钮点击事件*/
			switch (b.index) {
				case 0:
					break;
				case 1:
					getImage(picType,appSessionIdInfo,taskId,menuId); /*拍照*/
					break;
				case 2:
					galleryImg(checkPicNum,picType,appSessionIdInfo,taskId,menuId); /*打开相册*/
					break;
				default:
					break;
			}
		})
	}
}
// 拍照获取图片
function getImage(picType,appSessionIdInfo,taskId,menuId) {
	var c = plus.camera.getCamera();
	c.captureImage(function(e) {
		plus.io.resolveLocalFileSystemURL(e, function(entry) {
			var imgSrc = entry.toLocalURL() + "?version=" + new Date().getTime(); //拿到图片路径  
			var imgId = getUid();
			if(picType!=9){//非上传头像
				setHtml(imgSrc,imgId);
			}
			var dstname = "_downloads/" + imgId + ".jpg"; //设置压缩后图片的路径 
			newUrlAfterCompress = compressImage(imgSrc, dstname,picType,appSessionIdInfo,taskId,menuId,imgId);
			appendFile(dstname, imgSrc);
		}, function(e) {
			console.log("读取拍照文件错误：" + e.message);
		});
	}, function(s) {
		console.log("error" + s);
	}, {
		filename: "_doc/camera/"
	})
}
// 从相册中选择图片 
function galleryImg(checkPicNum,picType,appSessionIdInfo,taskId,menuId) {
	plus.gallery.pick(function(e) {
		for (var i in e.files) {
			var fileSrc = e.files[i];
			var imgId = getUid();
			if(picType!=9){//非上传头像
				setHtml(fileSrc,imgId);
			}
			var dstname = "_downloads/" + imgId + ".jpg"; //设置压缩后图片的路径 
			newUrlAfterCompress = compressImage(e.files[i], dstname,picType,appSessionIdInfo,taskId,menuId,imgId);
			appendFile(dstname, fileSrc);
		}
	}, function(e) {
		console.log("取消选择图片");
	}, {
		filter: "image",
		multiple: true,
		maximum: checkPicNum,
		system: false,
		onmaxed: function() {
			console.log('最多只能选择'+checkPicNum+'张图片');
			plus.nativeUI.alert('最多只能选择'+checkPicNum+'张图片');
		}
	});
}

function setHtml(e,imgId) {
	/* var divHtml = "<div class=\"a-add\"><img src=" + encodeURI(e) +
		" class=\"file_img\" style=\"width:96px;height:96px\"><img  src=\"../../images/remove.png\" class=\"a-remove\"></div>";
	$("#imgDiv").prepend(divHtml); */
	var html = '<li class="mui-table-view-cell liCss" style="height: 178px;" id="'+imgId+'">';
	html = html + '<div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red">删除</a></div>';
	html = html + '<div class="mui-slider-handle" style="background:none;width:380px">';
	html = html + '<table style="width: 100%;height: 100%;">';
	html = html + '<tr style="height: 100px;">';
	html = html + '<td style="width: 45%;" rowspan="2">';
	html = html + '<img data-preview-src="" data-preview-group="1" src="'+encodeURI(e)+'" id="imgInfo" class="imgCss"/>';
	html = html + '</td>';
	html = html + '<td style="width: 55%;text-align: right;">';
	html = html + '<textarea id="'+imgId+'description" placeholder="请输入照片描述,100个字符以内..." class="textareaCss"></textarea>';
	html = html + '</td>';
	html = html + '</tr>';
	html = html + '<tr style="height: 50px;">';
	html = html + '<td>';
	html = html + '<button type="button" id="saveDescription" class="mui-btn mui-btn-primary detailBtnCss saveDescriptionCss" style="margin-left: 5%;">';
	html = html + '保存描述';
	html = html + '</button>';
	html = html + '<button type="button" id="deletPic" class="mui-btn mui-btn-primary detailBtnCss deletPicCss" style="margin-left: 5%;float: right;color: red;">';
	html = html + '删除照片';
	html = html + '</button>';
	html = html + '<input type="hidden" id="'+imgId+'picId" value="" />';
	html = html + '</td>';
	html = html + '</tr>';
	html = html + '</table>';
	html = html + '<div class="loadingDiv" id="'+imgId+'Div">';
	html = html + '<div style="width: 100px;height: 50px;margin: 0 auto;margin-top: 12%;">';
	html = html + '<div class="mui-spinner" id="'+imgId+'loading" style="margin-top: 15%;font-size: 1rem;float: left;line-height: 50px;"></div>';
	html = html + '<div style="float: right;line-height: 50px;color: yellow;" id="'+imgId+'loadingInfo">上传中...</div>';
	html = html + '</div>';
	html = html + '</div>';
	html = html + '</div>';
	html = html + '</li>';
	$("#imgList").append(html);
}
//压缩图片，无return 
function compressImage(src, dstname,picType,appSessionIdInfo,taskId,menuId,imgId) {
	plus.zip.compressImage({
			src: src,
			dst: dstname,
			overwrite: true,
			quality: 20
		},
		function(event) {
			console.log("压缩一张照片成功:"+event.target); 
			upload(picType,appSessionIdInfo,taskId,menuId,imgId);
			//return event.target;
		},
		function(error) {
			console.log("压缩一张照片出错:"+event.target); 
			//return src;
		});
}
// 产生一个随机数 
function getUid() {
	//return Math.floor(Math.random() * 100000000 + 10000000).toString();
	return generateUUID();
}
var files = [];			
var index = 1;							
function appendFile(p, fileSrc) {
	console.log("name=="+"img" + index);
	console.log("path=="+p);
	files.push({
		name: "img" + index, //这个值服务器会用到，作为file的key 					
		path: p,					
		fileSrc: fileSrc
	});				
	index++;			
}
//上传文件
function upload(picType,appSessionIdInfo,taskId,menuId,imgId) {
	//mui.showLoading("上传中,请稍后...","div");
	var url = "";
	if(picType == 9){
		url = path1 + "/uploadPic/uploadImageForHead?appSessionIdInfo="+appSessionIdInfo;
	}else{
		url = path1 + "/uploadPic/uploadImageForMyApp?appSessionIdInfo="+appSessionIdInfo;
	}
	console.log("上传照片=="+url);
	var task = plus.uploader.createUpload(url, {
			method: "POST"
		},
		function(t, status) {
			//mui.hideLoading();
			if (status == 200) {
				console.log("上传成功，状态码=="+status+",t=="+JSON.stringify(t));
				var rCode = JSON.parse(eval(t).responseText).code;
				var rPicName = JSON.parse(eval(t).responseText).picName;
				var rMsg = JSON.parse(eval(t).responseText).msg;
				var picIdInfo = JSON.parse(eval(t).responseText).picId;
				if(picType == '9'){//上传头像一张
					if(rCode=='0'){
						mui.alert(rMsg);
						$("#imgInfo").attr("src",path1+"/uploadPic/showPic?pictureName="+rPicName+"&appSessionIdInfo="+appSessionIdInfo);
						files = [];	
						index = 1;
					}else{
						mui.alert(rMsg);
					}
				}else{//上传多张检修照片
					if(rCode=='0'){
						$("#"+imgId+"Div").css("display","none");
						$("#"+imgId+"picId").value(picIdInfo);
						mui.toast(rMsg);
					}else{
						$("#"+imgId+"Div").empty();
						var h ='<div style="color: yellow;line-height: 158px;height: 30px;width: 100%;text-align: center;">上传失败，一个检修任务最多上传10张照片</div>';
						$("#"+imgId+"Div").append(h);
						mui.toast(rMsg);
					}
				}
				
			} else {
				console.log("请求失败，状态码=="+status);
			}
		}
	);
	//添加其他参数
	for (var i = 0; i < files.length; i++) {
		var f = files[i];
		task.addFile(f.path, {
			key: "imgFile"+i
		});
	}
	
	if(picType != 9){// 9代表是头像照片  反之代表的是各个检修类型的照片
		//大坑之处，传的参数值不能是数字0，数字0的话后台取不到 必须大于1的数字
		// 要传0的话 必须转字符串0
		task.addData("pictureType", picType.toString());
		task.addData("taskId", taskId);
		//menuId 针对年检
		//task.addData("menuId", menuId);
	}
	task.start();
}

//上传图片 批量上传 end

/*设置消息数字红点*/
function setRedNum(countInfo){
	if(countInfo==0){
		// app图标上设置数字显示  0代表无
		plus.runtime.setBadgeNumber(0);
		// app界面消息图标增加数字显示
		$("#countMsg").text();
		document.getElementById("countMsg").style.display='none';
	}else{
		// app图标上设置数字显示  0代表无否则代表有多少条
		plus.runtime.setBadgeNumber(countInfo);
		// app界面消息图标增加数字显示
		$("#countMsg").text(countInfo);
		document.getElementById("countMsg").style.display='block';
	}
}

// ip正则验证
function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
} 

//状态码转换
function taskStatusToCN(num){
	if(num === 1){
		return "待提交";
	}else if(num ===2){
		return "通过";
	}else if(num === 3){
		return "拒绝";
	}else if(num === 4){
		return "审核中";
	}else{
		return "未知";
	}
}

/*唯一标识*/
function generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

//设置cookie
function setCookie(cname,cvalue,exdays){
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

//获取cookie
function getCookie(cname){
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}

/**
 * [removeCookie 移除cookie]
 */
function removeCookie(key){
    setCookie(key,"",-1); // 把cookie设置为过期
}

