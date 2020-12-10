/********档案管理部分的js start*******/
var pageNumForDangAn = 1;
var limitForDangAn = 10;
var totalPageForDangAn = 0;
var msgIsQueryForDangAn = false;
var that2 = null;

function pulluploadingForDangAn(self){
	 console.log("档案管理之上拉加载数据"+msgIsQueryForDangAn);
	 that2 = self;
	 if(msgIsQueryForDangAn){
		 if(pageNumForDangAn == 1){
			 pageNumForDangAn = pageNumForDangAn+1;
		 }
		getDangAnInfo(0,pageNumForDangAn,limitForDangAn);			 
	 }else{
		getDangAnInfo(0,pageNumForDangAn,limitForDangAn);
	}
 } 
 
document.getElementById("searchInputForDangAn").addEventListener('input',function(){
	console.log("档案管理之搜索查询");
	totalPageForDangAn = 0;
	getDangAnInfo(1,1,limitForDangAn);
});

function getDangAnInfo(flag,pageNumV,limitV){
	var trainNo = $("#searchInputForDangAn").val();
	//console.log(taskStatus+"="+trainNo+"="+startTime+"="+endTime);
	var url = path1+"/train/getTrainDataListByPage";
	var appSessionIdInfo = localStorage.getItem("appSessionIdInfo");
	var uid = JSON.parse(localStorage.getItem("userInfo")).userid;
	console.log("车辆档案信息列表=="+url);
	if(flag == 1){
		//显示遮罩层
		mui.showLoading("查询中,请稍后...","div");
		// 重新激活上拉加载 下拉刷新操作
		that2.refresh(true);
		mui("#refreshContainerForDangAn").scroll().scrollTo(1,1);
	}
	mui.ajax(url, {
		 type: "get",
		 dataType: "json",
		 data:{
			 trainNo:trainNo,
			 page:pageNumV,
			 limit:limitV,
			 appSessionIdInfo:appSessionIdInfo
		 },
		 success: function(data){
			 if(flag == 1){
				 //关闭遮罩层
				mui.hideLoading();
				// 清空操作
				$("#ulInfoForDangAn").empty();
			 }else{
				 msgIsQueryForDangAn = true;
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
					 html = html + "<tr><td style='width:15%;font-size:0.8rem;'>车辆类型：</td><td style='width:25%;font-size:0.8rem;'>"+dataInfo[v].trainTypeName+"</td>";
					 html = html + "<td style='width:15%;font-size:0.8rem;'>车辆型号：</td><td style='width:25%;font-size:0.8rem;'>"+dataInfo[v].trainModelName+"</td></tr>";
					 html = html + "<tr><td style='width:15%;font-size:0.8rem;'>车辆编号：</td><td style='width:25%;font-size:0.8rem;'>"+dataInfo[v].trainNo+"</td>";
					 html = html + "<td style='width:15%;font-size:0.8rem;'>所属部门：</td><td style='width:25%;font-size:0.8rem;'>"+dataInfo[v].deptName+"</td></tr>";
					 html = html + '</tr></table></a>';
					 html = html + '</li>';
				 }
				 //if(totalPageForDangAn==0){
					 if(count%limitForDangAn==0){
						totalPageForDangAn = count/limitForDangAn; 
						if(totalPageForDangAn == 0){
							totalPageForDangAn = 1;
						}
					 }else{
						 totalPageForDangAn = parseInt(count/limitForDangAn)+1
					 }
				 //}
				 if(totalPageForDangAn == pageNumV){
						that2.endPullUpToRefresh(true);
						pageNumForDangAn = 1;
				 }else{
					 that2.endPullUpToRefresh(false);
					 if(totalPageForDangAn<pageNumV){
						 pageNumForDangAn = 1;
					 }else{
						if(flag!=1){
							pageNumForDangAn = pageNumForDangAn + 1; 
						} 
					 }
				 }
				 $("#ulInfoForDangAn").append(html);
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
		
mui('#ulInfoForDangAn').on('tap','li',function(v){
	  mui.alert("开发中");
	  return false;
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
/********档案管理部分的js end*******/