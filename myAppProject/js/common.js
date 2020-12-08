/**/
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
