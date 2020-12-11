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
	}, 300);
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
	console.log("查询运用信息列表=="+url);
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
					 html = html + '<table style="width: 96%;text-align: left;font-size:0.8rem;">';
					 html = html + "<tr><td style='width:20%;'>车辆类型：</td><td style='width:20%;'>"+dataInfo[v].trainTypeName+"</td>";
					 html = html + "<td style='width:20%;'>车辆型号：</td><td style='width:20%;'>"+dataInfo[v].trainModelInfo+"</td>";
					 html = html + "<td style='width:20%;text-align: left;'rowspan=2>";
					 if(dataInfo[v].taskStatus == '1'){
						 html = html + "<img src='../images/daiTiJao.png' style='width:50px;height:50px;'>";
					 }else if(dataInfo[v].taskStatus == '2'){
						 html = html + "<img src='../images/success-1.png' style='width:50px;height:50px;'>";
					 }else if(dataInfo[v].taskStatus == '3'){
						 html = html + "<img src='../images/refuse-1.png' style='width:50px;height:50px;'>";
					 }else if(dataInfo[v].taskStatus == '4'){
						 html = html + "<img src='../images/shenHeZhong-1.png' style='width:50px;height:50px;'>";
					 }
					 
					 html = html + "</td></tr>";
					 html = html + "<tr><td>车辆编号：</td><td>"+dataInfo[v].trainNo+"</td>";
					 html = html + "<td>创建时间：</td><td>"+Format(dataInfo[v].createTime,"yyyy-MM-dd")+"</td></tr>";
					 html = html + '</tr></table></a>';
					 html = html + '</li>';
				 }
				 //if(totalPageForYunYong==0){
					 if(count%limitForYunYong==0){
						totalPageForYunYong = count/limitForYunYong; 
						if(totalPageForYunYong == 0){
							totalPageForYunYong = 1;
						}
					 }else{
						 totalPageForYunYong = parseInt(count/limitForYunYong)+1
					 }
				 //}
				 if(totalPageForYunYong == pageNumV){
						that1.endPullUpToRefresh(true);
						pageNumForYunYong = 1;
				 }else{
					 that1.endPullUpToRefresh(false);
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
		 },
		 error:function(xhr,type,errorThrown){
		 	mui.hideLoading();
		 	if(type=='timeout'){
		 		mui.alert('链接服务器超时，请排查网络或者请求地址是否正确！');
		 	}else{
		 		mui.alert('请求失败');
		 	}
		 }
	}); 
}


//创建运转主任务
document.getElementById("addForYunYong").addEventListener('tap',function() {
	var id = generateUUID()+"-messageAdd";
	mui.openWindow({
		url: '../childPage/train_use_main_task.html',
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
		createNew:false
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
		createNew:false
	  });
})
/********运用管理部分的js end*******/