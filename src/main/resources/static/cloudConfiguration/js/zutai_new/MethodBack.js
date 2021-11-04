/******************************对接**********************************************/
$(function(){
	/*离开、关闭页面触发此事件，有返回值则弹窗，没有返回值则不阻止
	
	$(window).on('beforeunload', function() {
        return "您确定要离开吗？！";
    });*/
	
	fanXieGangLimit(".zutai-suffix");
	chineseLimit(".zutai-suffix");
	pointLimit(".zutai-suffix");

	/******************图片上传********************/
	moreEventFun();
	/*****************设置组态LOGO********************/
	$("#new-name-button").on("click",function(){
		//应用名称
		var yunAppName=$.trim($("#yunAppName").val());
		if(yunAppName==null||yunAppName==""){
			tooltips("请输入应用名称","Warning");
			return;
		}
		//是否公开
		var isLogin=$("input[name=name]:checked").val();
		//用户名，密码
		var yunUserName="",yunPassword="";
		if(isLogin=="1"){
			yunPassword=$.trim($("#yunPassword").val());
			if(yunPassword==null||yunPassword==""){
				tooltips("密码不能为空","Warning");
				return;
			}	
		}
		var flag=true;
		//访问后缀
		var yunSuffix=$.trim($("#yunSuffix").val());
		var id=$("#id").val();
		var link="";
		// if(id!=null&&id!=""){
		// 	link=$("#_link").val();
		// }
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
						tooltips("访问后缀已存在，请重新输入！","Warning");
						flag=false;
					}
				},
				error:function()
				{
					tooltips("请求出错！请联系技术支持","Warning");
					flag=false;
				},
			});
		}
		if(flag){
			$("#appname").val(yunAppName);
			$("#isLogin").val(isLogin);
			/*
			var id=$.trim($("#id").val());
			if(id==null||id==''){	//待发布
				$("#status").val("0");
			}
			*/
			$("#password").val(yunPassword);
			$("#appSuffix").val(yunSuffix);
			$("#nameNav").html(yunAppName);
			$("#new-name").hide();
		}
	});
	/*************************保存*******************************/
	$("#saveYunZutai").on("click",function()
	{
		$("body").append('<div id="editLoading"><div id="addLoading"></div></div>');
		setTimeout(function() 
		{
			$(window).unbind("beforeunload");	//解绑离开页面事件
			$("#previewFlag").val("0");	//保存和预览区分标志
			$("#operateFlag").val("0");	//保存和发布区分标志
			//应用名称
			var appname=$.trim($("#appname").val());
			if(appname==null||appname==""){
				$("#editLoading").remove();
				tooltips("请输入应用名称","Warning");
				$("#new-name").show();
				return;
			}
			/*获取页面的html*/
			var html=$("#yunZutaiHtml").html();
			/*获取页面的js************/
			var jsTMP=getJs();
			$("#_html").val(html);
			$("#_js").val(jsTMP);
			$("#zutaiForm").removeAttr("target");
			$("#zutaiForm").submit();
			$("#editLoading").remove();
			
		},1200);
	});
	/*******************预览***************************/
	$("#previewYunZutai").on("click",function(){
		$("body").append('<div id="editLoading"><div id="addLoading"></div></div>');
		setTimeout(function() 
		{
			$(window).unbind("beforeunload");//解绑离开页面事件
			$("#previewFlag").val("1");	//预览标志
			/*获取页面的html*/
			var html=$("#yunZutaiHtml").html();
			/*获取页面的js************/
			var jsTMP=getJs();
			$("#_html").val(html);
			$("#_js").val(jsTMP);
			$("#zutaiForm").attr("target","_blank");
			$("#zutaiForm").submit();
			$("#editLoading").remove();
		},1200);
	});issueYunZutaiFun
	/*******************发布***************************/
	$("#fabuYunZutai").on("click",function()
	{
		$(window).unbind("beforeunload");	//解绑离开页面事件
		$('#type-dialogBox').dialogBox(
		{
			type:'correct',
			autoHide:false,
			zIndex:99999,
			hasMask:true,
			hasClose:true,
			hasBtn:true,
			effect:'sign',
			content:'确认发布吗？',
			confirm:function()
			{
				$("body").append('<div id="editLoading"><div id="addLoading"></div></div>');
				setTimeout(function() 
				{
					//获取当前组态ID
					var id=$("#id").val();
                    var link=$.trim($("#_link").val());
                    // if(link==null||link==''){
                    //     $("#_link").val(getUuid());
                    // }



					//获取当前组态状态
					var status=$("#status").val();
                    if(link==null||link==""){	//新增是判断发布数量（编辑是不算）
                        $.ajax(
                            {
                                type: "POST",
                                url: "../configure/getConfiguresCount",
                                dataType: "json",
                                success: function(data)
                                {
                                    if(data.count>1){
                                            tooltips("发布数量已达上限！","Warning");
                                    }else{
                                        $("#_link").val(getUuid());
                                        issueYunZutaiFun();
									}
                                },
                                error:function()
                                {
                                    tooltips("请求出错！请联系技术支持","Warning");
                                },
                            });
                    }else{
                        issueYunZutaiFun();
                    }
                    $("#editLoading").remove();
				},1200);	
			},
		});
		
	});
	
	/*****************原图上传********************/
	uploadOriginalPic();
});
/*************发布*****************/
function issueYunZutaiFun(){


	$("#previewFlag").val("0");	//保存和预览区分标志
	$("#operateFlag").val("1");	//保存和发布区分标志
	//应用名称
	var appname=$.trim($("#appname").val());
	if(appname==null||appname==""){
		$("#editLoading").remove();
		tooltips("请输入应用名称","Warning");
		$("#new-name").show();
		return;
	}
	$("#status").val("1");	//已发布标志
	/*获取页面的html*/

	var html=$("#yunZutaiHtml").html();
    console.log(html)
    var xx = $.trim(html.replace(/>\s+</g, "><"));
    console.log(xx);
	/*获取页面的js************/
	var jsTMP=getJs();
	$("#_html").val(html);
	$("#_js").val(jsTMP);
	$("#zutaiForm").removeAttr("target");
	$("#zutaiForm").submit();


}
/***************获取图表js********************/
function getJs(){
	var jsTMP='';
	var ECnum = $("#pc-center").find(".newECharts").length;//获取图表个数
	if(ECnum > 0)
	{
		$("#pc-center").find(".newECharts").each(function(index)
		{
			var rid = $(this).parent(".canvas").attr("rid");//获取图表类型
			switch(rid)
			{
				case "14"://曲线(多选)
					var sid = $(this).attr("sid");//获取具体图表类型
					if(sid == 1){//复合折线图
						jsTMP += jsTemp01($(this));
					}else if(sid == 2){//可选时间段曲线图
						jsTMP += jsTemp02($(this));
					}else if(sid == 3){//复合曲线图
						jsTMP += jsTemp03($(this));
					}else if(sid == 4){//实时曲线图
						jsTMP += jsTemp04($(this));
					}
				break;
				case "15"://时间折线图
					jsTMP += jsTemp05($(this));
				break;
				case "16":
					var sid = $(this).attr("sid");//获取具体图表类型
					if(sid == 1){//区域曲线图
						jsTMP += jsTemp06($(this));
					}else if(sid == 2){//堆叠面积图
						jsTMP += jsTemp07($(this));
					}
				break;
				case "17":
					var sid = $(this).attr("sid");//获取具体图表类型
					if(sid == 1){//仪表盘1
						jsTMP += jsTemp08($(this));
					}else if(sid == 2){//仪表盘2
						jsTMP += jsTemp09($(this));
					}
				break;
				case "21"://分辨带曲线图
					jsTMP += jsTemp11($(this));
				break;
				case "22"://管道类型
					var sid = $(this).attr("sid");//获取具体图表类型
					if(sid == 1){
						jsTMP += jsTemp12($(this));
					}else if(sid ==2){
						jsTMP += jsTemp13($(this));
					}else if(sid ==3){
						jsTMP += jsTemp14($(this));
					}
				break;
				case "23"://弯道类型
					var sid = $(this).attr("sid");//获取具体图表类型
					if(sid == 1){
						jsTMP += jsTemp15($(this));
					}else if(sid ==2){
						jsTMP += jsTemp16($(this));
					}else if(sid ==3){
						jsTMP += jsTemp17($(this));
					}
				break;
				case "24"://蓄水池
					jsTMP += jsTemp18($(this));
				break;
				case "27"://蓄水池无边框
					jsTMP += jsTemp23($(this));
				break;
				case "28"://百分比控件横
					var sid = $(this).attr("sid");//获取具体图表类型
					if(sid == 1){
						jsTMP += jsTemp24($(this));
					}else if(sid ==2){
						
					}else if(sid ==3){
						
					}else if(sid ==4){
						
					}
				break;
				case "30"://柱状图
					var sid = $(this).attr("sid");//获取具体图表类型
					if(sid == 1)//柱状图(竖)
					{
						jsTMP += jsTemp19($(this));
					}else if(sid == 2)//柱状图(横)
					{
						jsTMP += jsTemp20($(this));
					}
				break;
				case "31"://饼图
					var sid = $(this).attr("sid");//获取具体图表类型
					if(sid == 1)
					{
						jsTMP += jsTemp21($(this));
					}else if(sid == 2)
					{
						jsTMP += jsTemp22($(this));
					}
				break;
			}
		});
	}
	ECnum = $("#pc-center").find(".mapECharts").length;//获取地图个数
	if(ECnum > 0)
	{
		$("#pc-center").find(".mapECharts").each(function(index)
		{
			jsTMP += jsTemp10($(this));
		});
	}
	return jsTMP;
}
//删除云组态图片方法
function delYunZutaiPhotoFun(id){
	var result="01";
	$.ajax(
	{
		type:'POST',
		data:{
			id:id
		},
		async:false,
		url:basePath+'/configure/deleteConfigureImg',
		success: function(data)
		{

			if(data.state=="success"){
				result="00";
			}
		}
	});
	return result;
}
//独立事件方法
function moreEventFun(){
	//开
	$("#zutaiSwitchOn").unbind("change").on("change",function(){
        $.ajaxFileUpload({
            url:basePath+'/configure/uploadImg',
            secureuri:false,
            fileElementId:"zutaiSwitchOn",
            dataType:'json',
			data:{
            	type:1
			},
            success:function(data, status){
                var img=data.data.url;
                var opw=data.data.width;
                var oph=data.data.height;
                var id= data.data.id;
      			if(img){
          			var picSrc = img;
          			//显示的图片
          			$(".canvasId .switchON img").attr("src",picSrc);
          			$("#img-updivON img").attr("src",picSrc);
          			$("#zutaiSwitchOn").parent().html('<input class="img-uploader-input" type="file" name="file" accept="image/*" id="zutaiSwitchOn">');
      			}else{
      				tooltips(data.substring(2),"Warning");
      			}
      			moreEventFun();
  			},
  			error:function(data, status, e){ //服务器响应失败时的处理函数
      			tooltips(data.substring(2),"Warning");
  			}
		});
	});
	//关
	$("#zutaiSwitchOff").unbind("change").on("change",function(){
        $.ajaxFileUpload({
            url:basePath+'/configure/uploadImg',
            secureuri:false,
            fileElementId:"zutaiSwitchOff",
            dataType:'json',
            data:{
                type:1
            },
            success:function(data, status){
                var img=data.data.url;
                var opw=data.data.width;
                var oph=data.data.height;
                var id= data.data.id;
                if(img){
                    var picSrc = img;
                    //显示的图片
                    $(".canvasId .switchOFF img").attr("src",picSrc);
                    $("#img-updivOFF img").attr("src",picSrc);
                    $("#zutaiSwitchOff").parent().html('<input class="img-uploader-input" type="file" name="file" accept="image/*" id="zutaiSwitchOff">');
                }else{
                    tooltips(data.substring(2),"Warning");
                }
                moreEventFun();
            },
            error:function(data, status, e){ //服务器响应失败时的处理函数
                tooltips(data.substring(2),"Warning");
            }

        });
	});
	//自定义按钮
	$("#uploadDiyBt").unbind("change").on("change",function(){
		$.ajaxFileUpload({
            url:basePath+'/configure/uploadImg',
            secureuri:false,
            fileElementId:"uploadDiyBt",
            dataType:'json',
			data:{
            	type:1
			},
  			success:function(data, status){
            	if(data.state == "success"){
  			    // var strs= new Array();
      			// data = data.replace("<PRE>", '');
      			// data = data.replace("</PRE>", '');
      			// data = data.replace("<pre>", '');
      			// data = data.replace("</pre>", '');
      			// strs = data.split(">");
      			// if(strs.length == 1){
      			// 	data = strs[0];
      			// } else{
      			// 	data = strs[1];
      			// }
      			// if(data.substring(0, 1) == 0){     //0表示上传成功(后跟上传后的文件路径),1表示失败(后跟失败描述)
          			// var picSrc = data.substring(2);
          			// console.log(picSrc);
          			//显示的图片
          			$(".canvasId img").attr("src",data.data.url);
          			$("#diyBtDiv").html('<input class="img-uploader-input" type="file" name="file" accept="image/*" id="uploadDiyBt">');
      			}else{
      				tooltips(data.substring(2),"Warning");
      			}
      			moreEventFun();
  			},
  			error:function(data, status, e){ //服务器响应失败时的处理函数
      			tooltips(data.substring(2),"Warning");
  			}
		});
	});
}

/*****************原图上传****************/
function uploadOriginalPic(){
	$("#uploadOriginal").unbind("change").on("change",function(){
		$.ajaxFileUpload({
  			url:basePath+'/configure/uploadImg',
  			secureuri:false,
  			fileElementId:"uploadOriginal",
  			dataType:'json',
            data:{
                type:0
            },
  			success:function(data, status){       

					var img=data.data.url;
					var opw=data.data.width;
					var oph=data.data.height;
					var id= data.data.id;

					var meDate=
						'<div class="svgDiv2 draggable" pid="1">'+
							'<div class="MaterialShow">'+
								'<img src="'+ img +'" />'+
							'</div>'+
							'<div class="MaterialNone">'+
								'<div class="canvas" rid="1" style="width:'+opw+'px;height:'+oph+'px;">'+
									'<div class="canvas-con">'+
										'<img src="'+ img +'" />'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<a href="javascript:;" class="del-upload iconfont" id="'+id+'">'+
								'&#xe80a;'+
							'</a>'+
						'</div>';
					console.log(meDate);
					var $meDate = $(meDate);
					$uploadFlow.append($meDate).masonry('appended',$meDate);
					draggable(navPage);//调用拖动
					setTimeout(function() 
					{
						$uploadFlow.masonry();
					},1000);
					tooltips("上传成功！","Success");
      	/*		}*/
      			$("#uploadOriginal").remove();
      			$(".OriginalAdd").append('<input type="file" name="file" id="uploadOriginal" accept="image/*">');
      			uploadOriginalPic();
  			},
  			error:function(data, status, e){ //服务器响应失败时的处理函数
      			tooltips(data.substring(2),"Warning");
      			$("#uploadOriginal").remove();
      			$(".OriginalAdd").append('<input type="file" name="file" id="uploadOriginal" accept="image/*">');
      			uploadOriginalPic();
  			}
		});
	});
}

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
/*jquery 限制文本框不能输入反斜杠*/  
function fanXieGangLimit(obj){
   	$(obj).keyup(function(){    
         $(this).val($(this).val().replace(/[/]/g,''));  
     }).bind("paste",function(){  //CTR+V事件处理    
         $(this).val($(this).val().replace(/[/]/g,''));     
     }).css("ime-mode", "disabled"); //CSS设置输入法不可用
}
/*jquery 限制文本框不能输入汉字*/  
function chineseLimit(obj){
   	$(obj).keyup(function(){    
         $(this).val($(this).val().replace(/[\u4E00-\u9FA5]/g,''));  
     }).bind("paste",function(){  //CTR+V事件处理    
         $(this).val($(this).val().replace(/[\u4E00-\u9FA5]/g,''));     
     }).css("ime-mode", "disabled"); //CSS设置输入法不可用
}
/*jquery 限制文本框不能点*/  
function pointLimit(obj){
   	$(obj).keyup(function(){    
         $(this).val($(this).val().replace(/[.]/g,''));  
     }).bind("paste",function(){  //CTR+V事件处理    
         $(this).val($(this).val().replace(/[.]/g,''));     
     }).css("ime-mode", "disabled"); //CSS设置输入法不可用
}
/**********获取UUid***************/
function getUuid(){
  var len = 20;//32长度
  var radix = 16;//16进制
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid=[],i;
  radix = radix||chars.length;
  if(len){
  	for(i=0;i<len;i++){
  		uuid[i]=chars[0|Math.random()*radix];
  	}
  }else{
  	var r;
  	uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
  	uuid[14] = '4';
  	for(i=0;i<36;i++){
  		if(!uuid[i]){
  			r = 0|Math.random()*16;
  			uuid[i] = chars[(i==19)?(r&0x3)|0x8:r];
  		}
  	}
  }
  return uuid.join('');
}

//移动已经加载过的js/css
function removejscssfile(filename,filetype){
	var targetelement=(filetype=="js")? "script" :(filetype=="css")? "link" : "none"
	var targetattr=(filetype=="js")?"src" : (filetype=="css")? "href" :"none"
	var allsuspects=document.getElementsByTagName(targetelement)
	for (var i=allsuspects.length; i>=0;i--){
	if (allsuspects[i] &&allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
	 allsuspects[i].parentNode.removeChild(allsuspects[i]);
	}
}