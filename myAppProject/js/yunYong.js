/********运用管理部分的js start*******/
var pageNumForYunYong = 1;
var limitForYunYong = 10;
var totalPageForYunYong = 0;
var msgIsQueryForYunYong = false;
var that1 = null;
document.getElementById("start_date_yun_yong").addEventListener('tap', function() {
	var _self = this;
	if(_self.picker) {
		_self.picker.show(function (rs) {
			$("#start_date_yun_yong").val(rs.text+":00");
			_self.picker.dispose();
			_self.picker = null;
		});
	} else {
		var optionsJson = this.getAttribute('data-options') || '{}';
		var options = JSON.parse(optionsJson);
		var id = this.getAttribute('id');
		_self.picker = new mui.DtPicker(options);
		_self.picker.show(function(rs) {
			$("#start_date_yun_yong").val(rs.text+":00");
			_self.picker.dispose();
			_self.picker = null;
		});
	}
	
}, false);
document.getElementById("end_date_yun_yong").addEventListener('tap', function() {
	var _self = this;
	if(_self.picker) {
		_self.picker.show(function (rs) {
			$("#end_date_yun_yong").val(rs.text+":00");
			_self.picker.dispose();
			_self.picker = null;
		});
	} else {
		var optionsJson = this.getAttribute('data-options') || '{}';
		var options = JSON.parse(optionsJson);
		var id = this.getAttribute('id');
		_self.picker = new mui.DtPicker(options);
		_self.picker.show(function(rs) {
			$("#end_date_yun_yong").val(rs.text+":00");
			_self.picker.dispose();
			_self.picker = null;
		});
	}
	
}, false);

function pulluploadingForYunYong(self){
	 console.log("运用管理之上拉加载数据"+msgIsQueryForYunYong);
	 that1 = self;
	 if(msgIsQueryForYunYong){
		 if(pageNumForYunYong == 1){
			 pageNumForYunYong = pageNumForYunYong+1;
		 }
		getYunYongInfo(0,pageNumForYunYong,limitForYunYong);			 
	 }else{
		getYunYongInfo(0,pageNumForYunYong,limitForYunYong);
	}
	/* if(totalPageForYunYong == pageNumForYunYong){
		self.endPullUpToRefresh(true);
	}else{
		self.endPullUpToRefresh(false);
	} */
 } 

//监听自定义事件，用于子页面向父页面进行传值  子页面：jieShouRen.html
window.addEventListener("createYunYongAfterQueryInfo", function(e) {
	console.log("发送完毕信息后，触发主页面的信息管理页面刷新操作");
	setTimeout(function(){
		//执行新的查询操作
		getYunYongInfo(1,1,limitForYunYong);
		
	}, 800);
});


//搜索
document.getElementById("searchForYunYong").addEventListener('tap',function() {
	console.log("运用管理之搜索查询");
	totalPageForYunYong = 0;
	getYunYongInfo(1,1,limitForYunYong);
});

function getYunYongInfo(flag,pageNumV,limitV){
	console.log(pageNumV+"===="+limitV);
	var taskStatus = $("#taskStatus").val();
	var trainNo = $("#trainNo").val();
	var startTime = $("#start_date_yun_yong").val();
	var endTime = $("#end_date_yun_yong").val();
	//console.log(taskStatus+"="+trainNo+"="+startTime+"="+endTime);
	var url = path1+"/trainUse/getTrainUseInfoDataListByPage";
	var appSessionIdInfo = localStorage.getItem("appSessionIdInfo");
	var uid = JSON.parse(localStorage.getItem("userInfo")).userid;
	if(flag == 1){
		//显示遮罩层
		mui.showLoading("查询中,请稍后...","div");
		// 重新激活上拉加载 下拉刷新操作
		that1.refresh(true);
		mui("#refreshContainerForYunYong").scroll().scrollTo(1,1);
	}
	mui.ajax(url, {
		 type: "get",
		 dataType: "json",
		 data:{
			 taskStatus:taskStatus,
			 trainNo:trainNo,
			 startTime:startTime,
			 endTime:endTime,
			 page:pageNumV,
			 limit:limitV,
			 appSessionIdInfo:appSessionIdInfo
		 },
		 success: function(data){
			 if(flag == 1){
				 //关闭遮罩层
				mui.hideLoading();
				// 清空操作
				$("#ulInfoForYunYong").empty();
			 }else{
				 msgIsQueryForYunYong = true;
			 }
			 if(data.code == 1){
				 mui.toast(data.msg);
			 }else{
				 var html = "";
				 var dataInfo = data.data;
				 var count = data.count;
				 for(var v=0; v<dataInfo.length;v++){
					 html = html + '<li class="mui-table-view-cell liCss" id='+dataInfo[v].id+'>';
					 html = html + '<div class="mui-slider-handle" style="background:none;width:380px">';
					 html = html + '<a href="javascript:void(0)" class="mui-navigate-right" style="color: #929292;font-size: 1rem;">';
					 html = html + '<table style="width: 96%;text-align: left;">';
					 html = html + "<tr><td style='width:20%;font-size:0.8rem;'>车辆类型：</td><td style='width:20%;font-size:0.8rem;'>"+dataInfo[v].trainTypeName+"</td>";
					 html = html + "<td style='width:20%;font-size:0.8rem;'>车辆型号：</td><td style='width:20%;font-size:0.8rem;'>"+dataInfo[v].trainModelInfo+"</td>";
					 html = html + "<td style='width:20%;font-size:0.8rem;text-align: center;'rowspan=2><div style='border-radius:50%;border: 1px solid #929292;width:50px;font-size:0.6rem;height:50px;margin:0 auto;text-align:center;padding:5.5%;'>";
					 html = html + "<div style='border-radius:50%;border: 1px dashed #929292;width:40px;font-size:0.6rem;height:40px;line-height: 40px;'>"+taskStatusToCN(dataInfo[v].taskStatus)+"</div>";
					 html = html + "</div></td></tr>";
					 html = html + "<tr><td style='width:20%;font-size:0.8rem;'>车辆编号：</td><td style='width:20%;font-size:0.8rem;'>"+dataInfo[v].trainNo+"</td>";
					 html = html + "<td style='width:20%;font-size:0.8rem;'>创建时间：</td><td style='width:20%;font-size:0.8rem;'>"+Format(dataInfo[v].createTime,"yyyy-MM-dd")+"</td></tr>";
					 html = html + '</a></div>';
					 html = html + '</tr></table></a>';
					 html = html + '</li>';
				 }
				 if(totalPageForYunYong==0){
					 if(count%limitForYunYong==0){
						totalPageForYunYong = count/limitForYunYong; 
					 }else{
						 totalPageForYunYong = parseInt(count/limitForYunYong)+1
					 }
				 }
				 if(totalPageForYunYong == pageNumV){
						that1.endPullUpToRefresh(true);
						pageNumForYunYong = 1;
				 }else{
					 that1.endPullUpToRefresh(true);
					 if(totalPageForYunYong<pageNumV){
						 pageNumForYunYong = 1;
					 }else{
						if(flag!=1){
							pageNumForYunYong = pageNumForYunYong + 1; 
						} 
					 }
				 }
				 $("#ulInfoForYunYong").append(html);
			 }
		 }
	}); 
}


//发送消息
document.getElementById("addForYunYong").addEventListener('tap',function() {
	var id = generateUUID()+"-messageAdd";
	mui.openWindow({
		url: '../childPage/messageAdd.html',
		id: id,
		show: {
			aniShow: 'pop-in'
		},
		styles: {
			popGesture: 'hide'
		},
		waiting: {
			autoShow: false
		},
		createNew:true
	});
});
		
mui('#ulInfoForYunYong').on('tap','li',function(v){
	  var msgId = this.id;
	  console.log("点击的信息主键ID："+msgId);
	  var id = generateUUID()+"-messageDetail";
	  mui.openWindow({
		url: '../childPage/messageDetail.html',
		id: id,
		show: {
			aniShow: 'pop-in'
		},
		styles: {
			popGesture: 'hide'
		},
		waiting: {
			autoShow: false
		},
		extras: {
			msgId: msgId
		},
		createNew:true
	  });
})
/********运用管理部分的js end*******/