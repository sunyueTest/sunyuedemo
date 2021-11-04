/****************************************** 
 ****************************************** 
 ****************************************** 
 * 
 * 功能操作
 * 
 ****************************************** 
 ****************************************** 
 ****************************************** 
 ******************************************* /

/********************************* 画布功能区域 *************************************/
$(function()
{

	//初始化时间
	startTime();
	/** 初始化素材区拖动 **/
	draggable(navPage);
	/** 初始化面板素材拖动 **/
	new_draggable($("#pc-edit").find(".canvas").not(".Locking"));
	/** 初始化编辑区接收拖动过来的元素 **/
	droppable(navPage);
	/** 初始化调用编辑区功能 **/
	Editing_area(navPage);
});
/**************************************** 组态设置信息修改 ************************************************/
$(function()
{
	//弹开或关闭组态信息框
	$(document).on("click", "#pc-name", function()
	{
		$("#new-name").show();
	});
	$(document).on("click", "#new-name-a, #new-name-none", function()
	{
		$("#new-name").hide();
	});
	//是否公开
	$(document).on("click", ".encryption", function()
	{
		var val = $(this).val();
		switch(val)
		{
			case "0":
				$(".new-input-dis").attr("disabled",true);
				$(".new-input-dis").val("");
				break;
			case "1":
				$(".new-input-dis").attr("disabled",false);
				break;
		}
	});
	//上传组态LOGO
	var $image = $('#newEditModalIMG');
	var new_scaleX;
	var new_scaleY;
	var $dataHeight = $('#neWdataHeight');
	var $dataWidth = $('#neWdataWidth');
	var URL = window.URL || window.webkitURL;
	var originalImageURL = $image.attr('src');
	var uploadedImageName = 'cropped.jpg';//默认下载图片名称
	var uploadedImageType = 'image/jpeg';
	var uploadedImageURL;
	var options;
	var $download = $('#neWuploadDown');
	var opw;
	var oph;
	//打开图像裁剪程序
	$('#newEditModal').on('shown.bs.modal', function(e)
	{
		options =  
		{
			minContainerWidth:900,
			minContainerHeight:500,
			aspectRatio:1.372881355932203,
			preview:'#neWuploadpreview',
			crop:function(e)
			{
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
	$('#newEditModal').on('hidden.bs.modal', function(e){
		$('#newEditModalIMG').cropper("destroy");
	});
	//选择移动
	$(document).on("click", "#neWuploadMove", function()
	{
		$image.cropper("setDragMode","move");
	});
	//选择裁剪
	$(document).on("click", "#neWuploadCutting", function()
	{
		$image.cropper("setDragMode","crop");
	});
	//放大
	$(document).on("click", "#neWuploadEnlarge", function()
	{
		$image.cropper("zoom",0.1);
	});
	//缩小
	$(document).on("click", "#neWuploadNarrow", function()
	{
		$image.cropper("zoom",-0.1);
	});
	//向上移动
	$(document).on("click", "#neWuploadTop", function()
	{
		$image.cropper("move",0,-1);
	});
	//向下移动
	$(document).on("click", "#neWuploadBottom", function()
	{
		$image.cropper("move",0,1);
	});
	//向左移动
	$(document).on("click", "#neWuploadLeft", function()
	{
		$image.cropper("move",-1,0);
	});
	//向右移动
	$(document).on("click", "#neWuploadRight", function()
	{
		$image.cropper("move",1,0);
	});
	//向左旋转
	$(document).on("click", "#neWuploadRotateL", function()
	{
		$image.cropper("rotate",-45);
	});
	//向左旋转
	$(document).on("click", "#neWuploadRotateR", function()
	{
		$image.cropper("rotate",45);
	});
	//上下翻转
	$(document).on("click", "#neWuploadScaleY", function()
	{
		if(new_scaleY == 1){
			$image.cropper("scaleY",-1);
		}else{
			$image.cropper("scaleY",1);
		}
	});
	//左右翻转
	$(document).on("click", "#neWuploadScaleX", function()
	{
		if(new_scaleX == 1){
			$image.cropper("scaleX",-1);
		}else{
			$image.cropper("scaleX",1);
		}
	});
	//重置
	$(document).on("click", "#neWuploadReset", function()
	{
		$image.cropper("reset");
	});
	//下载
	$(document).on("click", "#neWuploadDown", function()
	{
		var result = $image.cropper("getCroppedCanvas",{maxWidth:4096,maxHeight:4096});
		$download.attr('href', result.toDataURL(uploadedImageType));
	});
	//裁剪完成
	$(document).on("click", "#neWuploadYse", function()
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
						tooltips(arr[1],"Warning");
						return;
					}
					img=arr[1];
					$("#uploadZutaiLogo").attr("src",img);
					$("#appico").val(img);
					$("#newEditModal").modal('hide');
				}else{
					tooltips("请求数据出错,请联系技术支持！","Warning");
				}
			},
			error:function()
			{
				tooltips("请求数据出错,请联系技术支持！","Warning");
			}
		});
	});
	//上传img
	var $inputImage = $('#neWinputImage');
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
					tooltips("请求数据出错,请联系技术支持！","Warning");
				}
			}
		});
	}else
	{
		$inputImage.hide().parent().addClass('uploadImgNo');
	}
});
/**************************************** 快捷键与更新说明弹窗 ************************************************/
$(function()
{
	//快捷键滑窗开
	$(document).on("click", "#Shortcut_key", function()
	{
		var clas  = "Shortcut_open";
		var $this = $(this);
		if(!$this.hasClass(clas))
		{
			$("#pc_Shortcut").animate(
			{
				bottom:"0"
			},function()
			{
				$this.addClass(clas);
			});
		}else{
			$("#pc_Shortcut").animate(
			{
				bottom:"-540px"
			},function()
			{
				$this.removeClass(clas);
			});
		}
	});
	//快捷键滑窗关
	$(document).on("click", "#pc_Shortcut_down", function()
	{
		$("#pc_Shortcut").animate({
			bottom:"-540px",
		},function()
		{
			$("#Shortcut_key").removeClass("Shortcut_open");
		});
	});
	//更新说明
	$(document).on("click", "#Update_log", function()
	{
		$("#pc_Update").show();
	});
	$(document).on("click", "#pc_Update_none", function()
	{
		$("#pc_Update").hide();
	});
})
/************************************************************************left独立导航栏展开内容区************************************************/
+function($)
{
	"use strict";
	var clsA = "nav";//点击事件
	var clsB = "navB";//点中后效果
	var nav  = "#navNone";
	var navB = "navBlock";
	var itme = "navItmeBlock";
	var me_gallery   = true;//图库瀑布流执行一次
	var on_Graphical = true;//图形瀑布流执行一次
	var me_waterfall = true;//上传瀑布流执行一次
	$("."+clsA).on("click", function(e)
	{ 
		e.preventDefault();//阻止浏览器默认事件
		var $a = $(e.currentTarget);
		var href = $a.attr("href");
		if(!/^#/.test(href)) return;
		//导航条切换效果
		if(!$a.hasClass(clsB))
		{
			$("."+clsB).removeClass(clsB);
			$a.addClass(clsB);
			if(!$(nav).hasClass(navB))
			{
				$(nav).animate(
				{
					left:'60px'
				},function()
				{
					$(nav).addClass(navB)
				});
			}
		}else
		{
			if(!$(nav).hasClass(navB))
			{
				$(nav).animate(
				{
					left:'60px'
				},function()
				{
					$(nav).addClass(navB);
				});
			}else{
				$(nav).animate(
				{
					left:'-240PX'
				},function()
				{
					$(nav).removeClass(navB);
				});
			}
		}
		//独立导航栏展开内容区切换
		if(!$(href).hasClass(itme))
		{
			$("."+itme).animate(
			{
				left:'240px'
			},function()
			{
				$(this).removeAttr("style").removeClass(itme);
			});
			$(href).animate({
				
				left:'0',
			},function()
			{
				if(href == "#nav3" && me_gallery == true)
				{
					new_gallery(1);
					me_gallery = false;
				}else if(href == "#nav4" && on_Graphical == true)//图形瀑布流
				{
					Graphical();
					on_Graphical = false;
				}else if(href == "#nav6" && me_waterfall == true)//上传瀑布流
				{
					upload();
					me_waterfall = false;
				}
			}).addClass(itme);
		}
	});	
}($);
/********************************* 右侧编辑面板功能 *************************************/
$(function()
{
	//初始化画布拖动
	$("#pc-center").draggable(
	{
		opacity:1,
		scroll:true,
		scrollSensitivity:0,
		handle:"#pc-canvas",
		scrollSpeed:0,
		addClasses:false
	});
	//右侧编辑面板展开与关闭
	$("#right-show").on("click", function()
	{
		var none = $(this);
		if(!none.hasClass("right-hide"))
		{
			none.addClass("right-hide");
			$("#pc-right").animate(
			{
				right:'-240px'
			});
		}else{
			none.removeClass("right-hide");
			$("#pc-right").animate(
			{
				right:'0px'
			});
		}
	});
});
//基本设置和高级设置栏目切换
+function($)
{
	"use strict";
	var clsA = "rightNav-headA";//点击事件
	var clsB = "rightNav-headB";//点中后效果
	var conB = "rightShow";
	$(document).on("click","."+clsA, function(e)
	{
		e.preventDefault();//阻止浏览器默认事件
		var $a = $(e.currentTarget);
		var href = $a.attr("href");
		if(!/^#/.test(href)) return;
		if($a.hasClass(clsB)) return;
		$("."+clsB).removeClass(clsB);
		$a.addClass(clsB);
		$("."+conB).removeClass(conB);
		$(href).addClass(conB);
	});
}($);
/**************************************************************************************************************************************
						画布设置
******************************************************************************************************************************************/
$(function()
{
	/******************************************  
					功能选择
	*******************************************/
	
	
	//选择移动画布或移动元素
	$(document).on("click", ".Choice", function(e)
	{
		e.preventDefault();//阻止浏览器默认事件
		var $a = $(e.currentTarget);
		var href = $a.attr("href");
		if($a.hasClass("ChoiceB")) return;
		$(".ChoiceB").removeClass("ChoiceB");
		$a.addClass("ChoiceB");
		if(href == 0)
		{//移动画布
			$("#pc-canvas").show();//启用移动画布
			
		}else if(href == 1)
		{//框选元素
			$("#pc-canvas").hide();//禁用移动画布
		}
	});
	
	/******************************************  
					基本设置   
	*******************************************/
	
	//是否显示辅助线
	$(document).on("click", "#auxiliary", function()
	{
		auxiliary("#auxiliary");
	});
	//输入框动态更新画布宽度
	$('#pc-width').on('input propertychange', function(e)
	{
		var width;
		if($(this).val() > 0){
			width = $(this).val() +"px";	
		}else{
			tooltips("只能输入数字","Warning");
			width = $(this).val("1000");
		}
		$("#pc-center").css("width",width);
	});
	//输入框动态更新画布高度
	$('#pc-height').on('input propertychange', function(e)
	{
		var height;
		if($(this).val() > 0){
			height = $(this).val() +"px";
		}else{
			tooltips("只能输入数字","Warning");
			height = $(this).val("1000");
		}
		$("#pc-center").css("height",height);
	});
	//运行页面是否自适应
	$("#adaption").change(function()
	{
		$("#pc-center").attr("adaption",$(this).val());
	});
	//背景颜色
	$("#full").spectrum(
	{
		allowEmpty:true,//允许为空,显示清除颜色按钮
		color:"#FFFFFF",//初始化颜色
		showInput:true,//显示输入
		containerClassName:"panelColor",//引用类选择器,可以改变颜色选择器面板的样式
		replacerClassName:"inputColor",//引用类选择器,可以改变颜色选择器的样式
		showInitial:true,//显示初始颜色,提供现在选择的颜色和初始颜色对比
		showPalette:true,//显示选择器面板
		showSelectionPalette: true,//记住选择过的颜色
		clickoutFiresChange: false,//单击选择器外部,如果颜色有改变则应用
		showAlpha:true,//显示透明度选择
		maxPaletteSize:10,//记住选择过的颜色的最大数量
		preferredFormat:"rgb",//输入框颜色格式,(hex十六进制,hex3十六进制可以的话只显示3位,hsl,rgb三原色,name英文名显示)
		localStorageKey:false,//把选择过的颜色存在浏览器上
		clickoutFiresChange: false,//单击选择器外部,如果颜色有改变则应用
		cancelText: "关闭",
		chooseText: "确定",
		appendTo: "body",//选择选择器容器是附加到哪个元素
		palette:
		[
			[
				"#FFFFFF", "#000000", "#696969", "#FF7D23", "#AA40FF", "#1F0068", "#B81B6C", "#4617B4", "#E064B7", "#FF1D77", "#2D004E", "#FF768C", "#B81B1B", "#7200AC", "#D39DD9", "#FF2E12", "#C1004F", "#E1B700", "#E56C19", "#4E0038", "#83BA1F", "#FF981D", "#4E0000", "#91D100", "#15992A", "#B01E00", "#00AAAA", "#00C13F", "#2E1700", "#00D8CC", "#004A00", "#632F00", "#569CE3", "#119900", "#AE113D", "#56C5FF", "#004D60", "#2673EC", "#1B58B8", "#008287", "#78BA00", "#1FAEFF", "#001E4E", "#F4B300", "#691BB8", "#006AC1", "#ff461f", "#003472", "#057748", "#be002f", "#8d4bbb", "#ff2d51", "#3399FF", "#FFFF66", "#FF99CC", "#FF6666", "#CCCCCC", "#CC9966", "#99FFCC", "#99CC66", "#9966CC", "#66FF66", "#6699CC", "#666666"
			]
		],
		change:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toRgbString();
	　　　　}
			$(navPage).css("background-color",hexColor);
		},
		move:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toRgbString();
	　　　　}
			$(navPage).css("background-color",hexColor);
		}
	});
	//边框大小
	$("#pc_slider").slider(
	{
		range:"max",
		min:0,
		max:10,
		value:0,
		slide:function(event,ui)
		{
			$("#border_size").val(ui.value);
			$(navPage).css("border-width",ui.value);
		}
	});
	//输入框动态更新边框大小
	$('#border_size').on('input propertychange', function(e)
	{
		var size;
		if($(this).val() <= 10 && $(this).val() >= 0)
		{
			size = $(this).val();
		}else
		{
			tooltips("输入范围0-10","Warning");
			$(this).val("0");
			size = 0;
		}
		$(navPage).css("border-width",size);
		$("#pc_slider").slider("value",size);
	});
	//画布更新边框样式
	$("#pc_select").change(function()
	{
		$(navPage).css("border-style",$(this).val());
	});

	//按钮绑定是否一键显示隐藏页面
    $("#showMany").change(function()
    {
        $(".canvasId > .canvas-con").attr("isShow",$(this).val());
    });




	//边框颜色
	$("#border_full").spectrum(
	{
		allowEmpty:true,//允许为空,显示清除颜色按钮
		color:"#FFFFFF",//初始化颜色
		showInput:true,//显示输入
		containerClassName:"panelColor",//引用类选择器,可以改变颜色选择器面板的样式
		replacerClassName:"inputColor",//引用类选择器,可以改变颜色选择器的样式
		showInitial:true,//显示初始颜色,提供现在选择的颜色和初始颜色对比
		showPalette:true,//显示选择器面板
		showSelectionPalette: true,//记住选择过的颜色
		clickoutFiresChange: false,//单击选择器外部,如果颜色有改变则应用
		showAlpha:true,//显示透明度选择
		maxPaletteSize:10,//记住选择过的颜色的最大数量
		preferredFormat:"rgb",//输入框颜色格式,(hex十六进制,hex3十六进制可以的话只显示3位,hsl,rgb三原色,name英文名显示)
		localStorageKey:false,//把选择过的颜色存在浏览器上
		clickoutFiresChange:true,//单击选择器外部,如果颜色有改变则应用
		cancelText: "关闭",
		chooseText: "确定",
		appendTo: "body",//选择选择器容器是附加到哪个元素
		palette:
		[
			[
				"#FFFFFF", "#000000", "#696969", "#FF7D23", "#AA40FF", "#1F0068", "#B81B6C", "#4617B4", "#E064B7", "#FF1D77", "#2D004E", "#FF768C", "#B81B1B", "#7200AC", "#D39DD9", "#FF2E12", "#C1004F", "#E1B700", "#E56C19", "#4E0038", "#83BA1F", "#FF981D", "#4E0000", "#91D100", "#15992A", "#B01E00", "#00AAAA", "#00C13F", "#2E1700", "#00D8CC", "#004A00", "#632F00", "#569CE3", "#119900", "#AE113D", "#56C5FF", "#004D60", "#2673EC", "#1B58B8", "#008287", "#78BA00", "#1FAEFF", "#001E4E", "#F4B300", "#691BB8", "#006AC1", "#ff461f", "#003472", "#057748", "#be002f", "#8d4bbb", "#ff2d51", "#3399FF", "#FFFF66", "#FF99CC", "#FF6666", "#CCCCCC", "#CC9966", "#99FFCC", "#99CC66", "#9966CC", "#66FF66", "#6699CC", "#666666"
			]
		],
		change:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toRgbString();
	　　　　}
			$(navPage).css("border-color",hexColor);
		},
		move:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toRgbString();
	　　　　}
			$(navPage).css("border-color",hexColor);
		}
	});
	
	/******************************************  
					高级设置   
	*******************************************/
	//区域内公共变量
	var posit     = "navTop";//导航条定位
	var numCanvas = $(".editNavA").length;//画布已添加数量
	var max       = 0//画布累积添加最大数
	var disabled  = false;//允许编辑导航名称
	var newCanvas = 0;//本次编辑不在提示
	//添加画布
	$(document).on("click", "#addCanvas", function()
	{
		var min = Number($("#numCanvas").val());
		var num = numCanvas + min;
		if(num <= 5 && min > 0)
		{
			if(disabled == false)
			{
				$("#numName").attr("disabled",false);//允许编辑导航名称
				disabled = true;
			}
			for(a=0; a<min; a++)
			{
				max++;
				editTemp(max);
			}
			numCanvas = num;
		}else{
			tooltips("开放版最多支持5个,你还可以添加"+ (5-numCanvas) +"个，如需更多请开通企业版","Warning");
			$("#numCanvas").val(5-numCanvas);
			$("#numCanvas").attr("placeholder","已添加"+numCanvas+"个");
		}
	});
	//更改栏目名称
	$('#numName').on('input propertychange', function()
	{
		var size = $(this).val();
		$('.editNavB').html(size);
	});
	//画布导航栏浮动
	$("#pc_position").change(function()
	{
		if(max > 0)
		{
			var position = $(this).val();
			if(position == "absolute")
			{
				$("#editNav").removeClass("navFixed").addClass("navAbsolute");			
			}else if(position == "fixed"){
				$("#editNav").removeClass("navAbsolute").addClass("navFixed");
			}
		}else
		{
			tooltips("单画布无法设置，请添加画布","Warning");
			$(this).val("absolute");
		}
	});
	//画布导航栏定位
	$("#pc_Float").change(function()
	{
		if(max > 0)
		{
			var Float = $(this).val();
			if(Float == "top"){
				$("#editNav").removeClass(posit).addClass("navTop");
				posit = "navTop";
			}else if(Float == "bottom"){
				$("#editNav").removeClass(posit).addClass("navBottom");
				posit = "navBottom";
			}else if(Float == "left"){
				$("#editNav").removeClass(posit).addClass("navLeft");
				posit = "navLeft";
			}else if(Float == "right"){
				$("#editNav").removeClass(posit).addClass("navRight");
				posit = "navRight";
			}
		}else
		{
			tooltips("单画布无法设置，请添加画布","Warning");
			$(this).val("top");
		}
	});
	//画布导航栏背景颜色
	navColor("#beijing_full","#editNav","background-color","#ffffff");
	//画布导航栏文字颜色
	navColor("#font_full","#editNav > .editNavA","color","#000000");
	//画布切换效果
	$("#pc_animation").change(function()
	{
		if(max > 0){
			var anima = $(this).val();
			var ani   = $("#editNav").attr("anima")
			if(ani == 1)
			{
				$(".editNone").removeClass("editBolock");
				$(".editNone").removeClass("animated bounceOutRight bounceInLeft");
			}else(ani == 3)
			{
				$(".editNone").removeClass("editBolock");
				$(".editNone").removeClass("animated fadeInLeft fadeOutRight");
			}
			$("#editNav").attr("anima",anima);
		}else{
			tooltips("单画布无法设置，请添加画布","Warning");
			$(this).val(0);
		}
	});
	
	/********************
 						初始同步化画布设置
	 						************************/
	
	//基本设置同步
	var aColor  = $(".editShow").css("background-color");//同步画布背景颜色
	var bwidth  = $(".editShow").css("border-left-width");//同步画布边框宽度
	var bStyle  = $(".editShow").css("border-left-style");//同步画布边框样式
	var bColor  = $(".editShow").css("border-left-color");//同步画布边框颜色
	$("#full").spectrum("set",aColor);
	$("#border_full").spectrum("set",bColor);
	$("#pc_slider").slider("value",bwidth.replace(/[a-z]/g,""));
	$("#border_size").val(bwidth.replace(/[a-z]/g,""));
	$("#pc_select").val(bStyle);
	//高级设置同步
	var editLeng = $(".editNone").length;
	var max_data = [];
	//画布累积添加最大数
	$(".editNone").each(function(index)
	{
		var s = $(this).attr("id");
		var z = s.replace(/[^0-9]/ig,"");
		if(!isNaN(z)){
			max_data.push(z);
		}
		if(editLeng == (index+1)){
			if(numCanvas == 0)
			{
				max = (Math.max.apply(null, max_data))-1;
			}else{
				max = Math.max.apply(null, max_data);
			}
			
		}
	});
	if(numCanvas>0)
	{
		$("#numCanvas").attr("placeholder","已添加"+numCanvas+"个");//获取已添加画布数量提示
		$("#numName").removeAttr("disabled");//允许编辑导航栏名称
		disabled = true;
		$("#numName").val($(".editNavB").text());//初始化当前画布名称
		$("#pc_position").val($("#editNav").css("position"));//获取导航栏浮动状态
		if($("#editNav").hasClass("navTop"))//同步导航栏位置
		{
			$("#pc_Float").val("top");
			posit = "navTop";
		}else if($("#editNav").hasClass("navBottom"))
		{
			$("#pc_Float").val("bottom");
			posit = "navBottom";
		}else if($("#editNav").hasClass("navLeft"))
		{
			$("#pc_Float").val("left");
			posit = "navLeft";
		}else if($("#editNav").hasClass("navRight"))
		{
			$("#pc_Float").val("right");
			posit = "navRight";
		}
		$("#pc_animation").val($("#editNav").attr("anima"));//获取导航栏切换动画
		$("#beijing_full").spectrum("set",$("#editNav").css("background-color"));//导航条背景颜色
		$("#font_full").spectrum("set",$(".editNavB").css("color"));//导航条文字颜色
		$("#switch_full").spectrum("set",$(".editNavB").css("background-color"));//导航条切换颜色
	}
	//画布切换以及删除
	$(document).on("mousedown", ".editNavA", function(e)
	{
		e.preventDefault();//阻止浏览器默认事件
		var key  =  e.which;
		var $a   = $(e.currentTarget);
		var href = $a.attr("hid");
		if(!/^#/.test(href)) return;
		if(key == 1)//切换
		{
			if($a.hasClass("editNavB")) return;//如果存在程序终止
			$(".editNavB").removeClass("editNavB");//隐藏之前栏目
			$a.addClass("editNavB");//栏目切换
			navPage = href;//动态修改画布id
			var anima = $("#editNav").attr("anima");//获取动画id
			function_anima(anima,href);//调用动画方法
			$(".draggable").draggable("option","scope",navPage);//更新接收区域
			//以下方法只调用一次
			if($(href).attr("pageId") != 1)
			{
				$(href).attr("pageId",1);
				Editing_area(navPage);//调用编辑区功能
				droppable(navPage);//让编辑区接收拖动过来的元素
				//刷新图表
				$(href).find(".newECharts").each(function()
				{
					var id = $(this).children(".myECharts").attr("id");
					var myChart = echarts.init(document.getElementById(id));
					myChart.resize();
				});
			}
			//更新显示
			var aColor  = $(href).css("background-color");//同步背景颜色
			var bwidth  = $(href).css("border-left-width");//边框宽度
			var bStyle  = $(href).css("border-left-style");//边框样式
			var bColor  = $(href).css("border-left-color");//边框颜色
			var text    = $a.text();//文本
			$("#full").spectrum("set",aColor);
			$("#border_full").spectrum("set",bColor);
			$("#pc_slider").slider("value",bwidth.replace(/[a-z]/g,""));
			$("#border_size").val(bwidth.replace(/[a-z]/g,""));
			$("#pc_select").val(bStyle);
			$("#numName").val(text);
		}else if(key == 3)//删除
		{
			var len = $(".editNavA").length;
			if(newCanvas == 0)//本次编辑不在提示
			{
				$('#type-dialogBox').dialogBox(
				{
					type:'correct',
					autoHide:false,
					zIndex:99999,
					hasMask:true,
					hasClose:true,
					hasBtn:true,
					effect:'sign',
					content:'删除当前栏目将删除所属的画布以及所包含的素材,确认要删除吗?<div class="checkbox"><label><input type="checkbox" id="newCanvas" >本次编辑不在提示</label></div>',
					confirm:function()
					{
						delCanvas(len,$a,href);
					},
				});
			}else
			{
				delCanvas(len,$a,href);
			}
		}
	});
	//本次编辑是否不在提示
	$(function()
	{
		$(document).on("click", "#newCanvas", function()
		{
			if($(this).is(':checked'))
			{
				newCanvas = 1;
			}else
			{
				newCanvas = 0;
			}
		})
	})
	//删除画布方法
	function delCanvas(len,$a,href)
	{
		if($a.hasClass("editNavB"))
		{
			if(len == 1)
			{
				$("#editNav").remove();
				numCanvas = 0;//重置已添加
				ResetNav();//重置操作面板
				posit = "navTop";//重置画布导航栏位置
				disabled = false;//不允许编辑导航名称
				canvasNumber();//画布累积添加最大数
				max--;
			}else if(len == 2)
			{
				del_Modal(href);//调用模态框删除方法
				$("#editNav").remove();//删除导航条
				$(href).remove();//删除当前点击画布
				var itme  = $a.prev(".editNavA").length == 1?$a.prev(".editNavA"):$a.next(".editNavA");
				var hrefs =  itme.attr("hid");//获取左右导航栏目id
				$(hrefs).addClass("editShow");//显示
				numCanvas = 0;//重置已添加
				ResetNav();//重置操作面板
				posit = "navTop";//重置画布导航栏位置
				disabled = false;//不允许编辑导航名称
				navPage  = hrefs;//重置画布ID
				//如果不存在则调用一次方法
				$(".draggable").draggable("option","scope",navPage);//更新接收区域
				var pageId = $(hrefs).attr("pageId");
				if(pageId != 1)
				{
					$(hrefs).attr("pageId",1)
					Editing_area(navPage);//调用编辑区功能
					droppable(navPage);//让编辑区接收拖动过来的元素
				}
				canvasNumber();//画布累积添加最大数
				max--;
			}else if(len > 2){
				del_Modal(href);//调用模态框删除方法
				var itme  = $a.prev(".editNavA").length == 1?$a.prev(".editNavA"):$a.next(".editNavA");
				var hrefs = itme.attr("hid");
				var text  = itme.text();//获取上下级文本
				$("#numName").val(text);
				$a.remove();
				$(href).remove();
				itme.addClass("editNavB")
				$(hrefs).addClass("editShow");
				numCanvas--;//重置已添加
				navPage  = hrefs;//重置画布ID
				$(".draggable").draggable("option","scope",navPage);//更新接收区域
				//如果不存在则调用一次方法
				var pageId = $(hrefs).attr("pageId");
				if(pageId != 1)
				{
					$(hrefs).attr("pageId",1)
					Editing_area(navPage);//调用编辑区功能
					droppable(navPage);//让编辑区接收拖动过来的元素
				}
				canvasNumber();//画布累积添加最大数
			}
		}else
		{
			if(len == 2){
				del_Modal(href);//调用模态框删除方法
				numCanvas = 0;//重置已添加
				$("#editNav").remove();
				$(href).remove();//删除自身
				ResetNav();//重置操作面板
				posit = "navTop";//重置画布导航栏位置
				disabled = false;//不允许编辑导航名称
				canvasNumber();//画布累积添加最大数
				max--;
			}else if(len > 2){
				del_Modal(href);//调用模态框删除方法
				$a.remove();
				$(href).remove();
				numCanvas--;//重置已添加
				canvasNumber();//画布累积添加最大数
			}
		}
	}
	
	function canvasNumber(){
		var canvasNumber = $(".editNone").length;
		max_data = [];
		//画布累积添加最大数
		$(".editNone").each(function(index)
		{
			var s = $(this).attr("id");
			var z = s.replace(/[^0-9]/ig,"");
			if(!isNaN(z)){
				max_data.push(z);
			}
			if(canvasNumber == (index+1)){
				max = Math.max.apply(null, max_data);
			}
		});
	}
	console.log(max);
	console.log(numCanvas);
	
});


/************************************* 快捷键以及按钮  *************************************/
$(function()
{
	var _w       = 0;//获取克隆宽
	var _h       = 0;//获取克隆高
	var _x1      = 0;//获取偏移量(left)
	var _y1      = 0;//获取偏移量(top)
	//复制
	$(document).on("click", "#mouse_copy", function(){
		if($(".canvasId").find(".addModal").length ==0)
		{
			newCopy($(".canvasId"));//调用剪切复制方法
			mouseR_dele();//删除鼠标右键dome
		}else{
			
			tooltips("模态框禁止复制","Warning");
		}
	});
	//剪切
	$(document).on("click", "#mouse_shear", function(){
		if($(".canvasId").find(".addModal").length ==0)
		{
			newCopy($(".canvasId"),0);//调用剪切复制方法
			mouseR_dele();//删除鼠标右键dome
			newFunction("F1");//画布与素材编辑栏切换
		}else{
			
			tooltips("模态框禁止剪切 ","Warning");
		}
	});
	//粘贴面板粘贴
	$(document).on("click", "#clickPaste", function()
	{
		var x1 = $(this).offset().left;
		var x2 = $(navPage).offset().left;
		var y1 = $(this).offset().top;
		var y2 = $(navPage).offset().top;
		var x  = (x1-x2)+ "px";
		var y  = (y1-y2)+ "px";
		zIndexT  =  zIndexT + 1;//更新层级
		var cla = copylone.css({"left":x,"top":y,"z-index":zIndexT})
		var	copyClass = cla.attr("style");
		var	copyRid   = copylone.attr("rid");
		var copyClone = copylone.find(".canvas-con");
		var copy      = copyClone[0].outerHTML;
		var type ="";
		if(copyRid == 1) type = "text";
		if(copyRid == 3) type = "temp_Group";
		if(copyRid == 4) type = "book_Group";
		var paste = 
			'<div class="canvas canvasId '+ type +'" style="'+ copyClass + '" rid="'+ copyRid +'" Lid="0" id="copyECharts">'+ copy +'</div>';
		$(navPage).append(paste);
		new_draggable($(".canvasId"));
		if(copyRid == 3 || copyRid == 4)
		{
			$(".canvasId").find(".resiz_canvas").each(function()
			{
				zIndexT  =  zIndexT + 1;//更新层级
				$(this).css("z-index",zIndexT);
			})
		}else
		{
			new_resizable($(".canvasId"));
			new_transformable($(".canvasId"));
		}
		copyECharts($("#copyECharts"))//调用复制或剪切调用方法
		clickPaste_del();
		new_Edit = -1;//初始化调用素材面板
		newFunction("F2");//画布与素材编辑栏切换
		newEdit(copyRid,0);//调用素材编辑面板
		$("#copyECharts").removeAttr("id");
		
	});
	//组合
	$(document).on("click", "#mouse-com", function()
	{
		book_Group();
	});
	//取消组合
	$(document).on("click", "#mouse-comNo", function()
	{
		book_Group_del();
	});
	//上移一层
	$(document).on("click", "#mouse_Move", function()
	{
		mouse_Move();
	});
	//下移一层
	$(document).on("click", "#mouse_Down", function()
	{
		mouse_Down();
	});
	//置于顶层
	$(document).on("click", "#mouseTop", function()
	{
		mouseTop();
	});
	//置于底层
	$(document).on("click", "#mouseBottom", function()
	{
		mouseBottom();
	});
	//锁定
	$(document).on("click", "#mouseLocking", function()
	{
		mouseLocking();
	});
	//删除
	$(document).on("click", "#mouse-Delete", function()
	{
		canvas_delect();
	});
	//左对齐
	$(document).on("click", "#LeftAlignment", function()
	{
		book_left();
	});
	//水平居中对齐
	$(document).on("click", "#levelAlignment", function()
	{
		book_Scenter();
	});
	//右对齐
	$(document).on("click", "#RightAlignment", function()
	{
		book_right();
	});
	//上对齐
	$(document).on("click", "#topAlignment", function()
	{
		book_top();
	});
	//垂直居中对齐
	$(document).on("click", "#verticalAlignment", function()
	{
		book_center();
	});
	//下对齐
	$(document).on("click", "#bottomAlignment", function()
	{
		book_bottom();
	});
	//水平等间距 
	$(document).on("click", "#HorizontalEquidistance", function()
	{
		book_Horizontal();
	});
	//垂直等间距
	$(document).on("click", "#VerticalEquidistance", function()
	{
		book_Vertical();
	});
	//添加等宽等高标识
	$(document).on("click", ".resiz_canvas", function()
	{
		if(!$(this).hasClass("Equal"))
		{
			$(".Equal").removeClass("Equal");
			$(this).addClass("Equal");
		}
	});
	//等宽
	$(document).on("click", "#EqualWidth", function()
	{
		new_EqualWidth();
	});
	//等高
	$(document).on("click", "#EqualHeight", function()
	{
		new_EqualHeight();
	});
	//同角度
	$(document).on("click", "#EqualAngle", function()
	{
		new_EqualAngle();
	});
	//同宽高
	$(document).on("click", "#EqualWH", function()
	{
		new_EqualWH();
	});
	/************** 监听键盘快捷键 ****************/
	$(document).on("keydown", function(event)
	{
		var key = event.which;
		//功能切换
		if (event.ctrlKey && event.keyCode === 81)
		{
			$(".Choice").each(function()
			{
				if($(this).hasClass("ChoiceB"))
				{
					$(this).removeClass("ChoiceB");
					var id = $(this).attr("href");
					if(id == 0)
					{
						$("#pc-canvas").hide();//禁用移动画布
					}else if(id == 1)
					{
						$("#pc-canvas").show();//启用移动画布
					}
				}else
				{
					$(this).addClass("ChoiceB");
				}
			})
		}
		//是否显示辅助线
		if (event.ctrlKey && event.keyCode === 65)
		{
			auxiliary("#auxiliary");
		}
		/***删除***/
		if (event.keyCode === 46)
		{
			canvas_delect();
		}
		/***剪切***/
		if (event.ctrlKey && event.keyCode === 88)
		{
			if($(".canvasId").length != 0)
			{
				var Lid = $(".canvasId").attr("Lid");
				if(Lid == 0)//未锁定
				{
					if($(".canvasId").find(".addModal").length ==0)
					{
						newCopy($(".canvasId"),0);//调用剪切复制方法
						$(".canvasId").remove();
						mouseR_dele();
						newFunction("F1");//画布与素材编辑栏切换
					}else{
						
						tooltips("模态框禁止剪切!","Warning");
					}
				}else
				{
					tooltips("素材已锁定禁止剪切！","Warning");
				}
			}else
			{
				tooltips("你还没有选择任何元素！","Warning");
			}
		}
		/***复制***/
		if (event.ctrlKey && event.keyCode === 67)
		{
			if($(".canvasId").length != 0)
			{
				var Lid = $(".canvasId").attr("Lid");
				if(Lid == 0)//未锁定
				{
					if($(".canvasId").find(".addModal").length ==0)
					{
						newCopy($(".canvasId"));//调用剪切复制方法
					}else{
						
						tooltips("模态框禁止复制!","Warning");
					}
				}else
				{
					tooltips("素材已锁定禁止复制！","Warning");
				}
			}else
			{
				tooltips("你还没有选择任何元素！","Warning");
			}
		}
		/***粘贴***/
		if (event.ctrlKey && event.keyCode === 86)
		{ 
			if(copylone != 0)
			{
				var isFocus = $("#nameModal").is(":focus");//输入框获取焦点是禁止粘贴 
				if(isFocus == false)
				{
					Group_del();//未组合前解除组合
					var _x  = _x1 + 50 +"px";
					var _y = _y1 + 50 +"px";
						zIndexT  =  zIndexT + 1;
					var Class = copylone.css({"left":_x,"top":_y,"z-index":zIndexT});
					var	copyClass = Class.attr("style");
					var	copyRid   = copylone.attr("rid");
					var copyClone = copylone.children(".canvas-con");
					var copy      = copyClone[0].outerHTML;
					var type ="";
					if(copyRid == 1) type = "text";
					if(copyRid == 3) type = "temp_Group";
					if(copyRid == 4) type = "book_Group";
					var paste = 
						'<div class="canvas pasteID '+ type +'" style="'+ copyClass + '" rid="'+ copyRid +'" Lid="0" id="copyECharts">'+ copy +'</div>';
					var add = $(navPage).append(paste);
					copyECharts($("#copyECharts"))//复制或剪切调用方法
					new_draggable($(navPage+"> .pasteID"));
					if(copyRid == 3 || copyRid == 4)
					{
						$(navPage+"> .pasteID").find(".resiz_canvas").each(function()
						{
							zIndexT  =  zIndexT + 1;//更新层级
							$(this).css("z-index",zIndexT);
						})
					}
					$(navPage+"> .pasteID").removeClass("pasteID");
					$("#copyECharts").removeAttr("id");
				}
			}
		}
		/***上移一层***/
		if (event.ctrlKey && !event.shiftKey && event.keyCode === 219)
		{ 
			mouse_Move();
		}
		/***置于顶层***/
		if (event.ctrlKey && event.shiftKey && event.keyCode === 219)
		{ 
			mouseTop();
		}
		/***下移一层***/
		if (event.ctrlKey && !event.shiftKey && event.keyCode === 221)
		{ 
			mouse_Down();
		}
		/***置于底层***/
		if (event.ctrlKey && event.shiftKey && event.keyCode === 221)
		{ 
			mouseBottom();
		}
		/***锁定解锁***/
		if (event.ctrlKey && event.shiftKey && event.keyCode === 76)
		{ 
			mouseLocking();
		}
		/*** 组合 ***/
		if (event.ctrlKey && !event.shiftKey && event.keyCode === 71)
		{
			book_Group();
		}
		/*** 取消组合 ***/
		if (event.ctrlKey && event.shiftKey && event.keyCode === 71)
		{ 
			book_Group_del();
		}
		//上
		if(key == 38)
		{
			element_move("t");
		}
		//下
		if(key == 40)
		{
			element_move("b");
		}
		//左
		if(key == 37)
		{
			element_move("l");
		}
		//右
		if(key == 39)
		{
			element_move("r");
		}
	});
	//复制和剪切方法	
	function newCopy(id,type)
	{
		copylone = id.clone();//克隆元素
		_w   = id.width();//获取元素宽高
		_h   = id.height();
		_x1 = Number(id.css("left").replace(/[a-z]/g,""));
		_y1 = Number(id.css("top").replace(/[a-z]/g,""));
		//剪切
		if(type == 0){
			id.remove();//剪切后删除元素本身
		}
	}
});
/*****************************鼠标按下 相关事件*******************************/
$(function()
{
	$(document).on("mousedown",function(e)
	{
		var key =  e.which; //获取鼠标键位  
		if(key == 1 || key == 3)//如果鼠标左键按下
		{  
			var IDcanvas = $(".canvasId").length;
			var target = $(e.target);
			//如果有已经选中的素材
			if(IDcanvas != 0)
			{
				if(target.closest(".canvasId").length == 0 && target.closest("#mouseR").length == 0 && target.closest("#pc-right").length == 0 && target.closest(".sp-container").length == 0 && target.closest(".edui-default").length == 0 && target.closest("#dialog-box-mask").length == 0 && target.closest(".dialog-box-container").length == 0)
				{
					if($(".canvasId").hasClass("txtId"))
					{
						var $target = $("#editNo");
						var content = $target.html();
						var currentParnet = ue.container.parentNode.parentNode;
						var currentContent = ue.getContent();
						$target.html('');
						$target.append(ue.container.parentNode);
						ue.reset();
						setTimeout(function(){
							ue.setContent(content);
						},200)
						$(currentParnet).html(currentContent);
						new_draggable($(".txtId"));
						$(".canvasTextNone").show();
						$("#new-ueditorNone").show();
						$(".txtId").removeClass("txtId");
					}
					$("#pc-edit").find(".ui-resizable").resizable("destroy");
					$("#pc-edit").find(".canvas").transformable('destroy');
					$(".canvasId").removeClass("canvasId");
					mouseR_dele();//删除右键功能模板
					if(target.closest("#navNone").length == 0)
					{
						newFunction("F1");//画布与素材编辑栏切换
					}
				};
				if(target.closest(".canvasId").length == 0 && target.closest("#mouseR").length == 0)
				{
					mouseR_dele();//删除右键功能模板
				};
			}else
			{
				newFunction("F1");//画布与素材编辑栏切换
			}
		}
		//是否存在粘贴按钮
		if(key == 1)
		{
			if($("#clickPaste").length != 0)
			{
				if(target.closest("#clickPaste").length == 0)
				{
					$("#clickPaste").remove();
				}
			}
		}
		//未成组删除组合
		if($("#pc-center").find(".temp_Group").length != 0)
		{
			if(target.closest(".temp_Group").length == 0 && target.closest("#mouseR").length == 0 && target.closest("#pc-right").length == 0)
			{
				Group_del();
			}
		}
	})
});