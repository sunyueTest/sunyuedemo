//pc端域名
var basePath;
//微信端域名
var wxUrl;
$(function(){
	basePath=$("#siteUrl").val();
	wxUrl=$("#wxUrl").val();
});

$(function()
{
	$(document).on("click", ".new-zutai-navA", function(e)
	{
		e.preventDefault();//阻止浏览器默认事件
		var $a = $(e.currentTarget);
		var href = $a.attr("href");
		if(!/^#/.test(href)) return;
		if($a.hasClass("new-zutai-navB")) return;
		$(".new-zutai-navB").removeClass("new-zutai-navB");
		$a.addClass("new-zutai-navB");
		$(".new-zutai-show").removeClass("new-zutai-show");
		$(href).addClass("new-zutai-show");
		
	});
	/**分享**/
	$(document).on("click", ".new-share", function()
	{
		var link=$(this).parent().find("._link").val();
		var url=basePath+"/page/"+link;
		$("#erweimaDiv").html('');
		$("#erweimaDiv").qrcode(url);
		var appSuffix=$(this).parent().find("._appSuffix").val();
		if(appSuffix){
			url=basePath+"/page/"+appSuffix;
		}
		$("#erweimaUrl").val(url);
		
		url=wxUrl+"/wxpage/"+link;
		$("#bindErweimaDiv").html('');
		$("#bindErweimaDiv").qrcode(url);
		if(appSuffix){
			url=wxUrl+"/wxpage/"+appSuffix;
		}
		$("#bindErweimaUrl").val(url);
		
		$("#newModalF").modal('show');
	});
	//关闭新增框
	$(document).on("click", "#newhidezutai, #new-name-none", function()
	{
		$("#new-addZutai").hide();
	});
	//关闭设置框
	$(document).on("click", "#newhidezutaiSet, #new-name-none-set", function()
	{
		$("#new-setZutai").hide();
	});
	//打开模态框
	var $image = $('#newZUTAI');
	var new_scaleX;
	var new_scaleY;
	var $dataHeight = $('#dataHeight');
	var $dataWidth = $('#dataWidth');
	var URL = window.URL || window.webkitURL;
	var originalImageURL = $image.attr('src');
	var uploadedImageName = 'cropped.jpg';//默认下载图片名称
	var uploadedImageType = 'image/jpeg';
	var uploadedImageURL;
	var options;
	var $download = $('#uploadDown');
	var opw;
	var oph;
	//打开图像裁剪程序
	$('#newModal').on('shown.bs.modal', function(e)
	{
		options =  
		{
			minContainerWidth:900,
			minContainerHeight:500,
			aspectRatio:1.372881355932203,
			preview:'#uploadpreview',
			crop:function(e)
			{
				//console.log(e.detail.x);
				//console.log(e.detail.y);
				//console.log(e.detail.width);
				//console.log(e.detail.height);
				//console.log(e.detail.rotate);
				//console.log(e.detail.scaleX);
				//console.log(e.detail.scaleY);
				$dataHeight.val(Math.round(e.detail.height));
				$dataWidth.val(Math.round(e.detail.width));
				opw = Math.round(e.detail.width);
				oph = Math.round(e.detail.height);
				new_scaleX = e.detail.scaleX;
				new_scaleY = e.detail.scaleY;
			}
		};
		$image.on(
		{
			ready: function (e) {
			  //console.log(e.type);
			},
			cropstart: function (e) {
			 // console.log(e.type, e.detail.action);
			},
			cropmove: function (e) {
			  //console.log(e.type, e.detail.action);
			},
			cropend: function (e) {
			 //console.log(e.type, e.detail.action);
			},
			crop: function (e) {
			 // console.log(e.type);
			},
			zoom: function (e) {
			 // console.log(e.type, e.detail.ratio);
			}
		}).cropper(options);
	});
	//关闭模态框终止裁剪
	$('#newModal').on('hidden.bs.modal', function(e){
		$('#Cutting').cropper("destroy");
	});
	//选择移动
	$(document).on("click", "#uploadMove", function()
	{
		$image.cropper("setDragMode","move");
	});
	//选择裁剪
	$(document).on("click", "#uploadCutting", function()
	{
		$image.cropper("setDragMode","crop");
	});
	//放大
	$(document).on("click", "#uploadEnlarge", function()
	{
		$image.cropper("zoom",0.1);
	});
	//缩小
	$(document).on("click", "#uploadNarrow", function()
	{
		$image.cropper("zoom",-0.1);
	});
	//向上移动
	$(document).on("click", "#uploadTop", function()
	{
		$image.cropper("move",0,-1);
	});
	//向下移动
	$(document).on("click", "#uploadBottom", function()
	{
		$image.cropper("move",0,1);
	});
	//向左移动
	$(document).on("click", "#uploadLeft", function()
	{
		$image.cropper("move",-1,0);
	});
	//向右移动
	$(document).on("click", "#uploadRight", function()
	{
		$image.cropper("move",1,0);
	});
	//向左旋转
	$(document).on("click", "#uploadRotateL", function()
	{
		$image.cropper("rotate",-45);
	});
	//向左旋转
	$(document).on("click", "#uploadRotateR", function()
	{
		$image.cropper("rotate",45);
	});
	//上下翻转
	$(document).on("click", "#uploadScaleY", function()
	{
		if(new_scaleY == 1){
			$image.cropper("scaleY",-1);
		}else{
			$image.cropper("scaleY",1);
		}
	});
	//左右翻转
	$(document).on("click", "#uploadScaleX", function()
	{
		if(new_scaleX == 1){
			$image.cropper("scaleX",-1);
		}else{
			$image.cropper("scaleX",1);
		}
	});
	//重置
	$(document).on("click", "#uploadReset", function()
	{
		$image.cropper("reset");
	});
	//选择比例
	$(document).on("click", ".uploadUla", function(e)
	{
		e.preventDefault();//阻止浏览器默认事件
		if(!$(this).hasClass("uploadUlb"))
		{
			var bl = $(this).attr("href");
			$(".uploadUlb").removeClass("uploadUlb");
			$(this).addClass("uploadUlb");
			options["aspectRatio"] = bl;
			$image.cropper('destroy').cropper(options);
		}
	});
	//下载
	$(document).on("click", "#uploadDown", function()
	{
		var result = $image.cropper("getCroppedCanvas",{maxWidth:4096,maxHeight:4096});
		$download.attr('href', result.toDataURL(uploadedImageType));
	});
	//裁剪完成
	$(document).on("click", "#uploadYse", function()
	{
		var result = $image.cropper("getCroppedCanvas",{maxWidth:4096,maxHeight:4096});// 获取裁剪后的base64位编码
		var img    = result.toDataURL(uploadedImageType);
		var imgFile=convertBase64UrlToBlob(img);
		 //创建formdata对象
        var formdata = new FormData();
         //将文件添加到formdata里面
        formdata.append("file",imgFile);
		//上传图片
		$.ajax(
		{
			type:'POST',
			url:basePath+'/uploadYunFile.htm',//图片上传
			data:formdata,
			processData: false,  // 不处理数据
            contentType: false,  // 不设置内容类型
			success: function(data)
			{
				if(data!=null){
					var arr=data.split("`");
					if(arr[0]=="1"){
						$('#type-dialogBox').dialogBox({
							autoHide: true,
							time:2000,
							title:'信息提示',
							hasMask:true,
							content:arr[1]
						});
						return;
					}
					img=arr[1];
					$("#yunSrcLogo").attr("src",img);
					$("#yunLogo").val(img);
					$("#newModal").modal('hide');
				}else{
					$('#type-dialogBox').dialogBox({
						autoHide: true,
						time:2000,
						title:'信息提示',
						hasMask:true,
						content:'请求数据出错,请联系技术支持！'
					});
				}
			},
			error:function()
			{
				$('#type-dialogBox').dialogBox({
					autoHide: true,
					time:2000,
					title:'信息提示',
					hasMask:true,
					content:'请求数据出错,请联系技术支持！'
				});
			}
		});
	});
	//上传img
	var $inputImage = $('#inputImage');
	if(URL)
	{
		$inputImage.change(function()
		{
			var files = this.files;
			var file;
			if(!$image.data('cropper'))
			{
				return;
			}
			if(files && files.length)
			{
				file = files[0];
				if (/^image\/\w+$/.test(file.type))
				{
					var fileSize=file.size/1024;
					if(fileSize>500){
						tooltips("图片大小不能超过500K！","Warning");
						return;
					}
					uploadedImageName = file.name;
					uploadedImageType = file.type;
					if(uploadedImageURL)
					{
						URL.revokeObjectURL(uploadedImageURL);
					}
					uploadedImageURL = URL.createObjectURL(file);
					$image.cropper('destroy').attr('src', uploadedImageURL).cropper($image);
					$inputImage.val('');
					$image.cropper('destroy').cropper(options);//重置条件
				}else
				{
					$('#type-dialogBox').dialogBox({
						autoHide: true,
						time:2000,
						title:'信息提示',
						hasMask:true,
						content:'上传格式错误,上传格式包含.jpg,.jpeg,.png,.gif,.bmp,.tiff'
					});
				}
			}
		});
	}else
	{
		$inputImage.hide().parent().addClass('uploadImgNo');
	}
})


/***************************对接***************************************/
$(function(){
	fanXieGangLimit("#yunSuffix");
	chineseLimit("#yunSuffix");
	pointLimit("#yunSuffix");
	var menu=$("#menu").val();
	// 定义一个新的复制对象
	var clipboard = new ClipboardJS('#copyBt');
    clipboard.on('success', function(e) {
        //console.info('Action:', e.action);
		//console.info('Text:', e.text);
		//console.info('Trigger:', e.trigger);
		alert("复制内容："+e.text);
    });
    clipboard.on('error', function(e) {
        console.log(e);
    });
    
    // 定义一个新的复制对象
 	var bindClipboard = new ClipboardJS('#bindCopyBt');
 	bindClipboard.on('success', function(e) {
         //console.info('Action:', e.action);
 		//console.info('Text:', e.text);
 		//console.info('Trigger:', e.trigger);
 		alert("复制内容："+e.text);
     });
 	bindClipboard.on('error', function(e) {
         console.log(e);
     });
     
	//弹窗
	$("input[name=name]").on("click",function(){
		var val=$(this).val();
		$("input[name=name][value="+val+"]").prop("checked","checked");
		if(val=="1"){	//加密
			$("#yunPassword").removeAttr("disabled");
		}else{
			$("#yunPassword").attr("disabled","disabled");
			$("#yunPassword").val("");
		}
	});
	//下架
	$(".new-down").on("click",function(){
		var link=$(this).parent().find("._link").val();
		$('#type-dialogBox').dialogBox(
		{
			type:'correct',
			autoHide:false,
			zIndex:99999,
			hasMask:true,
			hasClose:true,
			hasBtn:true,
			effect:'sign',
			content:'您确定要下架吗？',
			confirm:function()
			{
				window.location.href=basePath+"/issueYunZutai/"+link+".htm?status=0&fabuFlag=2&menu="+menu;
			},
		});
	});
	//发布
	$(".new-issue").on("click",function(){
		var link=$(this).parent().find("._link").val();
		$('#type-dialogBox').dialogBox(
		{
			type:'correct',
			autoHide:false,
			zIndex:99999,
			hasMask:true,
			hasClose:true,
			hasBtn:true,
			effect:'sign',
			content:'您确定要发布吗？',
			confirm:function()
			{
				window.location.href=basePath+"/issueYunZutai/"+link+".htm?status=1&fabuFlag=1&menu="+menu;
			},
		});
	});
	//新增
	$(document).on("click", "#newAddzutai", function()
	{
		$("#new-name-button").show();
		$("#new-name-button-set").hide();
		//link
		$("#yunLink").val("");
		//logo
		$("#yunSrcLogo").attr("src",basePath+'/images/0.png');
		$("#yunLogo").val("");
		//组态名称
		$("#yunAppName").val("");
		var isLogin=0;
		$("#yunPassword").val("");
		$("#yunPassword").attr("disabled","disabled");
		//是否公开
		$("input[name=name][value="+isLogin+"]").prop("checked","checked");
		//后缀
		$("#yunSuffix").val("");
		$("#new-addZutai").show();
	});
	//设置
	$(".new-setting").on("click",function(){
		$("#new-name-button").hide();
		$("#new-name-button-set").show();
		var link=$(this).parent().find("._link").val();
		$.ajax(
			{
				type:'GET',
				async:true,
				url:basePath+'/queryYunZutaiInfo/'+link+'.htm',
				success: function(data)
				{
					var json=$.parseJSON(data);
					if(json.flag=="00"){
						//link
						$("#yunLink").val(link);
						//logo
						if(json.appicon!=null&&json.appicon!=''){
							$("#yunSrcLogo").attr("src",json.appicon);
							$("#yunLogo").val(json.appicon);
						}else{
							$("#yunSrcLogo").attr("src",basePath+'/images/0.png');
							$("#yunLogo").val("");
						}
						//组态名称
						$("#yunAppName").val(json.appname);
						var isLogin=json.islogin;
						if(isLogin=="1"){
							//密码
							$("#yunPassword").val(json.password);
							$("#yunPassword").removeAttr("disabled");
						}else{
							$("#yunPassword").val("");
							$("#yunPassword").attr("disabled","disabled");
						}
						//是否公开
						$("input[name=name][value="+isLogin+"]").prop("checked","checked");
						//后缀
						$("#yunSuffix").val(json.appSuffix);
						$("#new-addZutai").show();
					}else{
						$('#type-dialogBox').dialogBox({
							autoHide: true,
							time:2000,
							title:'信息提示',
							hasMask:true,
							content:json.msg
						});
					}
				},
				error:function()
				{
					$('#type-dialogBox').dialogBox({
						autoHide: true,
						time:2000,
						title:'信息提示',
						hasMask:true,
						content:'请求出错！请联系技术支持'
					});
				},
			});
	});
	//保存
	$("#new-name-button-set").on("click",function(){
		//应用名称
		var yunAppName=$.trim($("#yunAppName").val());
		if(yunAppName==null||yunAppName==""){
			$('#type-dialogBox').dialogBox({
				autoHide: true,
				time:2000,
				title:'信息提示',
				hasMask:true,
				content:'应用名称不能为空'
			});
			return;
		}
		//是否公开
		var isLogin=$("input[name=name]:checked").val();
		//密码
		var yunPassword="";
		if(isLogin=="1"){
			yunPassword=$.trim($("#yunPassword").val());
			if(yunPassword==null||yunPassword==""){
				$('#type-dialogBox').dialogBox({
					autoHide: true,
					time:2000,
					title:'信息提示',
					hasMask:true,
					content:'密码不能为空'
				});
				return;
			}	
		}
		var flag=true;
		//访问后缀
		var yunSuffix=$.trim($("#yunSuffix").val());
		//获取link
		var link=$("#yunLink").val();
		if(yunSuffix!=null&&yunSuffix!=""){
			//验证后缀名是否唯一
			$.ajax(
			{
				type:'POST',
				async:false,
				url:basePath+'/queryYunZutaiByAppSuffix.htm',
				data:{"appSuffix":yunSuffix,"link":link},
				success: function(data)
				{
					var json=$.parseJSON(data);
					if(json.flag=="00"){
						$('#type-dialogBox').dialogBox({
							autoHide: true,
							time:2000,
							title:'信息提示',
							hasMask:true,
							content:'访问后缀已存在,请重新输入'
						});
						flag=false;
					}
				},
				error:function()
				{
					$('#type-dialogBox').dialogBox({
						autoHide: true,
						time:2000,
						title:'信息提示',
						hasMask:true,
						content:'请求出错，请联系技术支持'
					});
					flag=false;
				},
			});
		}
		if(!flag){
			return;	
		}
		$("#addYunNextForm").attr("action",basePath+"/yunZutaiSet.htm");
		$("#addYunNextForm").removeAttr("target");
		$("#addYunNextForm").submit();
	});
	//删除
	$(".new-del").on("click",function(){
		var link=$(this).parent().find("._link").val();
		$('#type-dialogBox').dialogBox(
		{
			type:'correct',
			autoHide:false,
			zIndex:99999,
			hasMask:true,
			hasClose:true,
			hasBtn:true,
			effect:'sign',
			content:'此操作不可逆，确实要删除吗?',
			confirm:function()
			{
				window.location.href=basePath+"/delYunZutai/"+link+".htm?menu="+menu;
			},
		});
	});
	//新增下一步
	$("#new-name-button").on("click",function(){
		//应用名称
		var yunAppName=$.trim($("#yunAppName").val());
		if(yunAppName==null||yunAppName==""){
			$('#type-dialogBox').dialogBox({
				autoHide: true,
				time:2000,
				title:'信息提示',
				hasMask:true,
				content:'请输入应用名称'
			});
			return;
		}
		//是否公开
		var isLogin=$("input[name=name]:checked").val();
		//密码
		var yunPassword="";
		if(isLogin=="1"){
			yunPassword=$.trim($("#yunPassword").val());
			if(yunPassword==null||yunPassword==""){
				$('#type-dialogBox').dialogBox({
					autoHide: true,
					time:2000,
					title:'信息提示',
					hasMask:true,
					content:'密码不能为空'
				});
				return;
			}	
		}
		var flag=true;
		//访问后缀
		var yunSuffix=$.trim($("#yunSuffix").val());
		if(yunSuffix!=null&&yunSuffix!=""){
			//验证后缀名是否唯一
			$.ajax(
			{
				type:'POST',
				async:false,
				url:basePath+'/queryYunZutaiByAppSuffix.htm',
				data:{"appSuffix":yunSuffix},
				success: function(data)
				{
					var json=$.parseJSON(data);
					if(json.flag=="00"){
						$('#type-dialogBox').dialogBox({
							autoHide: true,
							time:2000,
							title:'信息提示',
							hasMask:true,
							content:'访问后缀已存在,请重新输入'
						});
						flag=false;
					}
				},
				error:function()
				{
					$('#type-dialogBox').dialogBox({
						autoHide: true,
						time:2000,
						title:'信息提示',
						hasMask:true,
						content:'请求出错，请联系技术支持'
					});
					flag=false;
				},
			});
		}
		if(!flag){
			return;	
		}
		$("#addYunNextForm").attr("action",basePath+"/goYunActionPage/0.htm");
		$("#addYunNextForm").attr("target","_blank");
		$("#addYunNextForm").submit();
		setTimeout(function() 
		{
			window.location.reload();
		},1000);
	});
	//本账号复制
	$(".new-copy").on("click", function()
	{
		var link=$(this).parent().find("._link").val();
		$('#type-dialogBox').dialogBox(
		{
			type:'correct',
			autoHide:false,
			zIndex:99999,
			hasMask:true,
			hasClose:true,
			hasBtn:true,
			effect:'sign',
			content:'确认复制该组态吗？',
			confirm:function()
			{
				window.location.href=basePath+"/copyYunZutai/"+link+".htm?menu="+menu;
			}
		});
	});
	//跨账号复制
	$("#new-zutaique").on("click", function()
	{
		var id=$("#newID").val();
		var zutaiUserId=$("#zutaiUserID").val();
		if(id==null||id==""||zutaiUserId==null||zutaiUserId==""){
			$('#type-dialogBox').dialogBox({
				autoHide: true,
				time:2000,
				title:'信息提示',
				hasMask:true,
				content:'应用ID或用户ID必填'
			});
			return;
		}
		$.ajax(
		{
			type:'GET',
			async:false,
			url:basePath+"/crossCopyYunZutai/"+zutaiUserId+"/"+id+".htm",
			success: function(data)
			{
				var json=$.parseJSON(data);
				if(json.flag=="00"){
					window.location.href=basePath+"/goYunZutaiPage.html?m=0&fabuFlag=2&menu="+menu;
				}else{
					var msg=json.msg;
					$('#type-dialogBox').dialogBox({
						autoHide: true,
						time:2000,
						title:'信息提示',
						hasMask:true,
						content:msg
					});
				}
			},
			error:function()
			{
				$('#type-dialogBox').dialogBox({
					autoHide: true,
					time:2000,
					title:'信息提示',
					hasMask:true,
					content:'请求出错，请联系技术支持'
				});
			}
		});
	});
	//新增
	$(document).on("click", "#new-zutaiqu", function()
	{
		$('#newModalcopy').modal('hide');//关闭对话框
	});
	
});

 /**
     * 将以base64的图片url数据转换为Blob
     * @param urlData
     *            用url方式表示的base64图片数据
     */
function convertBase64UrlToBlob(urlData){
    var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob( [ab] , {type : 'image/png'});
}