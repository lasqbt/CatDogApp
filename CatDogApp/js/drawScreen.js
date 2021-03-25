/*
	参数说明：
	参数名	    类型         说明	            				默认值			是否必选
	successCB |  Function  | 成功回调函数					|				|	Y
	errorCB	  |  Function  | 失败,回调函数					|	Function	|	
	fileName  |  String    | 文件名,不需后缀名				|	当前时间戳	|	
	imgID     |  String    | 原生图片ID						|	当前时间戳	|	
	overwrite |  Boolean   | 是否覆盖						|	true		|	
	format    |  String    | 保存的格式						|	PNG			|	
	quality   |  Number    | 保存质量,1-100,1最低,100最高	|	50			|	
	clip      |  Object    | 指定截屏区域					|	{top:’0px’,left:’0px’,width:’100%’,height:’100%’}	
*/
 
var drawScreen = function(options) {
	var flag = false;
	options = {
		successCB: options.successCB || function() {},
		errorCB: options.errorCB || function() {},
		fileName: options.fileName || Date.parse(new Date()),
		imgID: options.imgID || String(Date.parse(new Date())),
		overwrite: options.overwrite || true,
		format: options.format || 'jpg',
		quality: options.quality || 50,
		clip: options.clip || {
			top: '0px',
			left: '0px',
			width: '100%',
			height: '100%'
		}
	}
	var self = plus.webview.currentWebview();
	var bitmap = new plus.nativeObj.Bitmap(options.imgID);
 
	//绘制截图
	self.draw(bitmap, function() {
		// 保存Bitmap图片
		bitmap.save('_doc/' + options.fileName + '.' + options.format, {
			overwrite: options.overwrite,
			format: options.format,
			quality: options.quality,
			clip: options.clip	//iOS机型，bitmap.save时，clip的top参数无效，但在self.draw时，是有效的。
		}, function(i) {
			//销毁Bitmap图片
			// bitmap.clear();
			// options.successCB({
			// 	success: 'success',
			// 	details: i.target
			// });
			//保存到系统相册
			plus.gallery.save(i.target, function(d) {
				//销毁Bitmap图片
				bitmap.clear();
				options.successCB({
					success: 'success',
					details: d
				});
				mui.toast("截图成功保存到相册！");
			}, function(e) {
				//销毁Bitmap图片
				bitmap.clear();
				options.errorCB({
					error: 'fail',
					details: e
				});
				mui.toast("截图保存到相册失败！")
			});
		}, function(e) {
			// bitmap.clear();
			// options.errorCB({
			// 	error: 'fail',
			// 	details: e
			// });
		});
 
	}, function(e) {
		options.errorCB({
			error: '截屏绘制失败',
			details: e
		});
	},{
		clip: options.clip //绘制截图时，设置clip，解决iOS机型下clip-top无效bug
	});
}