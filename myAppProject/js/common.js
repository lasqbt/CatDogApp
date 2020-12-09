//上传图片 批量上传 start
var files = [];			
var index = 1;			
var newUrlAfterCompress;
// checkPicNum可上传照片张数，picType照片类型，appSessionIdInfo移动端的请求唯一标识
function choosePhoto(event,checkPicNum,picType,appSessionIdInfo){
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
					getImage(picType,appSessionIdInfo); /*拍照*/
					break;
				case 2:
					galleryImg(checkPicNum,picType,appSessionIdInfo); /*打开相册*/
					break;
				default:
					break;
			}
		})
	}
}
// 拍照获取图片
function getImage(picType,appSessionIdInfo) {
	var c = plus.camera.getCamera();
	c.captureImage(function(e) {
		plus.io.resolveLocalFileSystemURL(e, function(entry) {
			var imgSrc = entry.toLocalURL() + "?version=" + new Date().getTime(); //拿到图片路径                        
			//setHtml(imgSrc);
			var dstname = "_downloads/" + getUid() + ".jpg"; //设置压缩后图片的路径 
			newUrlAfterCompress = compressImage(imgSrc, dstname,picType,appSessionIdInfo);
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
function galleryImg(checkPicNum,picType,appSessionIdInfo) {
	plus.gallery.pick(function(e) {
		for (var i in e.files) {
			var fileSrc = e.files[i];
			//setHtml(fileSrc);
			var dstname = "_downloads/" + getUid() + ".jpg"; //设置压缩后图片的路径 
			newUrlAfterCompress = compressImage(e.files[i], dstname,picType,appSessionIdInfo);
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

function setHtml(e) {
	/* var divHtml = "<div class=\"a-add\"><img src=" + encodeURI(e) +
		" class=\"file_img\" style=\"width:96px;height:96px\"><img  src=\"../../images/remove.png\" class=\"a-remove\"></div>";
	$("#imgDiv").prepend(divHtml); */
	$("#imgInfo").attr("src",encodeURI(e));
}
//压缩图片，无return 
function compressImage(src, dstname,picType,appSessionIdInfo) {
	plus.zip.compressImage({
			src: src,
			dst: dstname,
			overwrite: true,
			quality: 20
		},
		function(event) {
			console.log("压缩一张照片成功:"+event.target); 
			upload(picType,appSessionIdInfo);
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
						
function appendFile(p, fileSrc) {
	files.push({
		name: "img" + index, //这个值服务器会用到，作为file的key 					
		path: p,					
		fileSrc: fileSrc				,
	});				
	index++;			
}
//上传文件
function upload(picType,appSessionIdInfo) {
	mui.showLoading("上传中,请稍后...","div");
	var url = "";
	if(picType == 9){
		url = path1 + "/uploadPic/uploadImageForHead?appSessionIdInfo="+appSessionIdInfo;
	}else{
		url = path1 + "/uploadPic/uploadPicForApp?appSessionIdInfo="+appSessionIdInfo;
	}
	console.log("上传照片=="+url);
	var task = plus.uploader.createUpload(url, {
			method: "POST"
		},
		function(t, status) {
			mui.hideLoading();
			if (status == 200) {
				//$("#imgDiv").find(".a-add").remove();
				console.log("上传成功，状态码=="+status+",t=="+JSON.stringify(t));
				files = [];
				index = 1;
				var rCode = JSON.parse(eval(t).responseText).code;
				var rPicName = JSON.parse(eval(t).responseText).picName;
				var rMsg = JSON.parse(eval(t).responseText).msg;
				/* console.log(rCode);
				console.log(rPicName);
				console.log(rMsg); */
				if(picType == '9'){
					if(rCode=='0'){
						mui.alert(rMsg);
						$("#imgInfo").attr("src",path1+"/uploadPic/showPic?pictureName="+rPicName+"&appSessionIdInfo="+appSessionIdInfo);
					}else{
						mui.alert(rMsg);
					}
				}else{
					console.log("危险啊");
				}
				
			} else {
				console.log("请求失败，状态码=="+status);
				files = [];
			}
		}
	);
	//添加其他参数
	for (var i = 0; i < files.length; i++) {
		var f = files[i];
		task.addFile(f.path, {
			key: f.name
		});
	}
	if(picType != 9){// 9代表是头像照片  反之代表的是各个检修类型的照片
		task.addData("pictureType", picType);
		task.addData("taskId", picType);
		task.addData("menuId", picType);
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


//选择弹出选项
function funshow() {
	var param = mui("#supplier")[0].value == null ? "" : mui("#supplier")[0].value;
	var urlType = 'InitData/GetSupplier';
	var params = new Array("supplier", "supplierId");
	//下拉控件
	app.selections(urlType, param, params);

}
//urlType 后台请求路径 param用户输入参数模糊查询 params 下拉列表显示ID和Name 得元素得ID
/* {
    "code": 200,
    "data": [
        {
            "text": "半成品库",
            "value": 185
        }
    ],
    "Info": "响应成功"
} */
app.selections = function(urlType, param, params) {
	mui.ajax({
		url: app.serverUrl+urlType,
		dataType: 'json', //服务器返回json格式数据
		timeout: 8000,
		data: {
			name: param
		},
		beforeSend: function() {
			plus.nativeUI.showWaiting('查询中...', {
				back: "none"
			});
		},
		complete: function() {
			plus.nativeUI.closeWaiting();
		},
		success: function(data) {
			if(data.code==200){
				if(data.data.length>0){
					var picker = new mui.PopPicker();
					picker.setData(data.data);
					picker.show(function(selectItems) {
						mui("#" + params[0])[0].value = selectItems[0].text;
						mui("#" + params[1])[0].value = selectItems[0].value;
					});
				}else{
					mui.toast("提示: 没有查询到数据~");
				}
			}							
		},
		error: function(xhr, type, errorThrown) {
			//app.ajaxStatus(xhr, type, errorThrown);
		}
	});
};
