/********我的部分的js start*******/
mui('#ulInfoForWoDe').on('tap','li',function(v){
	  var clickId = this.id;
	  console.log("点击的信息主键ID："+clickId);
	  if(clickId == 'ipSet'){
		  mui.prompt('IP设置，只针对本手机APP有效！','格式：xxx.xxx.xxx.xxx','提升',['确定','取消'],function(e) {
		  	if (e.index == 1) {
		  		console.log("点击了取消");
		  	} else {
		  		console.log(e.value);
				if(isValidIP(e.value)){
					path1="http://"+e.value+":8086";
					path2="http://"+e.value+":8085";
					mui.alert("设置IP成功");
				}else{
					mui.alert("无效的IP格式");
				}
		  	}
		  })
	  }else if(clickId == 'clearCooKie'){
		  mui.confirm('清除缓存后，你需要重新登录！确认现在开始清除吗？', '提示',['好的','不'], function(e) {
		  	if (e.index == 1) {
		  		console.log("点击了不");
		  	} else {
		  		console.log("点击了好的");
				mui.showLoading("清除中,请稍后...","div");
				localStorage.clear();
				mui.hideLoading();
				var id = generateUUID()+"-login";
				mui.openWindow({
					url: '/login.html',
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
		  	}
		  })
	  		  
	  }else if(clickId == 'versionInfo'){
		  var oldVersion = parseFloat(version);
		  mui.confirm('当前版本号：'+ version, '提示', ['检查更新','取消'], function(e) {
			if (e.index == 0) {
				var url = path2+"/version/getTheNewVersionInfo";
				console.log("获取版本号=="+url);
				var appSessionIdInfo = localStorage.getItem("appSessionIdInfo");
				mui.showLoading("检测中,请稍后...","div"); 
				mui.ajax(url,{
					data:{
							 appSessionIdInfo:appSessionIdInfo
						},
					async:true,
					dataType:'json',   
					type:'get',
					success:function(data){
						mui.hideLoading();
						if(data.code=='0'){
							var newVersion = parseFloat(data.versionInfo);
							if(newVersion>oldVersion){
								mui.alert("新版本已经发布，可以卸载并更新，功能开发中...");
							}else{
								mui.alert("当前安装的已经是最新版本！无需更新");
							}
						}else{
							mui.alert(data.msg);
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
			}else{
				console.log("点击了不")
			}
		  });
	  }
})

//退出登录
document.getElementById("logout").addEventListener('tap',function() {
	mui.confirm('确认退出登录吗？', '提示', ['确定','取消'], function(e) {
		if (e.index == 0) {
			var url = path1+"/logoutForApp";
			var appSessionIdInfo = localStorage.getItem("appSessionIdInfo");
			console.log("退出登录=="+url);
			mui.showLoading("退出中,请稍后...","div"); 
			mui.ajax(url,{
				data:{
						 appSessionIdInfo:appSessionIdInfo
					},
				async:true,
				dataType:'json',   
				type:'post',
				timeout:5000,
				success:function(data){
					mui.hideLoading();
					if(data.code=='0'){
						var id = generateUUID()+"-login";
						mui.openWindow({
							url: '/login.html',
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
					}else{
						mui.alert(data.msg);
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
		}else{
			console.log("点击了不退出")
		}
	});
});
/********我的部分的js end*******/