document.getElementById("start_date").addEventListener('tap', function() {
	var _self = this;
	if(_self.picker) {
		_self.picker.show(function (rs) {
			$("#start_date").val(rs.text+":00");
			_self.picker.dispose();
			_self.picker = null;
		});
	} else {
		var optionsJson = this.getAttribute('data-options') || '{}';
		var options = JSON.parse(optionsJson);
		var id = this.getAttribute('id');
		_self.picker = new mui.DtPicker(options);
		_self.picker.show(function(rs) {
			$("#start_date").val(rs.text+":00");
			_self.picker.dispose();
			_self.picker = null;
		});
	}
	
}, false);
document.getElementById("end_date").addEventListener('tap', function() {
	var _self = this;
	if(_self.picker) {
		_self.picker.show(function (rs) {
			$("#end_date").val(rs.text+":00");
			_self.picker.dispose();
			_self.picker = null;
		});
	} else {
		var optionsJson = this.getAttribute('data-options') || '{}';
		var options = JSON.parse(optionsJson);
		var id = this.getAttribute('id');
		_self.picker = new mui.DtPicker(options);
		_self.picker.show(function(rs) {
			$("#end_date").val(rs.text+":00");
			_self.picker.dispose();
			_self.picker = null;
		});
	}
	
}, false);
/* 			//日期选择  另外一种时间选择控件
document.getElementById("start_date").addEventListener('tap',function() {
	getDate('start_date');
});
document.getElementById("end_date").addEventListener('tap',function() {
	getDate('end_date');
});
//获取文本框中的值
var start_date = $('#start_date').val();
var end_date = $('#end_date').val();
//日期js控件
function getDate(obj) {
	var dDate = new Date();
	//设置当前日期（不设置默认当前日期）
	dDate.setFullYear(dDate.getFullYear(), dDate.getMonth(), dDate.getDate());
	var minDate = new Date();
	//最小时间
	minDate.setFullYear(1900, 0, 1);
	var maxDate = new Date();
	//最大时间
	maxDate.setFullYear(3000, 12, 31);
	plus.nativeUI.pickDate(function(e) {
		var d = e.date;
		var objData = d.getFullYear() + "-" + (d.getMonth() < 9 ? '0': '') + (d.getMonth() + 1) + "-" + (d.getDate() < 10 ? '0': '') + d.getDate();
		pickTime(obj, objData);
	},
	function(e) {
		console.log("您没有选择日期");
	},
	{
		title: '请选择日期',
		date: dDate,
		minDate: minDate,
		maxDate: maxDate
	});
}
function pickTime(obj, objData) {
	plus.nativeUI.pickTime(function(e) {
		var d = e.date;
		console.log("选择的时间：" + d.getHours() + ":" + d.getMinutes());
		document.getElementById(obj).value = objData + " " + (d.getHours() < 10 ? '0': '') + d.getHours() + ":" + (d.getMinutes() < 10 ? '0': '') + d.getMinutes() + ":" + (d.getSeconds() < 10 ? '0': '') + d.getSeconds();

	},
	function(e) {
		console.log("未选择时间：" + e.message);
	});
} */
			
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
