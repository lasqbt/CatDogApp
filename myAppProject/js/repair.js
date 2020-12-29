/********检修管理部分的js start*******/
var pageNumForRepair = 1;
var limitForRepair = 10;
var totalPageForRepair = 0;
var msgIsQueryForRepair = false;
var that0 = null;
document.getElementById("start_date_Repair").addEventListener('tap', function() {
	var _self = this;
	if(_self.picker) {
		_self.picker.show(function (rs) {
			$("#start_date_Repair").val(rs.text+":00");
			_self.picker.dispose();
			_self.picker = null;
		});
	} else {
		var optionsJson = this.getAttribute('data-options') || '{}';
		var options = JSON.parse(optionsJson);
		var id = this.getAttribute('id');
		_self.picker = new mui.DtPicker(options);
		_self.picker.show(function(rs) {
			$("#start_date_Repair").val(rs.text+":00");
			_self.picker.dispose();
			_self.picker = null;
		});
	}
	
}, false);
document.getElementById("end_date_Repair").addEventListener('tap', function() {
	var _self = this;
	if(_self.picker) {
		_self.picker.show(function (rs) {
			$("#end_date_Repair").val(rs.text+":00");
			_self.picker.dispose();
			_self.picker = null;
		});
	} else {
		var optionsJson = this.getAttribute('data-options') || '{}';
		var options = JSON.parse(optionsJson);
		var id = this.getAttribute('id');
		_self.picker = new mui.DtPicker(options);
		_self.picker.show(function(rs) {
			$("#end_date_Repair").val(rs.text+":00");
			_self.picker.dispose();
			_self.picker = null;
		});
	}
	
}, false);

function pulluploadingForRepair(self){
	 console.log("检修管理之上拉加载数据"+msgIsQueryForRepair);
	 that0 = self;
	 if(msgIsQueryForRepair){
		 if(pageNumForRepair == 1){
			 pageNumForRepair = pageNumForRepair+1;
		 }
		getRepairInfo(0,pageNumForRepair,limitForRepair);			 
	 }else{
		getRepairInfo(0,pageNumForRepair,limitForRepair);
	}
	/* if(totalPageForRepair == pageNumForRepair){
		self.endPullUpToRefresh(true);
	}else{
		self.endPullUpToRefresh(false);
	} */
 } 

//监听自定义事件，用于子页面向父页面进行传值  子页面：jieShouRen.html
window.addEventListener("createRepairAfterQueryInfo", function(e) {
	console.log("创建检修任务主信息后，触发主页面的信息管理页面刷新操作");
	setTimeout(function(){
		//执行新的查询操作
		getRepairInfo(1,1,limitForRepair);
	}, 300);
});


//搜索
document.getElementById("searchForRepair").addEventListener('tap',function() {
	console.log("检修管理之搜索查询");
	totalPageForRepair = 0;
	getRepairInfo(1,1,limitForRepair);
});

function getRepairInfo(flag,pageNumV,limitV){
	console.log(pageNumV+"===="+limitV);
	var taskStatus = $("#taskStatus").val();
	var trainNo = $("#trainNo").val();
	var startTime = $("#start_date_Repair").val();
	var endTime = $("#end_date_Repair").val();
	var taskType = $("#taskType").val();
	//console.log(taskStatus+"="+trainNo+"="+startTime+"="+endTime);
	var url = path1+"/task/getRepairTaskDataListByPage";
	var appSessionIdInfo = localStorage.getItem("appSessionIdInfo");
	var uid = JSON.parse(localStorage.getItem("userInfo")).userid;
	console.log("查询检修信息列表=="+url);
	if(flag == 1){
		//显示遮罩层
		mui.showLoading("查询中,请稍后...","div");
		// 重新激活上拉加载 下拉刷新操作
		that0.refresh(true);
		mui("#refreshContainerForRepair").scroll().scrollTo(1,1);
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
			 taskType:taskType,
			 appSessionIdInfo:appSessionIdInfo
		 },
		 success: function(data){
			 if(flag == 1){
				 //关闭遮罩层
				mui.hideLoading();
				// 清空操作
				$("#ulInfoForRepair").empty();
			 }else{
				 msgIsQueryForRepair = true;
			 }
			 if(data.code == 1){
				 mui.toast(data.msg);
			 }else{
				 var html = "";
				 var dataInfo = data.data;
				 var count = data.count;
				 for(var v=0; v<dataInfo.length;v++){
					html = html + '<li class="mui-table-view-cell liCss" id='+dataInfo[v].id+'>';
					html = html + '<div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red">编辑</a></div>';
					html = html + '<div class="mui-slider-handle" style="background:none;width:380px">';
					html = html + '<a href="javascript:void(0)" class="mui-navigate-right" style="color: #929292;font-size: 1rem;">';
					html = html + '<table style="width: 96%;text-align: left;font-size:0.8rem;">';
					html = html + "<tr><td style='width:20%;'>车辆类型：</td><td style='width:20%;'>"+dataInfo[v].trainTypeName+"</td>";
					html = html + "<td style='width:20%;'>车辆型号：</td><td style='width:20%;'>"+dataInfo[v].trainModelInfo+"</td>";
					html = html + "<td style='width:20%;text-align: left;'rowspan=3>";
					if(dataInfo[v].taskStatus == '1'){
						html = html + "<img src='../images/daiTiJao.png' style='width:50px;height:50px;'>";
					}else if(dataInfo[v].taskStatus == '2'){
						html = html + "<img src='../images/success-2.png' style='width:50px;height:50px;'>";
					}else if(dataInfo[v].taskStatus == '3'){
						html = html + "<img src='../images/refuse-2.png' style='width:50px;height:50px;'>";
					}else if(dataInfo[v].taskStatus == '4'){
						html = html + "<img src='../images/shenHeZhong-2.png' style='width:50px;height:50px;'>";
					}
					html = html + "</td></tr>";
					html = html + "<tr><td>车辆编号：</td><td>"+dataInfo[v].trainNo+"</td>";
					html = html + "<td>创建时间：</td><td>"+Format(dataInfo[v].createTime,"yyyy-MM-dd")+"</td></tr>";
					if(dataInfo[v].taskType == '1'){
						html = html + '<tr><td>检修类型：</td><td colspan="2">日常检修</td>';
					}else if(dataInfo[v].taskType == '2'){
						html = html + '<tr><td>检修类型：</td><td colspan="2">定期检修</td>';
					}
					html = html + '<td><input type="hidden" id="'+dataInfo[v].id+'hidden" value="'+dataInfo[v].remark1+';'+dataInfo[v].taskType+';'+dataInfo[v].taskStatus+'"></td></tr>';
					html = html + '</table></a>';
					html = html + '</li>';
				 }
				 //if(totalPageForRepair==0){
					 if(count%limitForRepair==0){
						totalPageForRepair = count/limitForRepair; 
						if(totalPageForRepair == 0){
							totalPageForRepair = 1;
						}
					 }else{
						 totalPageForRepair = parseInt(count/limitForRepair)+1
					 }
				 //}
				 if(totalPageForRepair == pageNumV){
						that0.endPullUpToRefresh(true);
						pageNumForRepair = 1;
				 }else{
					 that0.endPullUpToRefresh(false);
					 if(totalPageForRepair<pageNumV){
						 pageNumForRepair = 1;
					 }else{
						if(flag!=1){
							pageNumForRepair = pageNumForRepair + 1; 
						} 
					 }
				 }
				 $("#ulInfoForRepair").append(html);
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


//创建检修主任务
document.getElementById("addForRepair").addEventListener('tap',function() {
	var id = generateUUID()+"-addDayRepairTask";
	mui.openWindow({
		url: '../childPage/day_repair_main_task.html',
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


////右滑不需要点击删除自动触发弹出确认框
//$('#ulInfo').on('slideleft', '.mui-table-view-cell', function(event) {
//右滑点击编辑
$('#ulInfoForRepair').on('tap', '.mui-btn', function(event) {
	var elem = this;
	var li = elem.parentNode.parentNode;
	var taskId = li.id;
	var paramsArr = $("#"+taskId+"hidden").val().split(";");
	var id = generateUUID()+"-modifyDayRepairTask";
	mui.openWindow({
		url: '../childPage/day_repair_main_task_modify.html',
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
		extras:{
			trainId:paramsArr[0],
			taskTypeId:paramsArr[1],
			taskId:taskId
		},
		createNew:false
	});

});
		
mui('#ulInfoForRepair').on('tap','li',function(v){
	  var taskId = this.id;
	  console.log("点击的主任务信息主键ID："+taskId);
	  var id = generateUUID()+"-dayRepairTableDetail";
	  
	  var idInfo= taskId+"hidden";
	  var arr = $("#"+idInfo).val().split(";");
	  mui.openWindow({
		url: '../childPage/day_repair_main_task_detail.html',
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
			taskId: taskId,
			taskStatus:arr[2]
		},
		createNew:false
	  });
})
/********检修管理部分的js end*******/